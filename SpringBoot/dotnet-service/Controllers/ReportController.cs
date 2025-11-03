using Microsoft.AspNetCore.Mvc;
using dotnet_service.Services; // Import our new service

namespace dotnet_service.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // This makes the URL /api/report
    public class ReportController : ControllerBase
    {
        private readonly PdfService _pdfService;

        public ReportController(PdfService pdfService)
        {
            _pdfService = pdfService;
        }

        [HttpGet("yield-report")]
        public IActionResult GetYieldReport()
        {
            try
            {
                byte[] pdfBytes = _pdfService.GenerateYieldReport();
                string fileName = $"Yield_Report_{DateTime.Now:yyyyMMdd_HHmmss}.pdf";
                return File(pdfBytes, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}