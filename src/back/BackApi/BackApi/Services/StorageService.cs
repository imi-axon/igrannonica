namespace BackApi.Services
{

    public interface IStorageService
    {
        public void DeleteProject(int projectId);
        public void CreateProject(int projectId);
        public string CreateDataset(int projid, int datasetid);
        public void DeletePath(string path);
        public string GetDataset(string tmp);
        public string CreateNNFile(int projid, int nnid);
        public string CreateNNCfg(int projid, int nnid);
        public string ReadCfg(string path);
        public void SaveFile(string path, IFormFile file);
        public string CreatePhoto(int userid);
        public string DsetPage(int projid, Boolean main);
        public string InitialFilePath(int projid);
        public string ChangesFilePath(int projid, Boolean main);
        public void SaveStream(string path, Stream file);
        public void ChangesWriteLine(int projid, Boolean main, string line);
        public void fwtest(string path, string tekst);
    }
    public class StorageService : IStorageService
    {
        public void DeleteProject(int projectId)
        {
            var basepath = @"Storage";
            var projfolder = "proj" + projectId;
            var projpath = Path.Combine(basepath, projfolder);
            Directory.Delete(projpath, true);
        }

        public void CreateProject(int projectId)
        {
            var basepath = @"Storage";
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
            var basepath = @"Storage";
            var projfolder = "proj" + projid;
            var projpath = Path.Combine(basepath, projfolder);
            var datapath = Path.Combine(projpath, "data");
            var filename = "data" + datasetid + ".csv";   //trenutno samo csv ubuduce ce se dodavati Ext property-podrzani fajltipovi
            var datafile = Path.Combine(datapath, filename);
            return datafile;
        }

        public string CreatePhoto(int userid)
        {
            var basepath = @"Storage";
            var imgfolder = "Images";
            var imgpath = Path.Combine(basepath, imgfolder);
            //var image = "img" + userid;
            //var datapath = Path.Combine(imgpath, image);
            return imgpath;
        }

        public void DeletePath(string path)
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

        public string CreateNNFile(int projid,int nnid)
        {
            var path = @"Storage";
            var tmp = "proj" + projid;
            path = Path.Combine(path, tmp);
            path = Path.Combine(path, "mreze");
            //tmp = "mreza" + nnid + ".txt";
            tmp = "mreza" + nnid + ".h5";
            path = Path.Combine(path,tmp);
            return path;
        }

        public string CreateNNCfg(int projid,int nnid)
        {
            var path = @"Storage";
            var tmp = "proj" + projid;
            path = Path.Combine(path, tmp);
            path = Path.Combine(path, "mreze");
            tmp = "cfg" + nnid + ".json";
            path = Path.Combine(path, tmp);
            return path;
        }

        public string ReadCfg(string path)
        {
            var rez=File.ReadAllText(path);
            return rez;
        }

        public void SaveFile(string path,IFormFile file)
        {
            using(Stream stream = File.Open(path, FileMode.Create))
            {
                file.CopyTo(stream);  
                stream.Flush();
            }
        }

        public string DsetPage(int projid,Boolean main)
        {
            var rng= new Random();
            int xd=rng.Next(1000000,2000000);
            var path= @"Storage";
            var tmp = "Tmp" + projid + "Main" + main+xd+".csv";
            path=Path.Combine(path,tmp);
            return path;
        }

        public string InitialFilePath(int projid)
        {
            var path = @"Storage";
            var tmp = "proj" + projid;
            path = Path.Combine(path, tmp);
            path = Path.Combine(path, "data");
            tmp = "Initial.csv";
            path = Path.Combine(path, tmp);
            return path;
        }

        public string ChangesFilePath(int projid,Boolean main)
        {
            var path = @"Storage";
            var tmp = "proj" + projid;
            path = Path.Combine(path, tmp);
            path = Path.Combine(path, "data");
            if (main) tmp = "chmain.txt";
            else tmp = "chedit.txt";
            path = Path.Combine(path, tmp);
            return path;
        }
        public void SaveStream(string path, Stream file)
        {
            using (Stream stream = File.Open(path, FileMode.Create))
            {
                file.CopyTo(stream);
                stream.Flush();
            }
        }
        public void ChangesWriteLine(int projid,Boolean main, string line) 
        {
            var path=ChangesFilePath(projid,main);
            using (StreamWriter sw = File.AppendText(path))
            {
                sw.WriteLine(line);
            }
        }
        public void fwtest(string path,string tekst)
        {
            File.WriteAllText(path, tekst);
        }
    }
}
