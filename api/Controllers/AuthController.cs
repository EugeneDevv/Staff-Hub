using Api.Models;
using Api.Models.Dtos;
using Api.Models.Dtos.AuthDtos;
using Api.Services.IServices;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase {
        private readonly IAuth _auth;
        public readonly ResponseDto _response;
        public AuthController(IAuth auth) {
            _auth = auth;
            _response = new ResponseDto();
        }

        /////This was just to test Authrization
        //[HttpGet]
        //[Authorize (Roles="super")]
        //public async Task<ActionResult<ResponseDto>> GetAlUsers() {
        //    var users = await _auth.AllUsers();
        //    _response.Result = users;
        //    return Ok(_response);
        //}

        [HttpPost("/login")]
        public async Task<ActionResult<ServiceResponse<UserDto>>> Post(LoginDto data) {
            var response = await _auth.GetUserData(data);

            return StatusCode(response.StatusCode, response);
        }

     
    }
    
}
