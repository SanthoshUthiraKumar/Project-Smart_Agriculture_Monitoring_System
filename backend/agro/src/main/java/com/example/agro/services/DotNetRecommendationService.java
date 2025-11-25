package com.example.agro.services;

import com.example.agro.dto.CropRecommendationRequest;
import com.example.agro.dto.CropRecommendationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class DotNetRecommendationService {

    @Autowired
    private WebClient dotnetWebClient;

    public CropRecommendationResponse recommendCrop(CropRecommendationRequest req) {
        try {
            Map resp = dotnetWebClient.post()
                    .uri("/recommend/crop")
                    .bodyValue(req)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            CropRecommendationResponse out = new CropRecommendationResponse();
            out.status = (String) resp.getOrDefault("status", "ok");
            out.recommendations = (java.util.List<Map<String, Object>>) resp.getOrDefault("recommendations", java.util.List.of());
            return out;
        } catch (Exception e) {
            CropRecommendationResponse out = new CropRecommendationResponse();
            out.status = "error";
            out.recommendations = java.util.List.of();
            return out;
        }
    }
}
