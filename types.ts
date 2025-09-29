export enum Status {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Blocked = 'Blocked',
  Done = 'Done',
}

export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
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
  priority?: Priority;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  dependencies?: string[]; // Array of task IDs this task depends on
}