namespace api.Models.Entities {
  public class PaginationModel {
        public int CurrentPage { get; set; } = 1;
        public int TotalPages { get; set; } = 1;
        public int TotalRecords { get; set; } = 0;
        public int PreviousPage { get; set; } = 1;
        public int NextPage { get; set; } = 1;
        public int Size { get; set; } = 1;
  }
}