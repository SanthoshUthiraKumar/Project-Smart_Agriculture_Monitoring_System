package com.example.agro.controllers;

import com.example.agro.dto.DiseaseRequest;
import com.example.agro.dto.DiseaseResponse;
import com.example.agro.services.PythonMLService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/disease")
public class DiseaseController {

    @Autowired
    private PythonMLService pythonMLService;

    @PostMapping("/predict")
    public ResponseEntity<DiseaseResponse> predict(@RequestBody DiseaseRequest req) {
        DiseaseResponse resp = pythonMLService.predictDisease(req);
        return ResponseEntity.ok(resp);
    }
}
