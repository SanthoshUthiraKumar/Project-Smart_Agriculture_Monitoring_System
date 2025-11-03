package com.example.agro.Controllers;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.example.agro.DTOs.SimulatorRequestDTO;
import com.example.agro.Models.SensorReading;
import com.example.agro.Repository.SensorReadingRepository;
import com.example.agro.Services.PredictionService;

@RestController
@RequestMapping("/api/data")
@CrossOrigin(origins = "http://localhost:5173")
public class DataProcessingController {

    @Autowired
    private PredictionService predictionService;

    @Autowired
    private SensorReadingRepository repository;

    @Autowired // Autowire the RestTemplate you defined in AppConfig
    private RestTemplate restTemplate;

    /**
     * This endpoint receives data from your Python simulator,
     * calls the ML service, and saves the result.
     */
    @PostMapping("/submit")
    public ResponseEntity<SensorReading> processAndSaveData(@RequestBody SimulatorRequestDTO request) {
        
        // 1. Call our service to get a prediction from the Flask API
        double yieldPrediction = predictionService.getPrediction(
            request.getSpectralFeatures(), 
            request.getIotFeatures()
        );

        // 2. Create the final SensorReading object to save
        SensorReading reading = new SensorReading();
        reading.setUniqueDataId(request.getUniqueId());
        
        // iotFeatures list is [soil_moisture, temperature]
        reading.setSoilMoisture(request.getIotFeatures().get(0));
        reading.setTemperature(request.getIotFeatures().get(1));
        
        reading.setPredictedYield(yieldPrediction);
        reading.setTimestamp(LocalDateTime.now());

        // 3. Save the final result to our H2 database
        SensorReading savedReading = repository.save(reading);

        // 4. Return the saved object as confirmation
        return ResponseEntity.ok(savedReading);
    }

    /**
     * This endpoint is for your React frontend. It gets all
     * the saved readings from the database.
     */
    @GetMapping("/all")
    public ResponseEntity<List<SensorReading>> getAllReadings() {
        List<SensorReading> readings = repository.findAll();
        return ResponseEntity.ok(readings);
    }

    @GetMapping("/yield-report")
    public ResponseEntity<Resource> getYieldReport() {
        // The URL of your .NET service (running on port 7000)
        String dotnetReportUrl = "http://localhost:7000/api/report/yield-report";

        try {
            // 1. Call the .NET API. We expect a raw byte array (the PDF)
            byte[] pdfBytes = restTemplate.getForObject(dotnetReportUrl, byte[].class);

            if (pdfBytes == null) {
                return ResponseEntity.status(500).body(null); // Handle error
            }

            // 2. Create a Spring Resource from the byte array
            ByteArrayResource resource = new ByteArrayResource(pdfBytes);

            // 3. Set HTTP headers to tell the browser it's a file download
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=yield_report.pdf");
            headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE);

            // 4. Return the file
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(pdfBytes.length)
                    .body(resource);

        } catch (Exception e) {
            System.err.println("Error calling .NET report service: " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }
}