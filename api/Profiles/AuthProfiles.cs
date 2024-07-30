using api.Models.Dtos.User;

using Api.Models.Dtos;
using Api.Models.Dtos.AuthDtos;
using Api.Models.Entities;

using AutoMapper;

namespace Api.Profiles {
    public class AuthProfiles:Profile
        {
        public AuthProfiles() {
            CreateMap<UserDto, User>().ReverseMap();
            CreateMap<RegisterDto, User>().ReverseMap();
            CreateMap<SecurityAnswerDTO,SecurityAnswer>().ReverseMap();
            CreateMap<GetUserDto, User>().ReverseMap();
        }
    }
}
