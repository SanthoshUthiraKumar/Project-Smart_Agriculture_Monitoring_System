using SmartAgri.Advisory.Models;
using System;

namespace SmartAgri.Advisory.Services
{
    public class AdvisoryEngine : IAdvisoryEngine
    {
        public AdvisoryResult GenerateAdvisory(AdvisoryRequest req)
        {
            var advisory = new AdvisoryResult
            {
                DatasetUrlUsed = req.DatasetUrl,
                Timestamp = DateTime.UtcNow
            };

            // Compute risk score: combine disease prob, rainfall deficit, temp extremes
            double risk = 0.0;
            risk += req.DiseaseProb * 0.6;
            double rainfallFactor = Math.Max(0, 1 - (req.Rainfall / 200.0)); // if rainfall <200 -> increases risk
            risk += rainfallFactor * 0.25;
            if (req.Temperature > 34) risk += 0.15;

            advisory.RiskScore = Math.Round(Math.Min(1.0, risk), 2);

            // Simple advisory messages
            if (advisory.RiskScore > 0.7)
            {
                advisory.Messages.Add("High risk: Inspect fields for pests/disease; schedule immediate scouting.");
                advisory.Messages.Add("Consider foliar spray and split fertilizer application.");
            }
            else if (advisory.RiskScore > 0.4)
            {
                advisory.Messages.Add("Moderate risk: Monitor crop closely and check soil moisture.");
            }
            else
            {
                advisory.Messages.Add("Low risk: Continue normal operations.");
            }

            // Irrigation suggestion
            if (req.SoilMoisture < 40)
                advisory.Messages.Add("Irrigation recommended — soil moisture below threshold.");

            return advisory;
        }
    }
}
