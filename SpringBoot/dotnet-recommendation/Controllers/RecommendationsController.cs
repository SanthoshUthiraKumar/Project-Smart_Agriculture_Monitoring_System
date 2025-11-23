using Microsoft.AspNetCore.Mvc;
using RecommendationsService.Models;

namespace RecommendationsService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecommendationsController : ControllerBase
    {
        [HttpPost("suggest")]
        public IActionResult GetRecommendation([FromBody] SoilData data)
        {
            string recommendedCrop = "Rice"; // Default fallback

            // --- Simple Agricultural Logic (Rule-Based) ---
            
            // 1. Check based on Rainfall (Water availability is critical)
            if (data.Rainfall > 200)
            {
                // High rainfall crops
                if (data.Nitrogen > 80) recommendedCrop = "Rice";
                else recommendedCrop = "Coconut";
            }
            else if (data.Rainfall > 100)
            {
                // Moderate rainfall
                if (data.Ph < 6.0) recommendedCrop = "Coffee";
                else if (data.Potassium > 40) recommendedCrop = "Banana";
                else recommendedCrop = "Maize";
            }
            else
            {
                // Low rainfall (Dry crops)
                if (data.Ph > 7.0 && data.Phosphorus > 50) recommendedCrop = "Chickpea";
                else if (data.Nitrogen < 40) recommendedCrop = "Kidney Beans";
                else recommendedCrop = "Cotton";
            }

            // 2. Refine based on specific Soil Chemistry (N-P-K)
            if (data.Nitrogen > 120 && data.Phosphorus > 50)
            {
                recommendedCrop = "Watermelon"; // Needs heavy nutrients
            }
            if (data.Ph < 5.0)
            {
                 recommendedCrop = "Tea"; // Acidic soil lover
            }

            // Return the result as a simple text string
            return Ok(recommendedCrop);
        }
    }
}