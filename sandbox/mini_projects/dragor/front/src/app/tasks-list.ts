export interface TasksList { 
    id: number, 
    name: string, 
    tasks: []
}

export let defval: TasksList = { id: 0, name: '', tasks: [] }