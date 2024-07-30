using Serilog;

namespace Api.Infrastructure;

public static class LoggerConfigurator
{
  public static IServiceCollection ConfigureLogging(this IServiceCollection services, IConfiguration config)
  {
    Log.Logger = new LoggerConfiguration()
      .ReadFrom.Configuration(config)
      .CreateLogger();

    AppDomain.CurrentDomain.ProcessExit += (s, e) => Log.CloseAndFlush();

    services.AddLogging(builder => builder.AddSerilog(Log.Logger, dispose: true));

    return services;
  }
}
