package com.example.agro.dto;

import lombok.Data;

@Data
public class YieldResponse {
    private double predictedYield;
    private String unit; // e.g., "tph"
    private double confidence;
    private String datasetUsed;
}
