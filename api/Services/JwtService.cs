using Api.Models.Entities;
using Api.Services.IServices;

using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Api.Services {
    public class JwtService:IJwt 
        
        {
        private readonly IConfiguration _configuration;
        public JwtService(IConfiguration configuration) {
            _configuration = configuration;
        }


        public string CreateToken(User user) {

            List<Claim> claims = new List<Claim>
        {
                                new Claim(ClaimTypes.Name, user.Email),
                                new Claim(ClaimTypes.Role, user.Role ),
                                new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString())
        }; 

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("JwtOptions:SecretKey").Value!
            ));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtOptions:Issuer"],
                audience: _configuration["JwtOptions:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: cred
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }
    }
}
