using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SmartAgri.Advisory.Services;

var builder = WebApplication.CreateBuilder(args);

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactAndSpring", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",
                "http://localhost:8080"
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddSwaggerGen();

// DI
builder.Services.AddSingleton<IAdvisoryEngine, AdvisoryEngine>();

var app = builder.Build();

app.UseCors("AllowReactAndSpring");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.Run();
