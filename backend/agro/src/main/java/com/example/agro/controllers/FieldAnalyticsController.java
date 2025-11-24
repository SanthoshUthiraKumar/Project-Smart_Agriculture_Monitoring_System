package com.example.agro.controllers;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.agro.dto.FieldAnalyticsResponse;
import com.example.agro.services.FieldAnalyticsService;

@RestController
@RequestMapping("/api/v1/analytics")
public class FieldAnalyticsController {

    private final FieldAnalyticsService analyticsService;

    public FieldAnalyticsController(FieldAnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @PostMapping("/field")
    public ResponseEntity<FieldAnalyticsResponse> analyzeField(@RequestBody Map<String, Object> payload) {
        FieldAnalyticsResponse resp = analyticsService.analyzeField(payload);
        return ResponseEntity.ok(resp);
    }
}
