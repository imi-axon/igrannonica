using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace PrvaAplikacija.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        public static List<TasksList> lists = new List<TasksList>();

        [HttpGet("reset")]
        public TasksList ResetTasksLists()
        {
            lists = new List<TasksList>();
            for (int j = 0; j < 10; j++)
            {
                TasksList list = new TasksList();
                List<Task> tasks = new List<Task>();
                for (int i = 0; i < 8; i++)
                {
                    tasks.Add(new Task());
                    tasks[tasks.Count - 1].Id = tasks.Count;
                    tasks[tasks.Count - 1].Content = "Ovo je task " + tasks.Count;
                }
                list.Tasks = tasks;
                list.Id = j+1;
                list.Name = "Lista " + list.Id;

                lists.Add(list);

            }
            return lists[1];
        }

        [HttpGet("get/{id}")]
        public TasksList GetTasksList([FromRoute] int id)
        {
            return lists[id];
        }

        [HttpGet("get")]
        public List<TasksList> GetAllTasksLists()
        {
            return lists;
        }
    }

}
