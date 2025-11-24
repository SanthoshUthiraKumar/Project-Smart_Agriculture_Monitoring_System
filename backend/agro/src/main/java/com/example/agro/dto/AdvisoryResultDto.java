package com.example.agro.dto;

import java.util.List;

import lombok.Data;

@Data
public class AdvisoryResultDto {
    private String datasetUrlUsed;
    private double riskScore;
    private List<String> messages;
    private String timestamp;
}
