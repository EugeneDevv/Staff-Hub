using Microsoft.Extensions.Options;

using SendGrid;
using SendGrid.Helpers.Mail;

namespace YourNamespace {
    public class EmailService : IEmailService {
        private readonly EmailSettings _emailSettings;

        public EmailService(IOptions<EmailSettings> emailSettings) {
            _emailSettings = emailSettings.Value;
        }

        public async Task SendEmailAsync(string email, string subject, string htmlMessage) {
            var client = new SendGridClient(_emailSettings.ApiKey);
            Console.WriteLine(client);
            var from = new EmailAddress(_emailSettings.SenderEmail, _emailSettings.SenderName);
            Console.WriteLine(from);
            var to = new EmailAddress(email);
            var msg = MailHelper.CreateSingleEmail(from, to, subject, null, htmlMessage);

            var response = await client.SendEmailAsync(msg);
            if (response.StatusCode != System.Net.HttpStatusCode.OK && response.StatusCode != System.Net.HttpStatusCode.Accepted) {
                throw new SendEmailException("Failed to send email. StatusCode: " + response.StatusCode);
            }
        }
    }

    public interface IEmailService {
        Task SendEmailAsync(string email, string subject, string htmlMessage);
    }

    public class SendEmailException : Exception {
        public SendEmailException(string message) : base(message) { }
    }
}
