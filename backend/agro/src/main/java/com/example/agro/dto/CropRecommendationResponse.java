package com.example.agro.dto;

import lombok.Data;
import java.util.Map;

@Data
public class CropRecommendationResponse {
    private String recommendedCrop;
    private Map<String, Object> details;
    private String datasetUsed;
}
