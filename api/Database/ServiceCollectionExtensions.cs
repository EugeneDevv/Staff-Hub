using Microsoft.EntityFrameworkCore;

namespace Api.Database;

public static class ServiceCollectionExtensions {
  public static IServiceCollection AddAppDb(this IServiceCollection services, string? connectionString) {
    if (String.IsNullOrEmpty(connectionString))
      throw new ArgumentNullException(nameof(connectionString));

    services.AddDbContext<AppDbContext>(options => {
      options.UseNpgsql(connectionString);
    });

    services.AddScoped<IAppDbContext>(p => p.GetRequiredService<AppDbContext>());

    return services;
  }
}