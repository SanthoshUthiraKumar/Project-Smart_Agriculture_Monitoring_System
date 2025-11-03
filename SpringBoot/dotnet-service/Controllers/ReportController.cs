using Microsoft.AspNetCore.Mvc;
using DotNetReportService.Services; // Import our new service

namespace DotNetReportService.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // This makes the URL /api/report
    public class ReportController : ControllerBase
    {
        private readonly PdfService _pdfService;

        // This is "Dependency Injection"
        // ASP.NET will automatically create a PdfService and "inject" it here
        public ReportController(PdfService pdfService)
        {
            _pdfService = pdfService;
        }

        // This method will be accessible at: GET /api/report/yield-report
        [HttpGet("yield-report")]
        public IActionResult GetYieldReport()
        {
            try
            {
                // 1. Call our service to generate the PDF bytes
                byte[] pdfBytes = _pdfService.GenerateYieldReport();
                
                // 2. Define a file name for the download
                string fileName = $"Yield_Report_{DateTime.Now:yyyyMMdd_HHmmss}.pdf";

                // 3. Return the PDF file as the response
                // This tells the browser to treat the response as a file download
                return File(pdfBytes, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                // Handle any errors that might occur
                return StatusCode(500, $"An error occurred while generating the report: {ex.Message}");
            }
        }
    }
}