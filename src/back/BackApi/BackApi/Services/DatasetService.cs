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
        public Task<Boolean> New(IFormFile model,int projid,int userid);
        public dynamic IsExist(int projectID, out Boolean uspeh, int userid, out Boolean owner);
        public Boolean Delete(int projid);
        public string ListDatasets(int projid);
        public string Read(int projid, Boolean main,int userid,out Boolean owner);
        public string ProjIdToPath(int projid,Boolean main);
        public Boolean EditHelperset(int projid, int userid, DatasetGetPost model);
        public Boolean UpdateMainDataset(int projid, int userid, out Boolean owner);
        public Task<DatasetPages> CreatePage(int projid, Boolean main, int p, int r);
        public void SaveChanges(int projid);
        public void DiscardChanges(int projid);
        public Boolean RevertToInit(int projid);
        public string RevertToLine(int projid, int linenum);
        public string ListChanges(int projid, Boolean main);
        public string ReadMetadata(int projid, Boolean main);
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

        public async Task<Boolean> New(IFormFile model,int projid,int userid)
        {
            var existing = kontext.Datasets.FirstOrDefault(x=> x.ProjectId==projid);
            if(existing != null)
                Delete(projid);

            var Dataset = new Dataset();
            Dataset.Name = "Main"; //moze se promeniti ukoliko bude implementovano vise dataseta po projektu
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
            
            var Temp = new Dataset();
            Temp.Name = "Editing";
            Temp.ProjectId = projid;
            Temp.Ext = ".csv";
            Temp.Path="None";
            Temp.Main = false;

            kontext.Add(Temp);
            kontext.SaveChanges();

            var pathalt=storageService.CreateDataset(projid, Temp.DatasetId);
            Temp.Path = pathalt;

            kontext.Entry(Temp).State=Microsoft.EntityFrameworkCore.EntityState.Modified;
            kontext.SaveChanges();

            //string xd= "n1;n2;n3;out\r1; 1; 0; 1\r1; 0; 0; 1\r0; 0; 1; 1\r1; 0; 1; 1\r0; 0; 0; 0\r";
            //File.WriteAllTextAsync(path, model.dataset);
            //File.WriteAllTextAsync(pathalt,model.dataset);
            var chmain = storageService.ChangesFilePath(projid, true);
            var chedit= storageService.ChangesFilePath(projid, false);
            var initpath=storageService.InitialFilePath(projid);

            var metamain = storageService.MetaFilePath(projid, true);
            var metaedit = storageService.MetaFilePath(projid, false);
            using (FileStream stream = System.IO.File.Create(initpath))
            {
                model.CopyTo(stream);
                stream.Flush();
            }
            using (FileStream stream = System.IO.File.Create(Dataset.Path))
            {
                model.CopyTo(stream);
                stream.Flush();
            }
            using (FileStream stream2 = System.IO.File.Create(Temp.Path))
            {
                model.CopyTo(stream2);
                stream2.Flush();
            }
            using (FileStream stream = System.IO.File.Create(chmain))
            {
                stream.Flush();
            }
            using (FileStream stream = System.IO.File.Create(chedit))
            {
                stream.Flush();
            }
            using (FileStream stream = System.IO.File.Create(metamain))
            {
                stream.Flush();
            }
            using (FileStream stream = System.IO.File.Create(metaedit))
            {
                stream.Flush();
            }
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

        public Boolean Delete(int projid)
        {
            List<Dataset> lista= kontext.Datasets.Where(x=> x.ProjectId == projid).ToList();
            var ifempty = lista.FirstOrDefault();
            if (ifempty == null)
                return false;
            var initpath = storageService.InitialFilePath(projid);
            storageService.DeletePath(initpath);
            var chmain = storageService.ChangesFilePath(projid, true);
            var chedit = storageService.ChangesFilePath(projid, false);
            storageService.DeletePath(chmain);
            storageService.DeletePath(chedit);
            var metamain = storageService.MetaFilePath(projid, true);
            var metaedit = storageService.MetaFilePath(projid, false);
            storageService.DeletePath(metamain);
            storageService.DeletePath(metaedit);
            foreach (Dataset d in lista)
            {
                storageService.DeletePath(d.Path);
                
                kontext.Datasets.Remove(d);
                kontext.SaveChanges();
            }
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

        public string Read(int projid, Boolean main,int userid,out Boolean owner)
        {
            var rez = "";
            var chkowner=kontext.Projects.FirstOrDefault(x=> x.ProjectId == projid && x.UserId==userid);
            if (chkowner == null)
            {
                owner = false;
                return null;
            }
            owner = true;   
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
        
        public string ProjIdToPath(int projid,Boolean main)
        {
            Dataset dset = kontext.Datasets.FirstOrDefault(x => x.ProjectId == projid && x.Main==main);
            if (dset == null) return null;
            return dset.Path;
        }

        public Boolean EditHelperset(int projid,int userid,DatasetGetPost model) // sluzi za rucno menjanje helper csv-a
        {
            var chkowner = kontext.Projects.FirstOrDefault(x => x.ProjectId == projid && x.UserId == userid);
            if (chkowner == null)
                return false;
            Dataset edit=kontext.Datasets.FirstOrDefault(x=> x.ProjectId == projid && x.Main==false);
            if (edit == null) return false;

            var path = storageService.GetDataset(edit.Path);
            File.WriteAllText(path, model.dataset);
            return true;
        }

        public Boolean UpdateMainDataset(int projid,int userid,out Boolean owner)
        {
            var temp = Read(projid, false, userid, out owner);
            if(!owner) return false;
            if(temp == null) return false;
            Dataset dest = kontext.Datasets.FirstOrDefault(x => x.ProjectId == projid && x.Main == true);
            if (dest == null) return false;

            var path=storageService.GetDataset(dest.Path);
            File.WriteAllText(path, temp);
            return true;    
        }

        public async Task<DatasetPages> CreatePage(int projid,Boolean main,int p, int r)
        {
            //var xdd = projid + ";" + main;
            var tmp = kontext.Datasets.FirstOrDefault(x => x.Main == main && x.ProjectId == projid);
            if(tmp == null) return null;

            string[] lines =await File.ReadAllLinesAsync(tmp.Path);
            var np = (decimal)(lines.Length - 1) / r;
            var pages = (int)Math.Ceiling(np);
            var content = new StringBuilder();
            if (lines.Length - 1>0)
            {
                content.Append(lines[0]);
                content.Append("\r\n");
            }
            for(int i=(p-1)*r+1;i<(p*r) + 1;i++)
            {
                //content.Append(i);
                if (i <= lines.Length - 1)
                {
                    content.Append(lines[i]);
                    content.Append("\r\n");
                }
            }
            content.Remove(content.Length - 2, 2);
            var str = content.ToString();

            var rez = storageService.DsetPage(projid, main);
            await File.WriteAllTextAsync(rez,str);

            var ret = new DatasetPages();
            ret.dataset = rez;
            ret.pages=pages;

            return ret;
        }

        public void SaveChanges(int projid)
        {
            var main =@""+ ProjIdToPath(projid, true);
            var edit =@""+ ProjIdToPath(projid, false);
            var metamain = @"" + storageService.MetaFilePath(projid, true);
            var metaedit = @"" + storageService.MetaFilePath(projid, false);
            File.Copy(metaedit,metamain,true);
            File.Copy(edit, main, true);
            var chedit = storageService.ChangesFilePath(projid, false);
            string[] lines = File.ReadAllLines(chedit);
            var chmain = storageService.ChangesFilePath(projid, true);
            foreach (var line in lines)
            {
                storageService.ChangesWriteLine(projid,true,line);
            }
            //clear unsaved editing history
            using (FileStream fs = File.Open(chedit, FileMode.OpenOrCreate, FileAccess.ReadWrite))
            {
                lock (fs)
                {
                    fs.SetLength(0);
                }
            }
        }
        public void DiscardChanges(int projid)
        {
            var main = @"" + ProjIdToPath(projid, true);
            var edit = @"" + ProjIdToPath(projid, false);
            var metamain = @"" + storageService.MetaFilePath(projid, true);
            var metaedit = @"" + storageService.MetaFilePath(projid, false);
            File.Copy(metamain, metaedit, true);
            File.Copy(main, edit, true);
            var chedit = storageService.ChangesFilePath(projid, false);
            //clear unsaved editing history
            using (FileStream fs = File.Open(chedit, FileMode.OpenOrCreate, FileAccess.ReadWrite))
            {
                lock (fs)
                {
                    fs.SetLength(0);
                }
            }
        }
        public Boolean RevertToInit(int projid)
        {
            var main = @"" + ProjIdToPath(projid, true);
            if(main == "") return false;
            var edit = @"" + ProjIdToPath(projid, false);
            if (edit == "") return false;
            var init = @"" + storageService.InitialFilePath(projid);
            File.Copy(init, edit, true);
            File.Copy(init, main, true);
            var chedit = storageService.ChangesFilePath(projid, false);
            var chmain = storageService.ChangesFilePath(projid, true);
            var metamain = @"" + storageService.MetaFilePath(projid, true);
            var metaedit = @"" + storageService.MetaFilePath(projid, false);
            using (FileStream fs = File.Open(chedit, FileMode.OpenOrCreate, FileAccess.ReadWrite))
            {
                lock (fs)
                {
                    fs.SetLength(0);
                }
            }
            using (FileStream fs = File.Open(chmain, FileMode.OpenOrCreate, FileAccess.ReadWrite))
            {
                lock (fs)
                {
                    fs.SetLength(0);
                }
            }
            using (FileStream fs = File.Open(metaedit, FileMode.OpenOrCreate, FileAccess.ReadWrite))
            {
                lock (fs)
                {
                    fs.SetLength(0);
                }
            }
            using (FileStream fs = File.Open(metamain, FileMode.OpenOrCreate, FileAccess.ReadWrite))
            {
                lock (fs)
                {
                    fs.SetLength(0);
                }
            }
            return true;
        }
        public string RevertToLine(int projid,int linenum)
        {
            var edit = @"" + ProjIdToPath(projid, false);
            if (edit == "") return null;
            var init = @"" + storageService.InitialFilePath(projid);
            File.Copy(init, edit, true);
            var chedit = storageService.ChangesFilePath(projid, false);
            var chmain = storageService.ChangesFilePath(projid, true);
            var metaedit = @"" + storageService.MetaFilePath(projid, false);
            using (FileStream fs = File.Open(chedit, FileMode.OpenOrCreate, FileAccess.ReadWrite))
            {
                lock (fs)
                {
                    fs.SetLength(0);
                }
            }
            using (FileStream fs = File.Open(metaedit, FileMode.OpenOrCreate, FileAccess.ReadWrite))
            {
                lock (fs)
                {
                    fs.SetLength(0);
                }
            }
            var actions = new StringBuilder();
            actions.Append("[");
            string[] lines = File.ReadAllLines(chmain);
            for(int i=0;i <linenum;i++)
            {
                if (i < lines.Length)
                {
                    actions.Append(lines[i]);
                    actions.Append(",");
                    storageService.ChangesWriteLine(projid, false, lines[i]);
                }
            }
            if(actions.Length > 2)
                actions.Remove(actions.Length - 1, 1);
            actions.Append("]");
            var str= actions.ToString();
            return str;
        }

        public string ListChanges(int projid,Boolean main)
        {
            var ch = storageService.ChangesFilePath(projid, main);
            if (ch == "") return null;
            var actions = new StringBuilder();
            actions.Append("[");
            string[] lines = File.ReadAllLines(ch);
            foreach (var line in lines)
            {
                actions.Append(line);
                actions.Append(",");
            }
            if (actions.Length > 2)
                actions.Remove(actions.Length - 1, 1);
            actions.Append("]");
            var str = actions.ToString();
            return str;
        }
        public string ReadMetadata(int projid, Boolean main)
        {
            var meta= storageService.MetaFilePath(projid,main);
            var ret = File.ReadAllText(meta);
            return ret;
        }
    }
}
