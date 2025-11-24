package com.example.agro.services;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.agro.dto.YieldRequest;
import com.example.agro.dto.YieldResponse;

@Service
public class PythonMLService {

    private final RestTemplate restTemplate;
    private final String pythonBaseUrl;

    public PythonMLService(RestTemplate restTemplate,
                           @Value("${services.python-ml.base-url}") String pythonBaseUrl) {
        this.restTemplate = restTemplate;
        this.pythonBaseUrl = pythonBaseUrl;
    }

    public YieldResponse predictYield(YieldRequest req) {
        String url = pythonBaseUrl + "/predict/yield";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Build payload. We include dataset_url as the local path you uploaded so infra can map it.
        Map<String, Object> payload = new HashMap<>();
        payload.put("spectral", req.getSpectral());
        payload.put("agro", req.getAgro());
        // IMPORTANT: include the local path as the dataset_url per your environment
        if (req.getDataset_url() != null) {
            payload.put("dataset_url", req.getDataset_url());
        } else {
            // example fallback (developer: they asked this exact local path be passed)
            payload.put("dataset_url", "/mnt/data/enhanced_agri_dataset.csv");
        }
        payload.put("crop", req.getCrop());
        payload.put("variety", req.getVariety());
        payload.put("growth_stage", req.getGrowth_stage());

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        ResponseEntity<YieldResponse> response = restTemplate.postForEntity(url, entity, YieldResponse.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            return response.getBody();
        } else {
            YieldResponse er = new YieldResponse();
            er.setPredictedYield(-1);
            er.setUnit("tph");
            er.setConfidence(0.0);
            return er;
        }
    }

    public Map<String, Object> predictCrop(Map<String, Object> payload) {
        String url = pythonBaseUrl + "/predict/crop";
        return restTemplate.postForObject(url, payload, Map.class);
    }

    public Map<String, Object> predictDisease(Map<String, Object> payload) {
        String url = pythonBaseUrl + "/predict/disease";
        return restTemplate.postForObject(url, payload, Map.class);
    }
}
