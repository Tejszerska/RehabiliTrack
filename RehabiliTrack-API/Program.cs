using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RehabiliTrack_API.Infrastructure.Data;
using RehabiliTrack_API.Infrastructure.Security;
using RehabiliTrack_API.Models;
using RehabiliTrack_API.Models.Data;
using System.Reflection;
using System.Text;

namespace RehabiliTrack_API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // register the database context with the dependency injection container
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


            // register Identity services with our custom user and role classes, and specify that we want to use Entity Framework to store identity data in our database
            builder.Services.AddIdentity<ApplicationUser, ApplicationRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders(); 

            // MediatR
            builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

            // Add services to the container.

            // ==================================
            // === JWT Authentication setup ===
            // ==================================

            

            // get JWT settings from configuration
            var jwtSettings = builder.Configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecurityKey"];

            if(string.IsNullOrEmpty(secretKey))
            {
                throw new Exception("FATAL ERROR: JWT Security Key is not configured.");
            }

            // register the token service for dependency injection
            builder.Services.AddScoped<ITokenService, TokenService>();

            // jwt authentication configuration
            builder.Services.AddAuthentication(opt => {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                            .AddJwtBearer(options =>
                            {
                                options.TokenValidationParameters = new TokenValidationParameters
                                {
                                    ValidateIssuer = true,
                                    ValidateAudience = true,
                                    ValidateLifetime = true,
                                    ValidateIssuerSigningKey = true,
                                    ValidIssuer = jwtSettings["Issuer"],
                                    ValidAudience = jwtSettings["Audience"],
                                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
                                };
                            });

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            // CORS - dla development zezwalaj na wszystkie połączenia
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    policy => policy
                        .AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
            });



            var app = builder.Build();

            // apply any pending migrations to the database on application startup
            using (var scope = app.Services.CreateScope())
            {
                try
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                    dbContext.Database.Migrate();
                    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
                    logger.LogInformation("Database migration completed successfully");
                }
                catch (Exception ex)
                {
                    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "Error during database migration");
                }
            }

            // --- START: SEED IDENTITY ---
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    await IdentitySeeder.SeedUsersAndRolesAsync(services);
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "Błąd podczas seedowania danych logowania.");
                }
            }
            // --- KONIEC ---

            // Configure the HTTP request pipeline.
            // used when in development
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwaggerUI(options =>
                options.SwaggerEndpoint("/openapi/v1.json", "RehabiliTrack API V1")
                );
            }

            //   app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers().RequireAuthorization();


            app.Run();
        }
    }
}
