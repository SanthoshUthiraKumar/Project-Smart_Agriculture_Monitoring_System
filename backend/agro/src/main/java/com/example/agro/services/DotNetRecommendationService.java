package com.example.agro.services;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class DotNetRecommendationService {
    private final RestTemplate restTemplate;
    private final String recommendationBaseUrl;

    public DotNetRecommendationService(RestTemplate restTemplate,
                                       @Value("${services.dotnet-recommendation.base-url}") String recommendationBaseUrl) {
        this.restTemplate = restTemplate;
        this.recommendationBaseUrl = recommendationBaseUrl;
    }

    public Map<String, Object> getRecommendations(Map<String, Object> payload) {
        String url = recommendationBaseUrl + "/api/recommend";
        return restTemplate.postForObject(url, payload, Map.class);
    }
}
