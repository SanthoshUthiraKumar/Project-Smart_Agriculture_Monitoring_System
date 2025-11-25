namespace SmartAgri.Recommendation.Models
{
    public class RecommendationRequest
    {
        // Soil, crop, area, rainfall etc.
        public SoilData Soil { get; set; }
        public string Crop { get; set; }
        public string Variety { get; set; }
        public string DatasetUrl { get; set; } // e.g., "/mnt/data/enhanced_agri_dataset.csv"
        public double AreaHectares { get; set; } = 1.0;
        public double Rainfall { get; set; } = 0.0;
    }
}
