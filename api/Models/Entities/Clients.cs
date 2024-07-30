namespace Api.Models.Entities {
    public class Clients {
        public int ClientId { get; set; } = 0;
        public string ClientName { get; set; } = string.Empty;
        public bool IsDeleted { get; set; } = false;
    }
}
