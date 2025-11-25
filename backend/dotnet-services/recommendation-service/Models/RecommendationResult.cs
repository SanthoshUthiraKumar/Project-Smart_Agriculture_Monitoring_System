using System.Collections.Generic;

namespace SmartAgri.Recommendation.Models
{
    public class RecommendationResult
    {
        public string Crop { get; set; }
        public List<string> Recommendations { get; set; } = new List<string>();
        public double ConfidenceScore { get; set; } = 0.0;
        public string DatasetUrlUsed { get; set; }
    }
}
