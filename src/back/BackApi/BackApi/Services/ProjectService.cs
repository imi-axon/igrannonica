using BackApi.Entities;
using BackApi.Models;
using System.Diagnostics;
using System.Text;

namespace BackApi.Services
{
    public interface IProjectService
    {
        string CreateProject(int userid);
        Boolean DeleteProject(int projid,int userid);
        string ListProjects(int userid,int pubuserid);
        string ListPublicProjects();
        string GetProjById(int projid, int userid);
        string GetUserByProj(int projid, out bool ind);
        bool SetNote(int projid, int userid, string note);
        string EditProject(int projid, ProjectEdit proj,int userid, out bool ind);
        int getProjectId(string name);
        public Boolean projectOwnership(int userid, int projid);
        string GetNote(int projid, int userid, out bool ind);
    }
    public class ProjectService:IProjectService
    {
        private DataBaseContext context;
        private readonly IConfiguration configuration;
        private IDatasetService datasetService;
        private INNservice nnService;
        private IStorageService storageService =new StorageService();

        public ProjectService(DataBaseContext context, IConfiguration configuration, IDatasetService datasetService,INNservice nNservice)
        {
            this.datasetService = datasetService;
            this.context = context;
            this.configuration = configuration;
            this.nnService = nNservice;
        }
        public string CreateProject(int userid)
        {
            string constname = "Untitled-Experiment";
            string name = constname;
            int exp = 2;
            while (true)
            {
                if (context.Projects.Any(x => x.UserId == userid && x.Name == name))
                {
                    name = constname;
                    name = name + "-" + exp;
                    exp = exp+1;
                }
                else
                    break;
            }
            Project project = new Project();
            project.Name = name;
            project.Description = "Project description goes here...";
            project.UserId = userid;
            project.Public = false;
            project.CreationDate = DateTime.Now;

            context.Projects.Add(project);
            context.SaveChanges();

            storageService.CreateProject(project.ProjectId);

            return name;
        }

        public Boolean DeleteProject(int projid, int userid) //manual cascade delete
        {
            var tmp = context.Projects.Where(x => x.UserId == userid && x.ProjectId == projid).FirstOrDefault();
            if (userid == tmp.UserId) {
                List<Dataset> datasets = context.Datasets.Where(x => x.ProjectId == projid).ToList();
                foreach (Dataset dataset in datasets)
                {
                    datasetService.Delete(projid);
                }

                List<NN> NNs = context.NNs.Where(x => x.ProjectId == projid).ToList();
                foreach (NN n in NNs)
                {
                    //List<NNConfig> nnconfigs=context.NNConfigs.Where(x => x.ProjectId == projid).ToList()  //brisanje hiperparametara
                    nnService.DeleteNN(n.NNId);
                }

                storageService.DeleteProject(tmp.ProjectId);

                context.Projects.Remove(tmp);
                context.SaveChanges();

                return true;
            }
            return false;
        }

        public string ListProjects(int userid,int pubuserid) //userid je id trenutno ulogovanog korisnika; pubuserid je id od prosledjenog username-a
        {
            var rez = new StringBuilder();
            rez.Append("[");
            List<Project> listapub = context.Projects.Where(x => x.UserId == pubuserid && x.Public == true).ToList();
            foreach (Project p in listapub)
            {
                rez.Append("{");
                rez.Append("\"" + "ProjectId" + "\":" + "\"" + p.ProjectId + "\",");
                rez.Append("\"" + "Name" + "\":" + "\"" + p.Name + "\",");
                rez.Append("\"" + "Public" + "\":" + "\"" + p.Public + "\",");
                rez.Append("\"" + "Creationdate" + "\":" + "\"" + p.CreationDate + "\",");
                var pom = context.Datasets.FirstOrDefault(x => x.ProjectId == p.ProjectId);
                if(pom != null)
                    rez.Append("\"" + "hasDataset" + "\":" + "\"" + "true" + "\",");
                else
                    rez.Append("\"" + "hasDataset" + "\":" + "\"" + "false" + "\",");
                rez.Append("\"" + "Description" + "\":" + "\"" + p.Description + "\"");
                rez.Append("},");
            }
            List<Project> listapriv= context.Projects.Where(x => x.UserId == pubuserid && x.Public==false).ToList();
            foreach(Project p in listapriv)
            {
                rez.Append("{");
                rez.Append("\"" +"ProjectId"+ "\":" + "\"" +p.ProjectId+ "\",");
                rez.Append("\"" + "Name" + "\":" + "\"" + p.Name + "\",");
                rez.Append("\"" + "Public" + "\":" + "\"" + p.Public + "\",");
                rez.Append("\"" + "Creationdate" + "\":" + "\"" + p.CreationDate + "\",");
                var pom = context.Datasets.FirstOrDefault(x => x.ProjectId == p.ProjectId);
                if (pom != null)
                    rez.Append("\"" + "hasDataset" + "\":" + "\"" + "true" + "\",");
                else
                    rez.Append("\"" + "hasDataset" + "\":" + "\"" + "false" + "\",");
                rez.Append("\"" + "Description" + "\":" + "\"" + p.Description + "\"");
                rez.Append("},");
            }
            if(rez.Length>2) rez.Remove(rez.Length - 1, 1); //posto kasnije gleda da li je rez="[]" tj prazan array
            rez.Append("]");
            return rez.ToString();
        }

        public string ListPublicProjects()
        {
            var rez = new StringBuilder();
            rez.Append("[");
            List<Project> listapub = context.Projects.Where(x => x.Public == true).ToList();
            foreach (Project p in listapub)
            {
                rez.Append("[{");
                var user = context.Users.Find(p.UserId);
         
                rez.Append("\"" + "ProjectId" + "\":" + "\"" + p.ProjectId + "\",");
                rez.Append("\"" + "Name" + "\":" + "\"" + p.Name + "\",");
                rez.Append("\"" + "Public" + "\":" + "\"" + p.Public + "\",");
                rez.Append("\"" + "Creationdate" + "\":" + "\"" + p.CreationDate + "\",");
                var pom = context.Datasets.FirstOrDefault(x => x.ProjectId == p.ProjectId);
                if (pom != null)
                    rez.Append("\"" + "hasDataset" + "\":" + "\"" + "true" + "\",");
                else
                    rez.Append("\"" + "hasDataset" + "\":" + "\"" + "false" + "\",");
                rez.Append("\"" + "Description" + "\":" + "\"" + p.Description + "\"");
                rez.Append("},");

                if (user != null)
                {
                    string photopath = user.PhotoPath;
                    if (photopath == "" || photopath == null)
                        photopath = Path.Combine("Storage", "profilna.png");

                    //string b = System.IO.File.ReadAllText(photopath);

                    byte[] imageArray = System.IO.File.ReadAllBytes(photopath);
                    string slikaBase64 = Convert.ToBase64String(imageArray);

                    rez.Append("{");
                    rez.Append("\"" + "UseId" + "\":" + "\"" + user.UserId + "\",");
                    rez.Append("\"" + "Name" + "\":" + "\"" + user.Name + "\",");
                    rez.Append("\"" + "Lastname" + "\":" + "\"" + user.Lastname + "\",");
                    rez.Append("\"" + "Username" + "\":" + "\"" + user.Username + "\",");
                    rez.Append("\"" + "Username" + "\":" + "\"" + user.Email + "\",");
                    rez.Append("\"" + "Photo" + "\":" + "\"data:image/jpeg;base64," + slikaBase64 + "\"");
                    rez.Append("}],");
                }
            }
            if (rez.Length > 2) rez.Remove(rez.Length - 1, 1);
            rez.Append("]");
            return rez.ToString();
        }
        public string GetUserByProj(int projid, out bool ind)
        {
            var rez = new StringBuilder();
            var proj = context.Projects.FirstOrDefault(x => x.ProjectId == projid);
            if (proj == null)
            {
                ind = false;
                return "project";
            }

            var user = context.Users.FirstOrDefault(x => x.UserId == proj.UserId);
            if (user == null)
            {
                ind = false;
                return "user";
            }

            string photopath = user.PhotoPath;
            if (photopath == "" || photopath == null)
                photopath = Path.Combine("Storage", "profilna.png");

            //string b = System.IO.File.ReadAllText(photopath);

            byte[] imageArray = System.IO.File.ReadAllBytes(photopath);
            string slikaBase64 = Convert.ToBase64String(imageArray);

            rez.Append("{");
            rez.Append("\"" + "Name" + "\":" + "\"" + user.Name + "\",");
            rez.Append("\"" + "Lastname" + "\":" + "\"" + user.Lastname + "\",");
            rez.Append("\"" + "Username" + "\":" + "\"" + user.Username + "\",");

            // Ovde treba da se proveri i zameni tip slike (nzm kako se to radi)
            rez.Append("\"" + "Photo" + "\":" + "\"data:image/jpeg;base64," + slikaBase64 + "\"");
            rez.Append("}");

            ind = true;
            return rez.ToString();
        }
        public string GetProjById(int projid, int userid)
        {
            var rez = new StringBuilder();
            Boolean tmp;
            var proj = context.Projects.FirstOrDefault(x => x.UserId == userid && x.ProjectId == projid);
            if (proj == null)
                return null;
            var dset=context.Datasets.FirstOrDefault(x=> x.ProjectId == projid);
            if (dset != null)
                tmp = true;
            else tmp = false;

            rez.Append("{");
            rez.Append("\"" + "ProjectId" + "\":" + "\"" + proj.ProjectId + "\",");
            rez.Append("\"" + "Name" + "\":" + "\"" + proj.Name + "\",");
            rez.Append("\"" + "Public" + "\":" + "\"" + proj.Public + "\",");
            rez.Append("\"" + "Description" + "\":" + "\"" + proj.Description + "\",");
            rez.Append("\"" + "hasDataset" + "\":" + "\"" + tmp + "\"");
            rez.Append("}");

            return rez.ToString();
        }
        public bool SetNote(int projid, int userid, string note)
        {
            var proj = context.Projects.FirstOrDefault(x => x.UserId == userid && x.ProjectId == projid);
            if (proj == null)
                return false;
            proj.Notes = note;
            context.SaveChanges();
            return true;

        }
        public string GetNote(int projid, int userid, out bool ind)
        {
            var proj = context.Projects.FirstOrDefault(x => x.UserId == userid && x.ProjectId == projid);
            if (proj == null)
            {
                ind = false;
                return "";
            }
            ind = true;
            return proj.Notes;
        }
        public string EditProject(int projid,ProjectEdit proj,int userid, out bool ind)
        {
            Boolean rez;
            var edited = context.Projects.Find(projid);
            if (edited == null)
            {
                ind = false;
                return "project";
            }
            if (edited.UserId != userid)
            {
                ind = false;
                return "user";
            }

            var project = context.Projects.FirstOrDefault(x => x.UserId == userid && x.Name==proj.name);
            if (project != null)
            {
                ind = false;
                return "name";
            }
            edited.Name = proj.name;
            edited.Description = proj.description;
            edited.Public = proj.ispublic;
            context.SaveChanges();
            ind = true;
            return "uspesno";
        }

        public int getProjectId(string name)
        {
            var tmp = context.Projects.Where(x => x.Name == name).FirstOrDefault();
            if (tmp == null)
                return -1;
            return tmp.ProjectId;
        }

        public Boolean projectOwnership(int userid,int projid)
        {
            var tmp=context.Projects.FirstOrDefault(x=> x.UserId==userid && x.ProjectId ==projid);
            if (tmp == null) return false;
            return true;
        }
    }
}
