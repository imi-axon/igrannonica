using BackApi.Entities;
using BackApi.Models;
using CsvHelper;
using System.IO;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Diagnostics;

namespace BackApi.Services
{
    public interface IDatasetService
    {
        public Boolean New(DatasetGetPost model,int projid,int userid);
        public dynamic IsExist(int projectID, out Boolean uspeh, int userid, out Boolean owner);
        public Boolean Delete(int projid,int userid);
        public string ListDatasets(int projid);
        public string Read(int projid, Boolean main);
        public string ProjIdToPath(int projid);
    }

    public class DatasetService : IDatasetService
    {
        private DataBaseContext kontext;
        private readonly IConfiguration configuration;
        private static IStorageService storageService=new StorageService();

        public DatasetService(DataBaseContext datasetContext, IConfiguration configuration)
        {
            kontext = datasetContext;
            this.configuration = configuration;
        }

        public Boolean New(DatasetGetPost model,int projid,int userid)
        {
            var tmp= kontext.Projects.FirstOrDefault(x=> x.ProjectId==projid && x.UserId==userid); // provera vlasnistva projekta pre dodavanja dataset-a
            if (tmp == null)
                return false;

            var Dataset = new Dataset();
            Dataset.Name = "Default"; //moze se promeniti ukoliko bude implementovano vise dataseta po projektu
            //Dataset.OwnerId =(int)model.OwnerId;
            Dataset.ProjectId=projid;
            Dataset.Ext = ".csv";
            Dataset.Path = "None";
            Dataset.Main = true;

            kontext.Add(Dataset);
            kontext.SaveChanges();

            var path = storageService.CreateDataset(projid, Dataset.DatasetId);

            Dataset.Path = path;

            kontext.Entry(Dataset).State=Microsoft.EntityFrameworkCore.EntityState.Modified;
            kontext.SaveChanges();
            

            //string xd= "n1;n2;n3;out\r1; 1; 0; 1\r1; 0; 0; 1\r0; 0; 1; 1\r1; 0; 1; 1\r0; 0; 0; 0\r";
            File.WriteAllTextAsync(path, model.dataset);

            return true;
            //return datafile;
        }

        public dynamic IsExist(int projectID, out Boolean uspeh,int userid,out Boolean owner)
        {
            var rez = kontext.Projects.FirstOrDefault(x => x.ProjectId == projectID);
            owner = false;
            if (rez == null)
            {
                uspeh = false;
                return "Ne postoji dati projekat";
            }
            else
            {
                if (rez.UserId != userid)
                {
                    uspeh = false;
                    return "Vi niste vlasnik projekta";
                }
                else
                {
                    owner = true;
                    foreach (Dataset d in kontext.Datasets)
                    {
                        if (d.ProjectId == projectID)
                        {
                            using (var streamReader = new StreamReader(d.Path))
                            {
                                using (var csvReader = new CsvReader(streamReader, CultureInfo.InvariantCulture))
                                {
                                    var records = csvReader.GetRecords<dynamic>().ToList();
                                    uspeh = true;
                                    return records;
                                }
                            }
                        }
                    }
                    uspeh = false;
                    return "Dati projekat nema ni jedan DataSet!";
                }
            }
        }

        public Boolean Delete(int projid,int userid)
        {
            var tmp = kontext.Projects.FirstOrDefault(x => x.ProjectId == projid && x.UserId == userid); // provera vlasnistva projekta pre brisanja dataset-a
            if (tmp == null)
                return false;

            List<Dataset> lista= kontext.Datasets.Where(x=> x.ProjectId == projid).ToList();
            var dataset = lista[0];
            if (dataset == null)
                return false;

            storageService.DeleteDataset(dataset.Path);

            kontext.Datasets.Remove(dataset);
            kontext.SaveChanges();

            return true;
        }

        public string ListDatasets(int projid)
        {
            var rez = new StringBuilder();
            rez.Append("[");
            List<Dataset> lista = kontext.Datasets.Where(x => x.ProjectId == projid).ToList();
            foreach(Dataset d in lista)
            {
                rez.Append("{");
                rez.Append("\"" + "DatasetId" + "\":" + "\"" + d.DatasetId + "\",");
                //rez.Append("\"" + "Name" + "\":" + "\"" + d.Name + "\",");
                rez.Append("\"" + "Ext" + "\":" + "\"" + d.Ext + "\",");
                rez.Append("\"" + "Main" + "\":" + "\"" + d.Main + "\"");
                rez.Append("},");
            }
            if (rez.Length > 2) rez.Remove(rez.Length - 1, 1); //posto kasnije gleda da li je rez="[]" tj prazan array
            rez.Append("]");
            return rez.ToString();

        }

        public string Read(int projid, Boolean main)
        {
            var rez = "";
            List<Dataset> lista = kontext.Datasets.Where(x => x.ProjectId == projid && x.Main == main).ToList();
            if (lista.Count == 0) return null;

            var path = storageService.GetDataset(lista[0].Path);

            string[] lines=File.ReadAllLines(path);
            var content = new StringBuilder();
            foreach(string line in lines)
            {
                content.Append(line);
                content.Append("\r\n");
            }
            content.Remove(content.Length - 2, 2);
            var str = content.ToString();
            
            return str; //vraca csvstring, iz kontrolera zove ml deo
        }
        
        public string ProjIdToPath(int projid)
        {
            Dataset dset = kontext.Datasets.FirstOrDefault(x => x.ProjectId == projid);
            if (dset == null) return null;
            return dset.Path;
        }
    }
}
