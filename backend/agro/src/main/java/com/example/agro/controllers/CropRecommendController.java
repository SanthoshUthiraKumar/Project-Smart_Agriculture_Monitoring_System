package com.example.agro.controllers;

import com.example.agro.dto.CropRecommendationRequest;
import com.example.agro.dto.CropRecommendationResponse;
import com.example.agro.services.DotNetRecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/recommend")
public class CropRecommendController {

    @Autowired
    private DotNetRecommendationService recommendationService;

    @PostMapping("/crop")
    public ResponseEntity<CropRecommendationResponse> recommend(@RequestBody CropRecommendationRequest req) {
        CropRecommendationResponse resp = recommendationService.recommendCrop(req);
        return ResponseEntity.ok(resp);
    }
}
