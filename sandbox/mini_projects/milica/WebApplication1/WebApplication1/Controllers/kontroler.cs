using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class kontroler : ControllerBase
    {

        List<User> users = new List<User>();
        List<string> names = new List<string>();

        [HttpPost]
        public List<string> Post([FromBody] User user)
        {
            names.Clear();
            users.Add(user);
            foreach (User u in users)
            {
                string n = u.name;
                names.Add(n);
            }
            return names;
        }

    }   

    public class User
    {
        public string name { get; set; }
        public string email { get; set; }
    }
}
