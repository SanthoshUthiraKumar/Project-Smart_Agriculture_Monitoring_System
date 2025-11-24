package com.example.agro.dto;

import lombok.Data;
import java.util.Map;

@Data
public class DiseaseResponse {
    private String diseaseStatus;
    private double healthScore;
    private Map<String, Object> details;
}
