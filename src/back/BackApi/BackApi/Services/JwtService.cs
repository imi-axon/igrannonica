using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using BackApi.Entities;
using Microsoft.AspNetCore.Http;

namespace BackApi.Services
{
    public interface IJwtService
    {
        public int GetUserId();
        public int GetUserIdWs(string token);
    }
    public class JwtService: IJwtService
    {
        private readonly IHttpContextAccessor httpContext;
        private DataBaseContext kontext;
        private readonly IConfiguration configuration;
        public JwtService(IHttpContextAccessor httpContextAccessor, DataBaseContext datasetContext, IConfiguration configuration)
        {
            this.kontext = datasetContext;
            this.configuration = configuration;
            this.httpContext = httpContextAccessor;
        }
        public int GetUserId()
        {
            int rez= -1; // ako nije ulogovan vraca -1
            if (httpContext.HttpContext.User.FindFirstValue("id") != null)
            {
                rez = int.Parse(httpContext.HttpContext.User.FindFirstValue("id"));
                var dbid=kontext.Users.Find(rez);
                if (dbid == null)
                    rez = -1;
            }
            return rez;
        }
        public int GetUserIdWs(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwt = handler.ReadJwtToken(token);
            var strid = jwt.Claims.First(claim => claim.Type == "id").Value;
            int id = int.Parse(strid);
            var dbid = kontext.Users.Find(id);
            if (dbid == null)
                id = -1;

            return id;
        }
    }
}
