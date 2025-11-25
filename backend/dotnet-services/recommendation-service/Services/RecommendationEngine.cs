using SmartAgri.Recommendation.Models;
using System;

namespace SmartAgri.Recommendation.Services
{
    // Simple rule-based recommendation engine (can be replaced with ML later)
    public class RecommendationEngine : IRecommendationEngine
    {
        public RecommendationResult GenerateRecommendation(RecommendationRequest req)
        {
            var soil = req.Soil ?? new SoilData();
            var crop = req.Crop?.ToLower() ?? "unknown";

            // Basic rules:
            // - If Nitrogen low (<40) -> add N recommendation
            // - If P low (<15) -> add P recommendation
            // - If K low (<100) -> add K recommendation
            // Scale fertilizer recommendation by field area if provided.

            double areaHectares = req.AreaHectares > 0 ? req.AreaHectares : 1.0;

            var rec = new RecommendationResult {
                Crop = crop,
                Recommendations = new System.Collections.Generic.List<string>(),
                DatasetUrlUsed = req.DatasetUrl
            };

            if (soil.SoilN < 40) {
                double kgN = Math.Round(20 * areaHectares, 1);
                rec.Recommendations.Add($"Apply {kgN} kg N/ha (Urea) — to address N deficiency (Soil_N={soil.SoilN:F1})");
            } else {
                rec.Recommendations.Add("No nitrogen supplement recommended.");
            }

            if (soil.SoilP < 15) {
                double kgP2O5 = Math.Round(10 * areaHectares, 1);
                rec.Recommendations.Add($"Apply {kgP2O5} kg P2O5/ha (Single Super Phosphate) (Soil_P={soil.SoilP:F1})");
            } else {
                rec.Recommendations.Add("Phosphorus levels adequate.");
            }

            if (soil.SoilK < 120) {
                double kgK2O = Math.Round(25 * areaHectares, 1);
                rec.Recommendations.Add($"Apply {kgK2O} kg K2O/ha (MOP) (Soil_K={soil.SoilK:F1})");
            } else {
                rec.Recommendations.Add("Potassium levels adequate.");
            }

            // pH adjustment suggestion
            if (soil.SoilPH < 5.8) {
                rec.Recommendations.Add("Soil acidic: consider lime application to raise pH.");
            } else if (soil.SoilPH > 7.8) {
                rec.Recommendations.Add("Soil alkaline: consider sulfur-based amendments.");
            } else {
                rec.Recommendations.Add("Soil pH within acceptable range.");
            }

            // Add simple irrigation / fertilizer schedule hint
            if (req.Rainfall < 100) {
                rec.Recommendations.Add("Low rainfall expected — schedule irrigation and split fertilizer applications.");
            }

            // Add a computed score
            rec.ConfidenceScore = ComputeConfidenceScore(soil);

            return rec;
        }

        private double ComputeConfidenceScore(SoilData soil)
        {
            // simple normalized score 0-1 based on how many nutrients in ideal range
            int score = 0;
            if (soil.SoilN >= 40 && soil.SoilN <= 80) score++;
            if (soil.SoilP >= 15 && soil.SoilP <= 40) score++;
            if (soil.SoilK >= 120 && soil.SoilK <= 300) score++;
            if (soil.SoilPH >= 5.8 && soil.SoilPH <= 7.5) score++;

            return Math.Round(score / 4.0, 2);
        }
    }
}
