package com.example.agro.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.example.agro.dto.AlertDto;
import com.example.agro.services.AlertService;

@RestController
@RequestMapping("/api/v1/analytics")
public class AlertsController {

    @Autowired
    private AlertService alertService;

    // SSE subscription for clients
    @GetMapping(value = "/alerts/sse", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamAlerts() {
        return alertService.createEmitter();
    }

    // Python (simulator) posts alerts here
    @PostMapping("/alerts")
    public Map<String, Object> receiveAlert(@RequestBody AlertDto alert) {
        boolean accepted = alertService.storeAndPublish(alert);
        if (!accepted) return Map.of("status", "ignored_cooldown");
        return Map.of("status", "ok");
    }

    // When user clicks "Apply Fix" the frontend calls adjust (existing endpoint) which should call Python and then, after fix, you can call this endpoint
    @PostMapping("/alerts/clear")
    public Map<String, Object> clearAlerts(@RequestBody Map<String, Object> body) {
        Integer fieldId = (Integer) body.get("fieldId");
        if (fieldId == null) return Map.of("status", "error", "message", "fieldId required");
        alertService.clearAlertsForField(fieldId);
        return Map.of("status", "cleared", "fieldId", fieldId);
    }
}
