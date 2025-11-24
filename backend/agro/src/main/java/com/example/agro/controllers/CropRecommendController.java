package com.example.agro.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.agro.dto.CropRecommendationResponse;
import com.example.agro.services.PythonMLService;

@RestController
@RequestMapping("/api/v1/crop")
public class CropRecommendController {

    private final PythonMLService pythonMLService;

    public CropRecommendController(PythonMLService pythonMLService) {
        this.pythonMLService = pythonMLService;
    }

    @PostMapping
    public ResponseEntity<CropRecommendationResponse> recommendCrop(@RequestBody Map<String, Object> payload) {

        // Prepare payload for python ML
        Map<String, Object> req = new HashMap<>();
        req.put("agro", payload.get("agro"));
        req.put("dataset_url", payload.getOrDefault("dataset_url", "/mnt/data/enhanced_agri_dataset.csv"));

        Map<String, Object> pythonResp = pythonMLService.predictCrop(req);

        CropRecommendationResponse resp = new CropRecommendationResponse();
        resp.setRecommendedCrop(String.valueOf(pythonResp.get("recommended_crop")));
        resp.setDetails(pythonResp);
        resp.setDatasetUsed(String.valueOf(req.get("dataset_url")));

        return ResponseEntity.ok(resp);
    }
}
