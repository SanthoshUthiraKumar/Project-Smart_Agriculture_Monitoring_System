// package com.example.agro.services;

// import java.util.List;
// import java.util.Map;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import org.springframework.web.reactive.function.client.WebClient;

// @Service
// public class FieldAnalyticsService {

//     @Autowired
//     private WebClient pythonWebClient;

//     @Autowired
//     private AlertService alertService;

//     public String startSimulation() {
//         try {
//             String res = pythonWebClient.get()
//                     .uri("/simulate/start")
//                     .retrieve()
//                     .bodyToMono(String.class)
//                     .block();
//             return "started";
//         } catch (Exception e) {
//             return "python_down";
//         }
//     }

//     public List<Map<String, Object>> getFields() {
//         try {
//             Map<String, Object> res = pythonWebClient.get()
//                     .uri("/simulate/fields")
//                     .retrieve()
//                     .bodyToMono(Map.class)
//                     .block();
//             // res expected to be {"status":"ok","fields":[...]}
//             if (res == null) return List.of();
//             Object fields = res.get("fields");
//             if (fields instanceof List) {
//                 return (List<Map<String, Object>>) fields;
//             }
//             return List.of();
//         } catch (Exception e) {
//             return List.of();
//         }
//     }

//     public Map<String, Object> adjustField(int fieldId) {
//         try {
//             Map<String,Object> payload = Map.of("fieldId", fieldId);
//             Map resp = pythonWebClient.post()
//                     .uri("/simulate/adjust")
//                     .bodyValue(payload)
//                     .retrieve()
//                     .bodyToMono(Map.class)
//                     .block();
//             return resp;
//         } catch (Exception e) {
//             return Map.of("status", "error", "message", e.getMessage());
//         }
//     }

//     public void applyFix(int fieldId) {
//         adjustField(fieldId);
//         alertService.clearAlertsForField(fieldId); // backend clears once
//     }


// }


package com.example.agro.services;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference; // Import added
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class FieldAnalyticsService {

    @Autowired
    private WebClient pythonWebClient;

    @Autowired
    private AlertService alertService;

    public String startSimulation() {
        try {
            // FIX 1: Removed unused variable "String res ="
            // We just execute the call and ignore the output if we don't need it.
            pythonWebClient.get()
                    .uri("/simulate/start")
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            return "started";
        } catch (Exception e) {
            return "python_down";
        }
    }

    public List<Map<String, Object>> getFields() {
        try {
            // FIX 2: Use ParameterizedTypeReference to ensure Type Safety
            Map<String, Object> res = pythonWebClient.get()
                    .uri("/simulate/fields")
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                    .block();

            if (res == null) return List.of();

            Object fields = res.get("fields");
            if (fields instanceof List) {
                // FIX 3: Suppress warning for the cast. 
                // We know it's a List from JSON, so this is safe to ignore here.
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> typedList = (List<Map<String, Object>>) fields;
                return typedList;
            }
            return List.of();
        } catch (Exception e) {
            return List.of();
        }
    }

    public Map<String, Object> adjustField(int fieldId) {
        try {
            Map<String, Object> payload = Map.of("fieldId", fieldId);
            
            // FIX 4: Properly typed Map response
            Map<String, Object> resp = pythonWebClient.post()
                    .uri("/simulate/adjust")
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                    .block();
            
            return resp;
        } catch (Exception e) {
            return Map.of("status", "error", "message", e.getMessage());
        }
    }

    public void applyFix(int fieldId) {
        adjustField(fieldId);
        alertService.clearAlertsForField(fieldId);
    }
}