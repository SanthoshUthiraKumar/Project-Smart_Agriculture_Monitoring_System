package com.example.agro.dto;

import java.util.Map;

import lombok.Data;

@Data
public class YieldRequest {
    // Hyperspectral reflectance values (X437, X447, ... X2500)
    private Map<String, Object> spectral;

    // Agro features (NPK, pH, Rainfall, Irrigation, Temperature, etc.)
    private Map<String, Object> agro;

    // Local dataset path (developer requirement)
    private String dataset_url;

    private String crop;
    private String variety;
    private String growth_stage;
}
