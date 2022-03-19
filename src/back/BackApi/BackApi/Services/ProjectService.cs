using BackApi.Entities;
using BackApi.Models;

namespace BackApi.Services
{
    public interface IProjectService
    {
        Boolean CreateProject(ProjectAPI model);
        Boolean DeleteProject(int projid,int userid);
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

        public void DeleteDataset(int datasetid)    //implementacija ce biti pomerena u dataset servis
        {
            try
            {
                var dataset = context.Datasets.Find(datasetid);
                context.Datasets.Remove(dataset);
                context.SaveChanges();
            }
            catch (Exception ex) { }

        }

        public void DeleteNN(int nnid)      //implementacija ce biti pomerena u NN servis
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
    }
}
