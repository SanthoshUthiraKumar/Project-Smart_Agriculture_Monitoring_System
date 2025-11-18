using dotnet_service.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("AllowAll", builder =>
        builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

// Register PDF service
builder.Services.AddScoped<PdfService>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAll");

app.MapControllers();

app.Run();
