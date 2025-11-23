package com.example.agro.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.example.agro.DTOs.RecommendationRequestDTO;

@RestController
@RequestMapping("/api/recommend")
public class RecommendationController {

    @Autowired
    private RestTemplate restTemplate;

    @PostMapping("/crop")
    public ResponseEntity<String> getCropRecommendation(@RequestBody RecommendationRequestDTO request) {
        // URL of the .NET Recommendation Service (running on port 7001)
        String netServiceUrl = "http://localhost:7001/api/recommendations/suggest";

        try {
            // Forward the request to .NET and get the crop name back
            String response = restTemplate.postForObject(netServiceUrl, request, String.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error calling Recommendation Service: " + e.getMessage());
        }
    }
}