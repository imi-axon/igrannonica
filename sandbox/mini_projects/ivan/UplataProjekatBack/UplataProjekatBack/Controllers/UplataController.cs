using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using UplataProjekatBack.Models;

namespace UplataProjekatBack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UplataController : ControllerBase
    {
        static List<Uplata> uplate = new List<Uplata>() { 
            new Uplata(1, 1000, "rsd", "4/8/2015"),
            new Uplata(2, 666, "usd", "13/7/2019"),
            new Uplata(3, 25, "eur", "24/3/2021") 
        };

        static int newId = 4;

        // GET api/Uplata
        [HttpGet]
        public IEnumerable<Uplata> Get()
        {
            return uplate.ToArray();
        }

        // GET api/Uplata/1
        [HttpGet("{id}")]
        public Uplata Get(int id)
        {
            for (int i = 0; i < uplate.Count; i++)
                if (uplate[i].Id == id)
                    return uplate[i];
            return null;
        }

        // POST api/Uplata
        [HttpPost]
        public void Post([FromBody] Uplata uplata)
        {
            uplate.Add(new Uplata(newId++, uplata.Iznos, uplata.Valuta, uplata.Datum));
        }

        // PUT api/Uplata/1
        [HttpPut("{id}")]
        public void Post(int id, [FromBody] Uplata uplata)
        {
            for(int i = 0; i < uplate.Count; i++)
                if(uplate[i].Id == id){
                    uplate[i].Iznos = uplata.Iznos;
                    uplate[i].Valuta = uplata.Valuta;
                    uplate[i].Datum = uplata.Datum;
                }
        }

        // DELETE api/Uplata/1
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            for (int i = 0; i < uplate.Count; i++)
                if (uplate[i].Id == id)
                    uplate.RemoveAt(i);
        }

    }
}
