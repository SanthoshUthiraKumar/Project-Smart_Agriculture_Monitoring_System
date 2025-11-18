using Microsoft.AspNetCore.Mvc;
using dotnet_service.Services;
using dotnet_service.Models;
using System;
using System.Collections.Generic;

namespace dotnet_service.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Consumes("application/json")]
    public class ReportController : ControllerBase
    {
        private readonly PdfService _pdfService;

        public ReportController(PdfService pdfService)
        {
            _pdfService = pdfService;
        }

        [HttpPost("yield-report")]
        public IActionResult GenerateReport([FromBody] List<YieldReportData> reportData)
        {
            try
            {
                if (reportData == null || reportData.Count == 0)
                    return BadRequest("No data received.");

                var pdfBytes = _pdfService.GenerateYieldReport(reportData);


                if (pdfBytes == null || pdfBytes.Length == 0)
                    return StatusCode(500, "PDF generation failed.");

                return File(pdfBytes, "application/pdf", "Dynamic_Yield_Report.pdf");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error generating report: {ex.Message}");
            }
        }
    }
}
