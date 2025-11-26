package com.example.agro.services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.example.agro.dto.AlertDto;

@Service
public class AlertService {

    // active emitters
    private final Set<SseEmitter> emitters = new CopyOnWriteArraySet<>();

    // active alerts stored: fieldId -> (type -> AlertDto)
    private final ConcurrentMap<Integer, ConcurrentMap<String, AlertDto>> activeAlerts = new ConcurrentHashMap<>();

    // cooldown map to prevent duplicates: key = fieldId_type -> lastSentMillis
    private final ConcurrentMap<String, Long> lastSent = new ConcurrentHashMap<>();
    private final long COOLDOWN_MS = 5 * 60 * 1000L; // 5 minutes cooldown

    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    public AlertService() {
        // heartbeat so proxies don't kill connection
        scheduler.scheduleAtFixedRate(this::sendHeartbeat, 15, 15, TimeUnit.SECONDS);
    }

    public SseEmitter createEmitter() {
        SseEmitter emitter = new SseEmitter(0L);
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError((e) -> emitters.remove(emitter));

        // send initial state of active alerts so client can display existing ones
        try {
            emitter.send(SseEmitter.event().name("initial").data(activeAlertsAsMap()));
        } catch (Exception ignored) {}

        return emitter;
    }

    // store + publish alert; respects cooldown
    public boolean storeAndPublish(AlertDto alert) {
        String key = alert.fieldId + "_" + alert.type;
        long now = System.currentTimeMillis();
        Long last = lastSent.get(key);
        if (last != null && now - last < COOLDOWN_MS) {
            // ignore duplicate within cooldown
            return false;
        }
        lastSent.put(key, now);

        activeAlerts.computeIfAbsent(alert.fieldId, k -> new ConcurrentHashMap<>()).put(alert.type, alert);

        publishEvent(alert);
        return true;
    }

    // clear all alerts for a field (called after fix)
    public void clearAlertsForField(int fieldId) {
        if (activeAlerts.remove(fieldId) != null) {
            // broadcast a clear event
            Map<String,Object> payload = Map.of("fieldId", fieldId, "action", "cleared", "timestamp", System.currentTimeMillis());
            publishRaw(payload);
        }
    }

    // returns a serializable map snapshot
    public Map<Integer, Map<String, AlertDto>> activeAlertsAsMap() {
        Map<Integer, Map<String, AlertDto>> out = new HashMap<>();
        activeAlerts.forEach((fid, m) -> out.put(fid, new HashMap<>(m)));
        return out;
    }

    // publish typed AlertDto (safe send)
    public void publishEvent(AlertDto alert) {
        publishRaw(alert);
    }

    // internal raw publisher
    private void publishRaw(Object event) {
        List<SseEmitter> dead = new ArrayList<>();
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name("alert").data(event));
            } catch (IOException ioe) {
                dead.add(emitter);
            } catch (Exception ex) {
                dead.add(emitter);
            }
        }
        emitters.removeAll(dead);
    }

    private void sendHeartbeat() {
        Map<String,Object> hb = Map.of("heartbeat", System.currentTimeMillis());
        publishRaw(hb);
    }
}
