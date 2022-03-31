namespace BackApi.Services
{

    public interface IStorageService
    {
        public void DeleteProject(int projectId);
        public void CreateProject(int projectId);
        public string CreateDataset(int projid, int datasetid);
        public void DeleteDataset(string path);
        public string GetDataset(string tmp);
    }
    public class StorageService : IStorageService
    {
        public void DeleteProject(int projectId)
        {
            var basepath = @"Storage\";
            var projfolder = "proj" + projectId;
            var projpath = Path.Combine(basepath, projfolder);
            Directory.Delete(projpath, true);
        }

        public void CreateProject(int projectId)
        {
            var basepath = @"Storage\";
            var projfolder = "proj" + projectId;
            var projpath = Path.Combine(basepath, projfolder);
            Directory.CreateDirectory(projpath);
            var datapath = Path.Combine(projpath, "data");
            Directory.CreateDirectory(datapath);
            var mrezapath = Path.Combine(projpath, "mreze");
            Directory.CreateDirectory(mrezapath);
        }

        public string CreateDataset(int projid,int datasetid)
        {
            var basepath = @"Storage\";
            var projfolder = "proj" + projid;
            var projpath = Path.Combine(basepath, projfolder);
            var datapath = Path.Combine(projpath, "data");
            var filename = "data" + datasetid + ".csv";   //trenutno samo csv ubuduce ce se dodavati Ext property-podrzani fajltipovi
            var datafile = Path.Combine(datapath, filename);
            return datafile;
        }
        public void DeleteDataset(string path)
        {
            var basepath = @"";
            basepath = Path.Combine(basepath,path);
            File.Delete(basepath);
        }
        public string GetDataset(string tmp)
        {
            var path = @"";
            path = Path.Combine(path, tmp);
            return path;
        }


    }
}
