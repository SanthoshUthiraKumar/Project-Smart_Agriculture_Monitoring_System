package com.example.agro.DTOs;

import lombok.Data;

@Data
public class YieldReportDTO  {
    private long id;
    private String uniqueDataId;
    private double predictedYield;
    private double soilMoisture;
    private double temperature;
    private String timestamp;
    private double lat;
    private double longitude;
}
