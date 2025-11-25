package com.example.agro.dto;

/**
 * Accepts either base64 image or spectral/agro JSON.
 * For this project we support {"image_base64": "..."} OR {"spectral": [...], "agro": {...}}
 */
public class DiseaseRequest {
    public String image_base64;
    public double[] spectral;
    public java.util.Map<String, Object> agro;
}
