using BackApi.Models;
using BackApi.Config;
using Newtonsoft.Json;
using RestSharp;
using System.Diagnostics;
using System.Net.Http.Headers;

namespace BackApi
{
    public static class MLconnection
    {
        public static async Task<HttpResponseMessage> convertCSVstring(DatasetGetPost csvstring)
        {
            // Debug.WriteLine(csvstring);
            HttpClient client = new HttpClient();
            //   StringContent content = new StringContent(csvstring);
            var myContent = JsonConvert.SerializeObject(csvstring);
            var buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            var byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            Debug.WriteLine("Salje se zahtev ML-u (za Get Dataset)");
            var result = await client.PostAsync(Urls.ml + "/api/dataset/convert/json", byteContent);

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
            var result = await client.PostAsync(Urls.ml + "/api/dataset/validate/csv", byteContent);

            return result;
        }
        public static async Task<HttpResponseMessage> getStatistic(DatasetGetPost dataset)
        {
            // Debug.WriteLine(csvstring);
            HttpClient client = new HttpClient();
            // StringContent content = new StringContent(csvstring);

            var myContent = JsonConvert.SerializeObject(dataset);
            var buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            var byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            Debug.WriteLine("Salje se zahtev ML-u (za Statistiku)");
            var result = await client.PostAsync(Urls.ml + "/api/dataset/statistics", byteContent);

            return result;
        }

        public static async Task<HttpResponseMessage> editDataset(DatasetMLPost dataset)
        {
            // Debug.WriteLine(csvstring);
            HttpClient client = new HttpClient();
            // StringContent content = new StringContent(csvstring);

            var myContent = JsonConvert.SerializeObject(dataset);
            var buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            var byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            Debug.WriteLine("Salje se zahtev ML-u (za Edit Dataset)");
            var result = await client.PostAsync(Urls.ml + "/api/dataset/edit", byteContent);

            return result;
        }
        public static async Task<HttpResponseMessage> GetNNJson(ApiNNPost req)
        {
            HttpClient client = new HttpClient();

            var myContent = JsonConvert.SerializeObject(req);
            var buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            var byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            var result = await client.PostAsync(Urls.ml + "/api/nn/convert/json", byteContent);

            return result;
        }

        /*public static async Task<dynamic> getRequest(string tekst)
        {
            Debug.WriteLine(tekst);
            HttpClient client = new HttpClient();
            StringContent content = new StringContent(tekst);

            var result = await client.GetStringAsync(Urls.ml);
            dynamic json = JsonConvert.DeserializeObject(result);
            return json;
        }*/
    }
}
