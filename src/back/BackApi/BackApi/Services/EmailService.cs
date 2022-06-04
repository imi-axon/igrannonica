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
        bool SendEmail(string textmessage, string title, string receiver, int ind);
        bool SendEmailForPass(string textmessage, string title, string receiver);
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
                return null;
            }
        }

        public string VerifyEmailAdress(string username)
        {
            var user = context.Users.Where(x => x.Username.Equals(username)).FirstOrDefault();
            user.Verified = true;
            context.SaveChanges();
            return "Uspesno verifikovan";
        }

        public bool SendEmail(string textmessage, string title, string receiver, int ind)
        {
            MimeMessage message = new MimeMessage();
            message.From.Add(new MailboxAddress("Axon", configuration.GetSection("EmailConfiguration:Email").Value));
            message.To.Add(MailboxAddress.Parse(receiver));
            message.Subject = title;

            var storage = @"Storage";
            var photopath = Path.Combine("Storage", "profilna.png");
            var bodybuilder = new BodyBuilder();
            if (ind == 1)
                bodybuilder.HtmlBody = string.Format(@"<div style='background-color:#0080DD; text-align:center; margin: 20px;'><h1 style='color:white;'>Dobro došli</h1>" +
                "<img src=''>" +
                "<h3 style='color: white'>Potrebno je da klikom na dugme ispod potvrdite registracuju</h3>"+
                "<a href='"+ textmessage + "'><input type = 'button' value = 'Potvrdi' style='background-color: white; color: #003FB9; padding: 16px 50px; font-size:20px;'></a><br><br>" +
                "<p style='color:white;'> Ukoliko dugme ne radi, kopirjte sledeći link u vaš pretraživač</p>"+
                "<a style='color:white;' href='" + textmessage+ "'> "+ textmessage + "</a>"+
                "<br>"+
                "<h3 style='color:white;'> Ukoliko imate dodatnih pitanja, odgovorite na ovaj email, mi smo uvek tu za vas da vam pomognemo.</h3" +

                "<hp style='color:white;'> Pozdrav,<br> Tim AXON </p></div>"
                );
            else
                bodybuilder.HtmlBody = string.Format(@"<div style='background-color:#0080DD; text-align:center; margin: 20px;'><img src=''>" +
                "<h3 style='color: white'>Potrebno je da klikom na dugme ispod potvrdite promenu email-a</h3>" +
                "<a href='" + textmessage + "'><input type = 'button' value = 'Potvrdi' style='background-color: white; color: #003FB9; padding: 16px 50px; font-size:20px;'></a><br><br>" +
                "<p style='color:white;'> Ukoliko dugme ne radi, kopirjte sledeći link u vaš pretraživač</p>" +
                "<a style='color:white;' href='" + textmessage + "'> " + textmessage + "</a>" +
                "<br>" +
                "<h3 style='color:white;'> Ukoliko imate dodatnih pitanja, odgovorite na ovaj email, mi smo uvek tu za vas da vam pomognemo.</h3" +

                "<p style='color:white;'> Pozdrav,<br> Tim AXON </p></div>"
                );

            message.Body=bodybuilder.ToMessageBody();
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

        public bool SendEmailForPass(string textmessage, string title, string receiver)
        {
            MimeMessage message = new MimeMessage();
            message.From.Add(new MailboxAddress("Axon", configuration.GetSection("EmailConfiguration:Email").Value));
            message.To.Add(MailboxAddress.Parse(receiver));
            message.Subject = title;

            var bodybuilder = new BodyBuilder();
            bodybuilder.HtmlBody = string.Format(@"<div style='background-color:#0080DD; text-align:center; margin: 20px;'><img src=''>" +
                "<h3 style='color: white'>Potrebno je da klikom na dugme ispod potvrdite promenu šifre</h3>" +
                "<a href='" + textmessage + "'><input type = 'button' value = 'Potvrdi' style='background-color: white; color: #003FB9; padding: 16px 50px; font-size:20px;'></a><br><br>" +
                "<p style='color:white;'> Ukoliko dugme ne radi, kopirjte sledeći link u vaš pretraživač</p>" +
                "<a style='color:white;' href='" + textmessage + "'> " + textmessage + "</a>" +
                "<br>" +
                "<h3 style='color:white;'> Ukoliko imate dodatnih pitanja, odgovorite na ovaj email, mi smo uvek tu za vas da vam pomognemo.</h3" +

                "<p style='color:white;'> Pozdrav,<br> Tim AXON </p></div>"
                );

            message.Body = bodybuilder.ToMessageBody();
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
