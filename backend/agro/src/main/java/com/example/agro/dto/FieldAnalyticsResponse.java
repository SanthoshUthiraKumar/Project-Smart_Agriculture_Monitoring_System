package com.example.agro.dto;

import java.util.List;
import java.util.Map;

public class FieldAnalyticsResponse {
    public String status;
    public String dataset_url;
    public List<Map<String, Object>> fields; // each field is a map (field-level JSON from Python)
}
