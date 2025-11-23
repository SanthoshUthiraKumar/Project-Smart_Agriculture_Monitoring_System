package com.example.agro.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.agro.Models.SensorReading;
import com.example.agro.Repository.SensorReadingRepository;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private SensorReadingRepository repository;

    // Get all sensor readings for the charts and heatmap
    @GetMapping("/all")
    public ResponseEntity<List<SensorReading>> getAllReadings() {
        List<SensorReading> readings = repository.findAll();
        return ResponseEntity.ok(readings);
    }

    // Get just the latest reading for the gauges
    @GetMapping("/latest")
    public ResponseEntity<SensorReading> getLatestReading() {
        // Assuming ID is auto-incremented, the highest ID is the latest
        // Ideally, findTopByOrderByTimestampDesc() if you add that to Repository
        List<SensorReading> all = repository.findAll();
        if (all.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(all.get(all.size() - 1));
    }
}