package com.example.agro.dto;

import java.util.List;

import lombok.Data;

@Data
public class RecommendationResultDto {
    private String crop;
    private List<String> recommendations;
    private double confidenceScore;
    private String datasetUrlUsed;
}
