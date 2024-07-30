using Api.Models.Dtos;

namespace Api.Services.IServices {
    public interface IClient {
        Task<Dictionary<string, object>> getAllClients();
        Task<ServiceResponse<object>> AddClient(AddClientDto client);
        Task<ServiceResponse<object>> UpdateClient(AddClientDto client, int clientId);
        
        Task<bool> ClientExistWithId(int Id);
        public Task<ServiceResponse<object>> DeleteClient(int clientId);
        Task<Dictionary<string, object>> getAllActiveClients();

    }
}
