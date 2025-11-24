package com.example.agro.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.agro.dto.YieldRequest;
import com.example.agro.dto.YieldResponse;
import com.example.agro.services.PythonMLService;

@RestController
@RequestMapping("/api/v1/yield")
public class YieldController {

    private final PythonMLService pythonMLService;

    public YieldController(PythonMLService pythonMLService) {
        this.pythonMLService = pythonMLService;
    }

    @PostMapping("/predict")
    public ResponseEntity<YieldResponse> predictYield(@RequestBody YieldRequest req) {
        YieldResponse res = pythonMLService.predictYield(req);
        return ResponseEntity.ok(res);
    }
}
