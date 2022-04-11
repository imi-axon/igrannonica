using BackApi.Entities;
using BackApi.Models;
using System.Text;

namespace BackApi.Services
{
    public interface IProjectService
    {
        Boolean CreateProject(ProjectPostPut model,int userid);
        Boolean DeleteProject(int projid,int userid);
        string ListProjects(int userid,int pubuserid);
        string GetProjById(int projid, int userid);
        Boolean EditProject(int projid, ProjectPostPut proj,int userid);
        int getProjectId(ProjectPostPut model);
        public Boolean projectOwnership(int userid, int projid);
    }
    public class ProjectService:IProjectService
    {
        private DataBaseContext context;
        private readonly IConfiguration configuration;
        private IDatasetService datasetService;
        private IStorageService storageService =new StorageService();

        public ProjectService(DataBaseContext context, IConfiguration configuration, IDatasetService datasetService)
        {
            this.datasetService = datasetService;
            this.context = context;
            this.configuration = configuration;
        }
        public Boolean CreateProject(ProjectPostPut model,int userid)
        {
            if(context.Projects.Any(x=> x.Name == model.name))
            {
                return false;
            }

            Project project = new Project();
            project.Name = model.name;
            project.Description = model.description;
            project.UserId = userid;
            project.Public = model.ispublic;
            project.CreationDate = DateTime.Now;

            context.Projects.Add(project);
            context.SaveChanges();

            storageService.CreateProject(project.ProjectId);

            return true;
        }

        private void DeleteDataset(int datasetid)    //implementacija ce biti pomerena u dataset servis 
        {
            try
            {
                var dataset = context.Datasets.Find(datasetid);
                context.Datasets.Remove(dataset);
                context.SaveChanges();
            }
            catch (Exception ex) { }

        }

        private void DeleteNN(int nnid)      //implementacija ce biti pomerena u NN servis
        {
            try
            {
                var nn = context.NNs.Find(nnid);
                context.NNs.Remove(nn);
                context.SaveChanges();
            }
            catch (Exception ex) { }
        }

        public Boolean DeleteProject(int projid, int userid) //manual cascade delete
        {
            var tmp = context.Projects.Where(x => x.UserId == userid && x.ProjectId == projid).FirstOrDefault();
            if (userid == tmp.UserId) {
                List<Dataset> datasets = context.Datasets.Where(x => x.ProjectId == projid).ToList();
                foreach (Dataset dataset in datasets)
                {
                    datasetService.Delete(projid,userid);
                }

                List<NN> NNs = context.NNs.Where(x => x.ProjectId == projid).ToList();
                foreach (NN n in NNs)
                {
                    //List<NNConfig> nnconfigs=context.NNConfigs.Where(x => x.ProjectId == projid).ToList()  //brisanje hiperparametara
                    DeleteNN(n.NNId);
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
            List<Project> listapriv= context.Projects.Where(x => x.UserId == userid && x.Public==false).ToList();
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

        public string GetProjById(int projid, int userid)
        {
            var rez = new StringBuilder();
            var proj = context.Projects.Where(x => x.UserId == userid && x.ProjectId == projid);
            foreach (Project p in proj) 
            {
                rez.Append("{");
                rez.Append("\"" + "ProjectId" + "\":" + "\"" + p.ProjectId + "\",");
                rez.Append("\"" + "Name" + "\":" + "\"" + p.Name + "\",");
                rez.Append("\"" + "Public" + "\":" + "\"" + p.Public + "\",");
                rez.Append("\"" + "Description" + "\":" + "\"" + p.Description + "\"");
                rez.Append("}");
            }

            return rez.ToString();
        }

        public Boolean EditProject(int projid,ProjectPostPut proj,int userid)
        {
            Boolean rez;
            var edited = context.Projects.Find(projid);
            if(edited == null)
                return rez = false;
            if (edited.UserId != userid)
                return rez = false;
            edited.Name = proj.name;
            edited.Description = proj.description;
            edited.Public = proj.ispublic;
            context.SaveChanges();
            rez = true;
            return rez;
        }

        public int getProjectId(ProjectPostPut model)
        {
            var tmp = context.Projects.Where(x => x.Name == model.name).FirstOrDefault();
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
