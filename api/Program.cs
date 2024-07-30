global using Api.Models.Entities;
global using Api.Models;
global using Microsoft.EntityFrameworkCore;
global using Api.Services.IServices;
global using Api.Services;
using Api.Database;
using Api.Extensions;
using Api.HealthChecks;
using Api.Infrastructure;


using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;

using YourNamespace;

using static Api.Infrastructure.ConfigurationKeys;
using Npgsql;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

string conn = builder.Configuration.GetValue<String>("DEFAULT_CONNECTION_STRING");

Log.Information($"Conn string: {conn}");

builder.Services
    .ConfigureLogging(builder.Configuration)
    .AddAppDb(builder.Configuration.GetValue<String>("DEFAULT_CONNECTION_STRING"))
    .AddHealthChecks()
    .RegisterHealthChecks(builder.Configuration);
builder.Services.AddAutoMapper(typeof(Program).Assembly);
builder.Services.AddScoped<IAuth, AuthService>();
builder.Services.AddScoped<IJwt, JwtService>();
builder.Services.AddScoped<IUser, UserService>();
builder.Services.Configure<EmailSettings>(options => {
    options.ApiKey = "";
    options.SenderEmail = "";
    options.SenderName = "SHub";
});

builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddSingleton<IEmailService, EmailService>();
builder.Services.AddScoped<IPassword, PasswordService>();
builder.Services.AddScoped<ISecurityQuestion, SecurityQuestionService>();
builder.Services.AddScoped<IEducation, EducationService>();
builder.Services.AddScoped<IExperience, ExperienceService>();
builder.Services.AddScoped<IprofileService, ProfileService>();
builder.Services.AddScoped<IProjects, ProjectsService>();
builder.Services.AddScoped<ISkill, SkillsService>();
builder.Services.AddScoped<IClient, ClientService>();
builder.Services.AddScoped<IProjects, ProjectsService>();
builder.Services.AddScoped<IRole, RolesService>();
builder.Services.AddScoped<ITeam, TeamService>();


builder.AddAuth();
builder.AddSwaggenGenExtension();


var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI(c => {
    if (!app.Environment.IsDevelopment()) {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "GER API");
        c.RoutePrefix = string.Empty;
    }
});

app.UseCors(builder => {

    builder.WithOrigins("http://d3vux39icd8ubd.cloudfront.net")
           // Allow requests from this origin
           .AllowAnyMethod() // Allow any HTTP method
           .AllowAnyHeader() // Allow any header
           .AllowCredentials(); // If your Angular app sends credentials (e.g., cookies)
});

app.MapHealthChecks("/health/ready",
    new HealthCheckOptions {
        Predicate = _ => true,
        ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
    });

app.UseAuthorization();

app.MapControllers();

app.Run();