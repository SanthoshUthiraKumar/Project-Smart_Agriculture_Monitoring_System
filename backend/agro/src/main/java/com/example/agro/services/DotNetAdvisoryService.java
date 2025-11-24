package com.example.agro.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.Map;
import java.util.HashMap;

@Service
public class DotNetAdvisoryService {

    private final RestTemplate restTemplate;
    private final String advisoryBaseUrl;

    public DotNetAdvisoryService(RestTemplate restTemplate,
                                 @Value("${services.dotnet-advisory.base-url}") String advisoryBaseUrl) {
        this.restTemplate = restTemplate;
        this.advisoryBaseUrl = advisoryBaseUrl;
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getAdvisory(Map<String, Object> payload) {
        try {
            String url = advisoryBaseUrl + "/api/advisory";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            ResponseEntity<Map> resp = restTemplate.postForEntity(url, entity, Map.class);
            if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
                return (Map<String, Object>) resp.getBody();
            } else {
                Map<String, Object> fallback = new HashMap<>();
                fallback.put("error", "advisory_service_non_2xx");
                return fallback;
            }
        } catch (Exception ex) {
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("error", "advisory_service_exception");
            fallback.put("message", ex.getMessage());
            return fallback;
        }
    }
}
