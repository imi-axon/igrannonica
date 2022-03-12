using Newtonsoft.Json;
using RestSharp;
using System.Diagnostics;

namespace BackApi
{
    public static class KonekcijaSaML
    {
        public static async Task posaljihttp(string tekst)
        {
            Debug.WriteLine(tekst);
            HttpClient client = new HttpClient();
            StringContent content = new StringContent(tekst);

            await client.PostAsync("http://localhost:5000", content);
        }

        /*public static async Task<dynamic> getRequest(string tekst)
        {
            Debug.WriteLine(tekst);
            HttpClient client = new HttpClient();
            StringContent content = new StringContent(tekst);

            var result = await client.GetStringAsync("http://localhost:5000");
            dynamic json = JsonConvert.DeserializeObject(result);
            return json;
        }*/
    }
}
