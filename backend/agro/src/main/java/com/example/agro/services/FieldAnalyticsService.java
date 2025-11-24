package com.example.agro.services;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.agro.dto.AdvisoryResultDto;
import com.example.agro.dto.CropRecommendationResponse;
import com.example.agro.dto.DiseaseResponse;
import com.example.agro.dto.FieldAnalyticsResponse;
import com.example.agro.dto.RecommendationResultDto;
import com.example.agro.dto.YieldResponse;

@Service
public class FieldAnalyticsService {

    private final PythonMLService pythonMLService;
    private final DotNetRecommendationService dotNetRecommendationService;
    private final DotNetAdvisoryService dotNetAdvisoryService;

    public FieldAnalyticsService(PythonMLService pythonMLService,
                                 DotNetRecommendationService dotNetRecommendationService,
                                 DotNetAdvisoryService dotNetAdvisoryService) {
        this.pythonMLService = pythonMLService;
        this.dotNetRecommendationService = dotNetRecommendationService;
        this.dotNetAdvisoryService = dotNetAdvisoryService;
    }

    /**
     * Orchestrates calls to Python ML service and .NET services and returns a detailed aggregated response.
     * @param payload Map-like input expected to contain spectral, agro, crop, variety, growth_stage, dataset_url
     */
    @SuppressWarnings("unchecked")
    public FieldAnalyticsResponse analyzeField(Map<String, Object> payload) {

        FieldAnalyticsResponse response = new FieldAnalyticsResponse();

        // --- 1) Prepare a YieldRequest-lite for the python service (we don't have strong typed request here)
        Map<String, Object> spectral = payload.containsKey("spectral") ? (Map<String, Object>) payload.get("spectral") : null;
        Map<String, Object> agro = payload.containsKey("agro") ? (Map<String, Object>) payload.get("agro") : new HashMap<>();
        String crop = payload.getOrDefault("crop", "").toString();
        String variety = payload.getOrDefault("variety", "").toString();
        String growthStage = payload.getOrDefault("growth_stage", "").toString();
        String datasetUrl = payload.getOrDefault("dataset_url", "/mnt/data/enhanced_agri_dataset.csv").toString();

        // Build a simple YieldRequest object to reuse PythonMLService method
        com.example.agro.dto.YieldRequest yr = new com.example.agro.dto.YieldRequest();
        yr.setSpectral(spectral);
        yr.setAgro(agro);
        yr.setCrop(crop);
        yr.setVariety(variety);
        yr.setGrowth_stage(growthStage);
        yr.setDataset_url(datasetUrl);

        // 1. Call Python yield predictor
        YieldResponse yieldResp = pythonMLService.predictYield(yr);
        yieldResp.setDatasetUsed(datasetUrl);
        response.setYield(yieldResp);

        // 2. Call Python crop recommender
        Map<String, Object> cropPayload = new HashMap<>();
        cropPayload.put("agro", agro);
        cropPayload.put("dataset_url", datasetUrl);
        Map<String, Object> cropRec = pythonMLService.predictCrop(cropPayload);
        CropRecommendationResponse cropRecDto = new CropRecommendationResponse();
        cropRecDto.setRecommendedCrop(String.valueOf(cropRec.getOrDefault("recommended_crop", "unknown")));
        cropRecDto.setDetails(cropRec);
        cropRecDto.setDatasetUsed(datasetUrl);
        response.setCropRecommendation(cropRecDto);

        // 3. Disease detection
        Map<String, Object> diseasePayload = new HashMap<>();
        diseasePayload.put("spectral", spectral);
        diseasePayload.put("agro", agro);
        Map<String, Object> diseaseResult = pythonMLService.predictDisease(diseasePayload);
        DiseaseResponse dresp = new DiseaseResponse();
        dresp.setDiseaseStatus(String.valueOf(diseaseResult.getOrDefault("disease_status", "unknown")));
        Object hs = diseaseResult.get("health_score");
        dresp.setHealthScore(hs == null ? 0.0 : Double.parseDouble(String.valueOf(hs)));
        dresp.setDetails(diseaseResult);
        response.setDisease(dresp);

        // 4. Dotnet recommendation (fertilizer)
        Map<String, Object> dotnetPayload = new HashMap<>();
        dotnetPayload.put("soil", agro);
        dotnetPayload.put("crop", crop);
        dotnetPayload.put("dataset_url", datasetUrl);
        Map<String, Object> dotnetRec = dotNetRecommendationService.getRecommendations(dotnetPayload);

        RecommendationResultDto recDto = new RecommendationResultDto();
        recDto.setCrop(String.valueOf(dotnetRec.getOrDefault("crop", crop)));
        // try to read recommendations list
        Object recs = dotnetRec.get("recommendations");
        if (recs instanceof java.util.List) {
            recDto.setRecommendations((java.util.List<String>) recs);
        }
        Object conf = dotnetRec.get("confidenceScore");
        recDto.setConfidenceScore(conf == null ? 0.0 : Double.parseDouble(String.valueOf(conf)));
        recDto.setDatasetUrlUsed(String.valueOf(dotnetRec.getOrDefault("datasetUrlUsed", datasetUrl)));
        response.setNutrientRecommendation(recDto);

        // 5. Dotnet advisory
        Map<String, Object> advisoryPayload = new HashMap<>();
        advisoryPayload.put("DiseaseProb", dresp.getHealthScore()); // disease prob used as proxy
        advisoryPayload.put("Rainfall", agro.getOrDefault("Rainfall", 0));
        advisoryPayload.put("Temperature", agro.getOrDefault("Temperature", 28));
        advisoryPayload.put("SoilMoisture", agro.getOrDefault("SoilMoisture", agro.getOrDefault("soil_moisture", 50)));
        advisoryPayload.put("DatasetUrl", datasetUrl);

        Map<String, Object> advisoryRespRaw = dotNetAdvisoryService.getAdvisory(advisoryPayload);
        AdvisoryResultDto advDto = new AdvisoryResultDto();
        advDto.setDatasetUrlUsed(String.valueOf(advisoryRespRaw.getOrDefault("datasetUrlUsed", datasetUrl)));
        Object risk = advisoryRespRaw.get("riskScore");
        advDto.setRiskScore(risk == null ? 0.0 : Double.parseDouble(String.valueOf(risk)));
        Object msgs = advisoryRespRaw.get("messages");
        if (msgs instanceof java.util.List) {
            advDto.setMessages((java.util.List<String>) msgs);
        }
        Object ts = advisoryRespRaw.get("timestamp");
        advDto.setTimestamp(ts == null ? DateTimeFormatter.ISO_INSTANT.format(Instant.now()) : ts.toString());
        response.setAdvisory(advDto);

        // 6. Aggregate overall risk and health score
        double diseaseRisk = dresp.getHealthScore(); // 0..1
        double advisoryRisk = advDto.getRiskScore(); // 0..1
        double nutrientConf = recDto.getConfidenceScore(); // 0..1

        // Simple weighted aggregation
        double overallRisk = Math.min(1.0, 0.5 * diseaseRisk + 0.3 * advisoryRisk + 0.2 * (1 - nutrientConf));
        double healthScore = Math.max(0.0, 1.0 - overallRisk);

        response.setOverall_risk(Math.round(overallRisk * 100.0) / 100.0);
        response.setHealth_score(Math.round(healthScore * 100.0) / 100.0);

        // recommendation string
        StringBuilder action = new StringBuilder();
        if (recDto.getRecommendations() != null && !recDto.getRecommendations().isEmpty()) {
            action.append(recDto.getRecommendations().get(0));
        }
        if (advisoryRespRaw.containsKey("messages")) {
            action.append(" | Advisory: ").append(advisoryRespRaw.get("messages").toString());
        }
        response.setRecommended_action(action.length() > 0 ? action.toString() : "No immediate action.");

        response.setDataset_url_used(datasetUrl);

        return response;
    }
}
