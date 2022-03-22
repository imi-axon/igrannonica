using Newtonsoft.Json;
using RestSharp;
using System.Diagnostics;

namespace BackApi
{
    public static class KonekcijaSaML
    {
        public static async Task<HttpResponseMessage> convertCSVstring(string csvstring)
        {
            // Debug.WriteLine(csvstring);
            HttpClient client = new HttpClient();
            StringContent content = new StringContent(csvstring);

            Debug.WriteLine("Salje se zahtev ML-u (za Get Dataset)");
            var result = await client.PostAsync("http://localhost:5000/api/dataset/convert/json", content);

            return result;
        }

        public static async Task<HttpResponseMessage> validateCSVstring(string csvstring)
        {
            // Debug.WriteLine(csvstring);
            HttpClient client = new HttpClient();
            StringContent content = new StringContent(csvstring);

            Debug.WriteLine("Salje se zahtev ML-u (za Add Dataset)");
            var result = await client.PostAsync("http://localhost:5000/api/dataset/validate/csv", content);

            return result;
        }
        public static async Task<HttpResponseMessage> getStatistic(string csvstring)
        {
            // Debug.WriteLine(csvstring);
            HttpClient client = new HttpClient();
            StringContent content = new StringContent(csvstring);

            Debug.WriteLine("Salje se zahtev ML-u (za Add Dataset)");
            var result = await client.PostAsync("http://localhost:5000/api/dataset/statistic", content);

            return result;
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
