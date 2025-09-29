
export enum Status {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Done = 'Done',
}

export interface Project {
  name: string;
  description: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

export interface Task {
  id: string;
  name: string;
  description: string;
  assignee: string;
  status: Status;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}
