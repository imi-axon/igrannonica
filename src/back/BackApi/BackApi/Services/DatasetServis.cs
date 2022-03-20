using BackApi.Entities;
using BackApi.Models;
using System.Text;

namespace BackApi.Services
{
    public interface IDatasetServis
    {
        public string Novi(DatasetApi model,int projid);
        public Boolean Brisi(int datasetid);
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

        public string Novi(DatasetApi model,int projid)
        {

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

            return datafile;
        }

        public Boolean Brisi(int projid)
        {

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
