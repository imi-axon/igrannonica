using BackApi.Entities;
using BackApi.Models;

namespace BackApi.Services
{
    public interface IDatasetServis
    {
        public string Novi(DatasetApi model,int projid);
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
            Dataset.Name = model.Name;
            Dataset.OwnerId =(int)model.OwnerId;
            Dataset.ProjectId=projid;
            Dataset.Ext = ".csv";
            Dataset.Path = "None";

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
    }
}
