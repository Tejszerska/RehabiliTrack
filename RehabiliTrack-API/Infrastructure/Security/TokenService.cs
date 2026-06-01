using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using RehabiliTrack_API.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks; // <-- Wymagane dla Task<string>

namespace RehabiliTrack_API.Infrastructure.Security
{
    public interface ITokenService
    {
        // 1. Zmieniono typ zwracany na Task<string> i usunięto zbędny parametr 'roles'
        Task<string> GenerateTokenAsync(ApplicationUser user);
    }

    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;
        private readonly UserManager<ApplicationUser> _userManager;

        public TokenService(UserManager<ApplicationUser> userManager, IConfiguration config)
        {
            _userManager = userManager;
            _config = config;
        }

        public async Task<string> GenerateTokenAsync(ApplicationUser user)
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

            // get user roles from database
            var userRoles = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName)
            };

            // in case user have multiple roles
            foreach (var role in userRoles)
            {
                claims.Add(new Claim("role", role));
            }

            var tokenOptions = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(8), // 8h = one shift of an employee
                signingCredentials: signinCredentials
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

            return tokenString;
        }
    }
}