using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Application.Mapping;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure DB Context with SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=salesorder.db"));

// Configure AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

// Register Services`r`nbuilder.Services.AddScoped<Application.Interfaces.IReferenceDataService, Infrastructure.Services.ReferenceDataService>();`r`nbuilder.Services.AddScoped<Application.Interfaces.ISalesOrderService, Infrastructure.Services.SalesOrderService>();`r`n`r`n// Add CORS policy for React Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder =>
        {
            builder.WithOrigins("http://localhost:5173", "http://localhost:3000") // Default Vite/React ports
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

var app = builder.Build();

// Ensure Database is created and migrated
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated(); // Simplified strategy for test
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthorization();
app.MapControllers();

app.Run();
