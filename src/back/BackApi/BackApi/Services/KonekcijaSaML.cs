using BackApi.Models;
using Newtonsoft.Json;
using RestSharp;
using System.Diagnostics;
using System.Net.Http.Headers;

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
            var result = await client.PostAsync("http://localhost:8000/api/dataset/convert/json", content);

            return result;
        }

        public static async Task<HttpResponseMessage> validateCSVstring(DatasetGetPost csvstring)
        {
            // Debug.WriteLine(csvstring);
            HttpClient client = new HttpClient();
            //   StringContent content = new StringContent(csvstring);
            var myContent = JsonConvert.SerializeObject(csvstring);
            var buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            var byteContent = new ByteArrayContent(buffer);

            byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            Debug.WriteLine("Salje se zahtev ML-u (za Add Dataset)");
            var result = await client.PostAsync("http://localhost:8000/api/dataset/validate/csv", byteContent);

            return result;
        }
        public static async Task<HttpResponseMessage> getStatistic(string csvstring)
        {
            // Debug.WriteLine(csvstring);
            HttpClient client = new HttpClient();
            StringContent content = new StringContent(csvstring);

            Debug.WriteLine("Salje se zahtev ML-u (za Add Dataset)");
            var result = await client.PostAsync("http://localhost:8000/api/dataset/statistics", content);

            return result;
        }
        /*public static async Task<dynamic> getRequest(string tekst)
        {
            Debug.WriteLine(tekst);
            HttpClient client = new HttpClient();
            StringContent content = new StringContent(tekst);

            var result = await client.GetStringAsync("http://localhost:8000");
            dynamic json = JsonConvert.DeserializeObject(result);
            return json;
        }*/
    }
}
