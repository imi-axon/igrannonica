using BackApi.Entities;
using Microsoft.IdentityModel.Tokens;
using MailKit;
using MailKit.Net.Smtp;
using MimeKit;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace BackApi.Services
{
    public interface IEmailService
    {
        string ValidateToken(string token);
        string VerifyEmailAdress(string username);
        bool SendEmail(string textmessage, string title, string receiver);
    }
    public class EmailService:IEmailService
    {
        private DataBaseContext context;
        private IConfiguration configuration;

        public EmailService(DataBaseContext context, IConfiguration configuration)
        {
            this.context = context;
            this.configuration = configuration; 
        }
        public string ValidateToken(string token)
        {
            if(token == null)
                return null;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(configuration.GetSection("AppSettings2:Token").Value.ToString());

            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,

                    ClockSkew = TimeSpan.Zero
                },
                out SecurityToken validatedToken);
                var jwtToken = (JwtSecurityToken)validatedToken;
                var userName = (jwtToken.Claims.First(x => x.Type == "username").Value);
                return userName.ToString();
            }
            catch
            {
                return "";
            }
        }

        public string VerifyEmailAdress(string username)
        {
            var user = context.Users.Where(x => x.Username.Equals(username)).FirstOrDefault();
            user.Verified = true;
            context.SaveChanges();
            return "Uspesno verifikovan";
        }

        public bool SendEmail(string textmessage, string title, string receiver)
        {
            MimeMessage message = new MimeMessage();
            message.From.Add(new MailboxAddress("Axon", configuration.GetSection("EmailConfiguration:Email").Value));
            message.To.Add(MailboxAddress.Parse(receiver));
            message.Subject = title;

            message.Body = new TextPart("plain")
            {
                Text = textmessage
            };
            SmtpClient client = new SmtpClient();

            try
            {
                client.Connect(configuration.GetSection("EmailConfiguration:SmtpServer").Value, 465, true);
                client.Authenticate(configuration.GetSection("EmailConfiguration:Email").Value, configuration.GetSection("EmailConfiguration:Password").Value);
                client.Send(message);

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                client.Disconnect(true);
                client.Dispose();
            }

            return false;
        }
    }
}
