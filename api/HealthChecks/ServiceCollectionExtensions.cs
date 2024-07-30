using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Api.HealthChecks;

using static Api.Infrastructure.ConfigurationKeys;

public static class HealthChecks {
  public static IHealthChecksBuilder RegisterHealthChecks(this IHealthChecksBuilder builder, IConfiguration config) {
    builder.AddCheck<LivenessProbe>(
      name: "LivenessProbe",
      failureStatus: HealthStatus.Unhealthy,
      tags: new[] { HealthCheckTags.Live }
    );

    var connectionString = config.GetConnectionString("Default");

    if (connectionString is null)
      throw new ArgumentException(DEFAULT_CONNECTION_STRING);

    builder.AddNpgSql(
      connectionString: connectionString,
      name: "AppDbConnection",
      failureStatus: HealthStatus.Unhealthy,
      tags: new[] { HealthCheckTags.Ready });

    return builder;
  }
}
