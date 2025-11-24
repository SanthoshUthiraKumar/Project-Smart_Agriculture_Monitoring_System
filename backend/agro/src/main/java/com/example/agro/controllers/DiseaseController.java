package com.example.agro.controllers;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.agro.dto.DiseaseResponse;
import com.example.agro.services.PythonMLService;

@RestController
@RequestMapping("/api/v1/disease")
public class DiseaseController {

    private final PythonMLService pythonMLService;

    public DiseaseController(PythonMLService pythonMLService) {
        this.pythonMLService = pythonMLService;
    }

    @PostMapping
    public ResponseEntity<DiseaseResponse> detectDisease(@RequestBody Map<String, Object> payload) {

        Map<String, Object> pyResp = pythonMLService.predictDisease(payload);

        DiseaseResponse resp = new DiseaseResponse();
        resp.setDiseaseStatus(String.valueOf(pyResp.get("disease_status")));
        Object hs = pyResp.get("health_score");
        resp.setHealthScore(hs == null ? 0.0 : Double.parseDouble(String.valueOf(hs)));
        resp.setDetails(pyResp);

        return ResponseEntity.ok(resp);
    }
}
