using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Api.HealthChecks;

public class LivenessProbe : IHealthCheck {
  private readonly IHostEnvironment env;

  public LivenessProbe(IHostEnvironment env) {
    this.env = env;
  }

  public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken ct = default)
    => Task.FromResult(HealthCheckResult.Healthy($"Live: ASPNETCORE_ENVIRONTMENT = `{env.EnvironmentName}`"));
}