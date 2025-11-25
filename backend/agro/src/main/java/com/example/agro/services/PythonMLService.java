package com.example.agro.services;

import com.example.agro.dto.DiseaseRequest;
import com.example.agro.dto.DiseaseResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class PythonMLService {

    @Autowired
    private WebClient pythonWebClient;

    public DiseaseResponse predictDisease(DiseaseRequest req) {
        DiseaseResponse out = new DiseaseResponse();
        try {
            // if image provided, send to python dedicataed endpoint
            if (req.image_base64 != null && !req.image_base64.isBlank()) {
                Map<String, Object> payload = Map.of("image_base64", req.image_base64);
                Map<String, Object> resp = pythonWebClient.post()
                        .uri("/predict/disease")
                        .bodyValue(payload)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .block();

                out.status = (String) resp.getOrDefault("status", "ok");
                out.disease = (String) resp.getOrDefault("disease", "unknown");
                out.probability = ((Number) resp.getOrDefault("probability", 0.0)).doubleValue();
                return out;
            }

            // if spectral/agro provided
            if (req.spectral != null) {
                Map<String, Object> payload = Map.of("spectral", req.spectral, "agro", req.agro);
                Map<String, Object> resp = pythonWebClient.post()
                        .uri("/predict/disease")
                        .bodyValue(payload)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .block();

                out.status = (String) resp.getOrDefault("status", "ok");
                out.disease = (String) resp.getOrDefault("disease", "unknown");
                out.probability = ((Number) resp.getOrDefault("probability", 0.0)).doubleValue();
                return out;
            }

            out.status = "bad_request";
            out.disease = "no_input";
            out.probability = 0.0;
            return out;

        } catch (Exception e) {
            out.status = "error";
            out.disease = "error";
            out.probability = 0.0;
            return out;
        }
    }
}
