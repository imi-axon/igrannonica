using BackApi.Entities;
using BackApi.Models;

namespace BackApi.Services
{
    public interface IProjectService
    {
        Boolean CreateProject(ProjectAPI model);
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

            return true;
        }
    }
}
