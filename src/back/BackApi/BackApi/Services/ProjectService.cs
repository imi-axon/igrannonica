using BackApi.Entities;
using BackApi.Models;
using System.Text;

namespace BackApi.Services
{
    public interface IProjectService
    {
        Boolean CreateProject(ProjectAPI model);
        Boolean DeleteProject(int projid,int userid);
        string ListProjects(int userid);
        string GetProjById(int projid, int userid);
        Boolean EditProject(int projid, ProjectAPI proj);
    }
    public class ProjectService:IProjectService
    {
        private BazaContext context;
        private readonly IConfiguration configuration;

        public ProjectService(BazaContext context, IConfiguration configuration)
        {
            this.context = context;
            this.configuration = configuration;
        }
        public Boolean CreateProject(ProjectAPI model)
        {
            if(context.Projects.Any(x=> x.Name == model.Name))
            {
                return false;
            }

            Project project = new Project();
            project.Name = model.Name;
            project.Description = model.Description;
            project.User_id = model.User_id;
            project.Creation_Date = DateTime.Now;

            context.Projects.Add(project);
            context.SaveChanges();

            var tmp = project;
            var basepath = @"Storage\";
            var projfolder = "proj" + tmp.Id;
            var projpath =Path.Combine(basepath, projfolder);
            Directory.CreateDirectory(projpath);
            var datapath =Path.Combine(projpath, "data");
            Directory.CreateDirectory(datapath);
            var mrezapath = Path.Combine(projpath,"mreze");
            Directory.CreateDirectory(mrezapath);

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
            var tmp = context.Projects.Where(x => x.User_id == userid && x.Id == projid).FirstOrDefault();
            if (userid == tmp.User_id) {
                List<Dataset> datasets = context.Datasets.Where(x => x.ProjectId == projid).ToList();
                foreach (Dataset dataset in datasets)
                {
                    DeleteDataset(dataset.DatasetId);
                }

                List<NN> NNs = context.NNs.Where(x => x.ProjectId == projid).ToList();
                foreach (NN n in NNs)
                {
                    //List<NNConfig> nnconfigs=context.NNConfigs.Where(x => x.ProjectId == projid).ToList()  //brisanje hiperparametara
                    DeleteNN(n.NNId);
                }

                var basepath = @"Storage\";
                var projfolder = "proj" + tmp.Id;
                var projpath = Path.Combine(basepath, projfolder);
                Directory.Delete(projpath,true);

                context.Projects.Remove(tmp);
                context.SaveChanges();

                return true;
            }
            return false;
        }

        public string ListProjects(int userid)
        {
            var rez = new StringBuilder();
            rez.Append("[");
            List<Project> lista= context.Projects.Where(x => x.User_id == userid).ToList();
            foreach(Project p in lista)
            {
                rez.Append("{");
                rez.Append("\"" +"ProjectId"+ "\":" + "\"" +p.Id+ "\",");
                rez.Append("\"" + "Name" + "\":" + "\"" + p.Name + "\",");
                rez.Append("\"" + "Public" + "\":" + "\"" + p.Public + "\",");
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
            var proj = context.Projects.Where(x => x.User_id == userid && x.Id == projid);
            foreach (Project p in proj) 
            {
                rez.Append("{");
                rez.Append("\"" + "ProjectId" + "\":" + "\"" + p.Id + "\",");
                rez.Append("\"" + "Name" + "\":" + "\"" + p.Name + "\",");
                rez.Append("\"" + "Public" + "\":" + "\"" + p.Public + "\",");
                rez.Append("\"" + "Description" + "\":" + "\"" + p.Description + "\"");
                rez.Append("}");
            }

            return rez.ToString();
        }

        public Boolean EditProject(int projid,ProjectAPI proj)
        {
            Boolean rez;
            if (projid != proj.Id)
                return rez = false;
            var edited = context.Projects.Find(projid);
            edited.Name = proj.Name;
            edited.Description = proj.Description;
            edited.Public = proj.Public;
            edited.User_id = proj.User_id;
            context.SaveChanges();
            rez = true;
            return rez;
        }
    }
}
