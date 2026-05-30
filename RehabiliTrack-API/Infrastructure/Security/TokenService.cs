using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.IdentityModel.Tokens;
using RehabiliTrack_API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RehabiliTrack_API.Infrastructure.Security
{
    public interface ITokenService
    {
        string GenerateToken(ApplicationUser user, IList<string> roles);
    }

    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;

        public TokenService(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateToken(ApplicationUser user, IList<string> roles)
        {
            var jwtSettings = _config.GetSection("JwtSettings");
            var secretKeyString = jwtSettings["SecurityKey"];

            // Fail-Fast
            if (string.IsNullOrEmpty(secretKeyString))
            {
                throw new InvalidOperationException("FATAL ERROR: JWT Security Key is not configured.");
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKeyString));
            var signinCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>();
          
            var tokenOptions = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2), // 2h for development, TODO: shorter lifespan for production
                signingCredentials: signinCredentials
            );
                        
            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

            return tokenString;
        }
    }
}