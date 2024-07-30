using Api.Models.Entities;

namespace Api.Services.IServices {
    public interface IJwt {
        public string CreateToken(User user);
    }
}
