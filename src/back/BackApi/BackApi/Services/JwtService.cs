using System.Security.Claims;
using BackApi.Entities;
using Microsoft.AspNetCore.Http;

namespace BackApi.Services
{
    public interface IJwtService
    {
        public int GetUserId();
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
    }
}
