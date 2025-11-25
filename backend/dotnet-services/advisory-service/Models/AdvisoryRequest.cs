namespace SmartAgri.Advisory.Models
{
    public class AdvisoryRequest
    {
        public double DiseaseProb { get; set; } = 0.0;
        public double Rainfall { get; set; } = 0.0;
        public double Temperature { get; set; } = 28.0;
        public double SoilMoisture { get; set; } = 50.0;
        public string DatasetUrl { get; set; } // e.g., "/mnt/data/enhanced_agri_dataset.csv"
    }
}
