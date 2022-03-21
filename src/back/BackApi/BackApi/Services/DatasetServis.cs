using BackApi.Entities;
using BackApi.Models;
using CsvHelper;
using System.IO;
using System.Globalization;
using System.Linq;
using System.Text;

namespace BackApi.Services
{
    public interface IDatasetServis
    {
        public Boolean Novi(DatasetApi model,int projid,int userid);
        public dynamic daLiPostoji(int projectID, out Boolean uspeh, int userid);
        public Boolean Brisi(int projid,int userid);
        public string Listaj(int projid);
        public string Procitaj(int projid, Boolean main);
    }

    public class DatasetServis : IDatasetServis
    {
        private BazaContext kontext;
        private readonly IConfiguration configuration;

        public DatasetServis(BazaContext datasetContext, IConfiguration configuration)
        {
            kontext = datasetContext;
            this.configuration = configuration;
        }

        public Boolean Novi(DatasetApi model,int projid,int userid)
        {
            var tmp= kontext.Projects.FirstOrDefault(x=> x.Id==projid && x.User_id==userid); // provera vlasnistva projekta pre dodavanja dataset-a
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

            var basepath = @"Storage\";
            var projfolder = "proj" +projid;
            var projpath = Path.Combine(basepath, projfolder);
            var datapath = Path.Combine(projpath, "data");
            var filename = "data" + Dataset.DatasetId + ".csv";   //trenutno samo csv ubuduce ce se dodavati Ext property-podrzani fajltipovi
            var datafile = Path.Combine(datapath, filename);

            Dataset.Path = datafile;

            kontext.Entry(Dataset).State=Microsoft.EntityFrameworkCore.EntityState.Modified;
            kontext.SaveChanges();
            

            //string xd= "n1;n2;n3;out\r1; 1; 0; 1\r1; 0; 0; 1\r0; 0; 1; 1\r1; 0; 1; 1\r0; 0; 0; 0\r";
            File.WriteAllTextAsync(datafile, model.filecontent);

            return true;
            //return datafile;
        }

        public dynamic daLiPostoji(int projectID, out Boolean uspeh,int userid)
        {
            var rez = kontext.Projects.FirstOrDefault(x => x.Id == projectID && x.User_id==userid);
            if(rez == null)
            {
                uspeh = false;
                return "Ne postoji dati projekat ili vi niste njegov vlasnik";
            }    
            else
            {
                foreach(Dataset d in kontext.Datasets)
                {
                    if(d.ProjectId == projectID)
                    {
                        using(var streamReader = new StreamReader(d.Path))
                        {
                            using(var csvReader = new CsvReader(streamReader, CultureInfo.InvariantCulture))
                            {
                                var records = csvReader.GetRecords<dynamic>().ToList();
                                uspeh = true;
                                return records;
                            }
                        }
                    }
                }
                uspeh=false;
                return "Dati projekat nema ni jedan DataSet!";
            }
        }

        public Boolean Brisi(int projid,int userid)
        {
            var tmp = kontext.Projects.FirstOrDefault(x => x.Id == projid && x.User_id == userid); // provera vlasnistva projekta pre brisanja dataset-a
            if (tmp == null)
                return false;

            List<Dataset> lista= kontext.Datasets.Where(x=> x.ProjectId == projid).ToList();
            var dataset = lista[0];
            if (dataset == null)
                return false;
            var basepath = @"";
            basepath = Path.Combine(basepath, dataset.Path);
            File.Delete(basepath);

            kontext.Datasets.Remove(dataset);
            kontext.SaveChanges();

            return true;
        }

        public string Listaj(int projid)
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

        public string Procitaj(int projid,Boolean main)
        {
            var rez = "";
            List<Dataset> lista = kontext.Datasets.Where(x => x.ProjectId == projid && x.Main == main).ToList();
            if (lista.Count == 0) return null;
            var path = @"";
            path = Path.Combine(path, lista[0].Path);
            string[] lines=File.ReadAllLines(path);
            var content = new StringBuilder();
            foreach(string line in lines)
            {
                content.Append(line);
                content.Append("\r\n");
            }
            content.Remove(content.Length - 2, 2);
            var str = content.ToString();
            
            //rez=pozivML...
            //pozovi ml servis za parsiranje csv-a

            return str; //return rez kad implement poziv
        }
        
    }
}
