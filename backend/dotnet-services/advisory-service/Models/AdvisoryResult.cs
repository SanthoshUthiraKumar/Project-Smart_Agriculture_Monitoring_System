using System;
using System.Collections.Generic;

namespace SmartAgri.Advisory.Models
{
    public class AdvisoryResult
    {
        public string DatasetUrlUsed { get; set; }
        public double RiskScore { get; set; }
        public DateTime Timestamp { get; set; }
        public List<string> Messages { get; set; } = new List<string>();
    }
}
