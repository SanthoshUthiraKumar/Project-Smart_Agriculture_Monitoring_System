using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using dotnet_service.Models;
using System.Collections.Generic;

namespace dotnet_service.Services
{
    public class PdfService
    {
        public byte[] GenerateYieldReport(List<YieldReportData> data)
        {
            QuestPDF.Settings.License = LicenseType.Community;

            return Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(1, Unit.Centimetre);

                    page.Header()
                        .Text("Smart Agriculture Yield Report")
                        .SemiBold().FontSize(20).FontColor(Colors.Blue.Medium);

                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                        .Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn(2); // ID
                                columns.RelativeColumn(1); // Yield
                                columns.RelativeColumn(1); // Moisture
                                columns.RelativeColumn(1); // Temp
                                columns.RelativeColumn(2); // Timestamp
                            });

                            // Header
                            table.Header(header =>
                            {
                                header.Cell().Text("Data ID");
                                header.Cell().Text("Yield (t/ha)");
                                header.Cell().Text("Moisture (%)");
                                header.Cell().Text("Temp (°C)");
                                header.Cell().Text("Timestamp");
                            });

                            // Rows
                            foreach (var item in data)
                            {
                                string id = item.UniqueDataId ?? "N/A";
                                string yield = item.PredictedYield.ToString("F2");
                                string moisture = item.SoilMoisture.ToString("F1");
                                string temp = item.Temperature.ToString("F1");
                                string timestamp = string.IsNullOrWhiteSpace(item.Timestamp)
                                                    ? "N/A"
                                                    : item.Timestamp;

                                table.Cell().Text(id);
                                table.Cell().Text(yield);
                                table.Cell().Text(moisture);
                                table.Cell().Text(temp);
                                table.Cell().Text(timestamp);
                            }
                        });

                    page.Footer()
                        .AlignCenter()
                        .Text(x => x.CurrentPageNumber());
                });
            }).GeneratePdf();
        }
    }
}
