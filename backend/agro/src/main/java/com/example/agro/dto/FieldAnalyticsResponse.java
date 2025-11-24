package com.example.agro.dto;

import lombok.Data;

@Data
public class FieldAnalyticsResponse {
    private YieldResponse yield;
    private CropRecommendationResponse cropRecommendation;
    private DiseaseResponse disease;
    private RecommendationResultDto nutrientRecommendation;
    private AdvisoryResultDto advisory;
    private double overall_risk;
    private double health_score;
    private String recommended_action;
    private String dataset_url_used;
}
