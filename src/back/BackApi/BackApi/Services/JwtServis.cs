using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace BackApi.Services
{
    public interface IJwtServis
    {
        public int GetUserId();
    }
    public class JwtServis: IJwtServis
    {
        private readonly IHttpContextAccessor httpContext;
        public JwtServis(IHttpContextAccessor httpContextAccessor)
        {
            this.httpContext = httpContextAccessor;
        }
        public int GetUserId()
        {
            int rez= -1; // ako nije ulogovan vraca -1
            if (httpContext.HttpContext.User.FindFirstValue("id") != null)
            {
                rez = int.Parse(httpContext.HttpContext.User.FindFirstValue("id"));
            }
            return rez;
        }
    }
}
