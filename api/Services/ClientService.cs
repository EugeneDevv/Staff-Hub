using Api.Database;
using Api.Models;
using Api.Models.Dtos;
using Api.Models.Entities;
using Api.Services.IServices;

using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Api.Services 
    {
    public class ClientService : IClient
        {
        private readonly AppDbContext _context;

        public ClientService(AppDbContext context) {
            _context = context;
        }

        public async Task<ServiceResponse<object>> AddClient(AddClientDto client) {
            var serviceResponse = new ServiceResponse<object>();
            try {
                client.ClientName = client.ClientName.Trim();

                if (client.ClientName.IsNullOrEmpty()) {
                    serviceResponse.Message = "Client name is required";
                    serviceResponse.StatusCode = 400;
                    serviceResponse.Success = false;
                    return serviceResponse;
                }
                if (client.ClientName.Length < 2) {
                    serviceResponse.Message = "Client name must be at least 2 characters long";
                    serviceResponse.StatusCode = 400;
                    serviceResponse.Success = false;
                    return serviceResponse;
                }

                if (ConsecutiveSpecialCharacters(client.ClientName)) {
                    serviceResponse.Message = "Client name cannot contain consecutive special characters";
                    serviceResponse.StatusCode = 400;
                    serviceResponse.Success = false;
                    return serviceResponse;
                }


                string clientNameLower = client.ClientName.ToLower();
                var existingClient = await _context.Clients.FirstOrDefaultAsync(p => p.ClientName.ToLower() == clientNameLower);
                if (existingClient != null && existingClient.IsDeleted==false) {
                    serviceResponse.Message = "Client already exists";
                    serviceResponse.Success = false;
                    serviceResponse.StatusCode = 409;
                    return serviceResponse;
                }

                if (existingClient != null && existingClient.IsDeleted == true) {                   
                    serviceResponse.Success = true;
                    existingClient.IsDeleted = false;
                    await _context.SaveChangesAsync();
                    serviceResponse.Success = true;
                    serviceResponse.StatusCode = 200;
                    serviceResponse.Message = "Client added successfully";
                    return serviceResponse;

                }
                else {
                    Clients clientName = new Clients();
                    clientName.ClientName = client.ClientName;
                    await _context.Clients.AddAsync(clientName);
                    await _context.SaveChangesAsync();
                    serviceResponse.Success = true;
                    serviceResponse.StatusCode = 200;
                    serviceResponse.Message = "Client added successfully";
                    return serviceResponse;
                }

            }
            catch (Exception ex) {
                serviceResponse.Message = ex.Message;
                serviceResponse.StatusCode = 500;
                serviceResponse.Success = false;
                return serviceResponse;
            }
        }


        public async Task<bool> ClientExistWithId(int Id) {
            return await _context.Clients.AnyAsync(x => x.ClientId == Id);
        }

        public async Task<ServiceResponse<object>> DeleteClient(int clientId) {
            var serviceResponse = new ServiceResponse<object>();

            try {
                if (clientId <= 0) {
                    serviceResponse.Message = "Invalid ClientId";
                    serviceResponse.Success = false;
                    serviceResponse.StatusCode = 400;
                    return serviceResponse;
                }
                var existingClient = await _context.Clients.FirstOrDefaultAsync(s => s.ClientId == clientId);
                var projects = await _context.Projects.FirstOrDefaultAsync(b => b.ClientsId == clientId);

                if (projects != null) {
                    serviceResponse.Message = "Can not delete, client has projects attached!";
                    serviceResponse.StatusCode = 409;
                    return serviceResponse;
                }

                if (existingClient != null) {
                    existingClient.IsDeleted = true;
                    await _context.SaveChangesAsync();
                    serviceResponse.Success = true;
                    serviceResponse.StatusCode = 200;
                    serviceResponse.Message = "Client deleted successfully";
                    return serviceResponse;
                }
                serviceResponse.Message = "Client doesn't exist";
                serviceResponse.Success = false;
                serviceResponse.StatusCode = 404;
                return serviceResponse;

            }
            catch (Exception ex) {
                serviceResponse.Message = ex.Message;
                serviceResponse.StatusCode = 500;
                serviceResponse.Success = false;
                return serviceResponse;
            }
        }

        public async Task<Dictionary<string, object>> getAllActiveClients() {
            Dictionary<string, object> response = new Dictionary<string, object>();

            try {
                List<Clients> allClients = await _context.Clients.Where(a=>a.IsDeleted==false).ToListAsync();
                response.Add("message", "Data retrieved successfully");
                response.Add("status", true);
                response.Add("StatusCode", 200);
                response.Add("data", allClients);
                return response;
            }
            catch {
                response.Add("message", "Oops! Something went wrong while getting clients");
                response.Add("status", false);
                response.Add("StatusCode", 500);
                return response;
            }
        }

        public async Task<Dictionary<string, object>> getAllClients() {
            Dictionary<string, object> response = new Dictionary<string, object>();

            try {
                List<Clients> allClients = await _context.Clients.ToListAsync();
                response.Add("message", "Data retrieved successfully");
                response.Add("status", true);
                response.Add("StatusCode", 200);
                response.Add("data", allClients);
                return response;
            }
            catch {
                response.Add("message", "Oops! Something went wrong while getting clients");
                response.Add("status", false);
                response.Add("StatusCode", 500);
                return response;
            }
        }

        public async Task<ServiceResponse<object>> UpdateClient(AddClientDto client, int clientId) {
           
            var response = new ServiceResponse<object>();

            client.ClientName = client.ClientName.Trim();

            if (client.ClientName.IsNullOrEmpty()) {
                response.Message = "Client name is required";
                response.StatusCode = 400;
                response.Success = false;
                return response;
            }
            if (client.ClientName.Length < 2) {
                response.Message = "Client name must be at least 2 characters long";
                response.StatusCode = 400;
                response.Success = false;
                return response;
            }

            if (ConsecutiveSpecialCharacters(client.ClientName)) {
                response.Message = "Client name cannot contain consecutive special characters";
                response.StatusCode = 400;
                response.Success = false;
                return response;
            }


            var existingClient = await _context.Clients.FirstOrDefaultAsync(s => s.ClientId == clientId);

            var clients = await _context.Clients.FirstOrDefaultAsync(p => p.ClientName.ToLower().Trim() == client.ClientName.ToLower().Trim());

            var projects = await _context.Projects.FirstOrDefaultAsync(b => b.ClientsId == clientId);

            if(existingClient != null && existingClient.IsDeleted==true) {
                response.Message = "Client does not exist";
                response.StatusCode = 404;
                response.Success = false;
                return response;
            }

            if (existingClient != null && existingClient.ClientName == client.ClientName) {
                response.Message = "New and Current client name cannot be the same";
                response.StatusCode = 409;
                response.Success = false;
                return response;
            }

            if (projects != null) {
                response.Message = "Can not update, client has projects attached!";
                response.StatusCode = 409;
                response.Success = false;
                return response;
            }

            if (existingClient != null && clients != null && clients.ClientId != existingClient.ClientId) {
                response.Message = "Can not update to an existing client name";
                response.StatusCode = 409;
                response.Success = false;
                return response;
            }

            if (existingClient != null && clients != null && clients.ClientName.ToLower() == existingClient.ClientName.ToLower()) {
                response.Message = "Can not update to an existing client name";
                response.StatusCode = 409;
                response.Success = false;
                return response;
            }

            if (existingClient != null) {
                if (!existingClient.ClientName.IsNullOrEmpty()) {
                    existingClient.ClientName = client.ClientName;
                }
            }

            await _context.SaveChangesAsync();
            response.Message = "Client updated successfully!";
            response.StatusCode = 200;
            response.Success = true;
            return response;
        }

        private bool ConsecutiveSpecialCharacters(string input) {
            var specialCharacters = new HashSet<char>("~`!@#$%^&*()-_=+[]{}|;:'\",.<>?");
            for (int i = 0; i < input.Length - 1; i++) {
                if (specialCharacters.Contains(input[i]) && specialCharacters.Contains(input[i + 1])) {
                    return true;
                }
            }
            return false;
        }


    }
}
