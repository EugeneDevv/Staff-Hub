using api.Models.Entities;

namespace Api.Models {
      public class ServiceResponse<T> {
            public T? Data { get; set; }
            public string Message { get; set; } = string.Empty;
            public bool Success { get; set; } = true;
            
            public int StatusCode {get; set;} = 200;
            public PaginationModel? Pagination { get; set; }
        }
}
