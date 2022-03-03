using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace PrvaAplikacija.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        public static List<TasksList> lists = new List<TasksList>();
        public static int taskIdGen = 0;

        [HttpGet("reset")]
        public TasksList ResetTasksLists()
        {
            lists = new List<TasksList>();
            for (int j = 0; j < 3; j++)
            {
                TasksList list = new TasksList();
                List<Task> tasks = new List<Task>();
                for (int i = 0; i < 8; i++)
                {
                    tasks.Add(new Task());
                    tasks[tasks.Count - 1].Id = taskIdGen++;
                    tasks[tasks.Count - 1].Content = "Ovo je task " + tasks.Count;
                }
                list.Tasks = tasks;
                list.Id = j;
                list.Name = "Lista " + list.Id;

                lists.Add(list);

            }
            return lists[1];
        }

        [HttpGet("get/{id}")]
        public TasksList GetTasksList([FromRoute] int id)
        {
            foreach (var list in lists)
            {
                if (list.Id == id)
                {
                    return list;
                }
            }
            return null;
        }

        [HttpGet("get")]
        public List<TasksList> GetAllTasksLists()
        {
            return lists;
        }

        [HttpPost("post")]
        public void AddTaskToList(string task, int listId)
        {
            Console.WriteLine(task + " " + listId);

            foreach (var list in lists)
            {
                if (list.Id == listId)
                {
                    list.Tasks.Add(new Task());
                    list.Tasks[list.Tasks.Count - 1].Id = taskIdGen++;
                    list.Tasks[list.Tasks.Count - 1].Content = task;
                    break;
                }
            }
        }
    }
}