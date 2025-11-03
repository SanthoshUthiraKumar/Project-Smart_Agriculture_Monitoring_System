using System.Text.Json.Serialization;

namespace dotnet_service.Models // Note: namespace may be based on your folder name
{
    public class YieldReportData
    {
        [JsonPropertyName("uniqueDataId")]
        public string? UniqueDataId { get; set; }

        [JsonPropertyName("predictedYield")]
        public double PredictedYield { get; set; }

        [JsonPropertyName("soilMoisture")]
        public double SoilMoisture { get; set; }

        [JsonPropertyName("temperature")]
        public double Temperature { get; set; }
        
        [JsonPropertyName("timestamp")]
        public DateTime Timestamp { get; set; }
    }
}