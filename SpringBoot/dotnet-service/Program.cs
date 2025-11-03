using dotnet_service.Services; // Import our PDF service

var builder = WebApplication.CreateBuilder(args);

// --- Add services to the container ---

// This tells .NET to use the Controller-based system
builder.Services.AddControllers();

// This registers your PdfService so it can be "injected"
// into the ReportController
builder.Services.AddScoped<PdfService>();


// (The rest of these are for API documentation)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// --- Configure the HTTP request pipeline ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection(); // We can comment this out for simple http local testing
app.UseAuthorization();

// This tells .NET to find and use your Controllers
app.MapControllers();

app.Run();