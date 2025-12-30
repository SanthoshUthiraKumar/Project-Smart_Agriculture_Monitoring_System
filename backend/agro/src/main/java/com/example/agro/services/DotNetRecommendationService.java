// package com.example.agro.services;

// import com.example.agro.dto.CropRecommendationRequest;
// import com.example.agro.dto.CropRecommendationResponse;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import org.springframework.web.reactive.function.client.WebClient;

// import java.util.Map;

// @Service
// public class DotNetRecommendationService {

//     @Autowired
//     private WebClient dotnetWebClient;

//     public CropRecommendationResponse recommendCrop(CropRecommendationRequest req) {
//         try {
//             Map resp = dotnetWebClient.post()
//                     .uri("/recommend/crop")
//                     .bodyValue(req)
//                     .retrieve()
//                     .bodyToMono(Map.class)
//                     .block();

//             CropRecommendationResponse out = new CropRecommendationResponse();
//             out.status = (String) resp.getOrDefault("status", "ok");
//             out.recommendations = (java.util.List<Map<String, Object>>) resp.getOrDefault("recommendations", java.util.List.of());
//             return out;
//         } catch (Exception e) {
//             CropRecommendationResponse out = new CropRecommendationResponse();
//             out.status = "error";
//             out.recommendations = java.util.List.of();
//             return out;
//         }
//     }
// }


package com.example.agro.services;

import com.example.agro.dto.CropRecommendationRequest;
import com.example.agro.dto.CropRecommendationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference; // Import this
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class DotNetRecommendationService {

    @Autowired
    private WebClient dotnetWebClient;

    public CropRecommendationResponse recommendCrop(CropRecommendationRequest req) {
        try {
            // FIX 1: Use Map<String, Object> instead of raw Map
            Map<String, Object> resp = dotnetWebClient.post()
                    .uri("/recommend/crop")
                    .bodyValue(req)
                    .retrieve()
                    // FIX 2: Use ParameterizedTypeReference to safely map JSON to Map<String, Object>
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                    .block();

            CropRecommendationResponse out = new CropRecommendationResponse();
            
            // FIX 3: Safe checks (resp could be null if block() fails silently)
            if (resp != null) {
                out.status = (String) resp.getOrDefault("status", "ok");
                
                // Suppress warning for this specific cast, as we know the structure
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> recs = (List<Map<String, Object>>) resp.getOrDefault("recommendations", List.of());
                out.recommendations = recs;
            } else {
                out.status = "error";
                out.recommendations = List.of();
            }
            
            return out;
            
        } catch (Exception e) {
            CropRecommendationResponse out = new CropRecommendationResponse();
            out.status = "error";
            out.recommendations = List.of();
            return out;
        }
    }
}