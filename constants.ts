import { Status, Priority } from './types';

export const STATUS_OPTIONS = [
  { value: Status.ToDo, label: 'To Do' },
  { value: Status.InProgress, label: 'In Progress' },
  { value: Status.Blocked, label: 'Blocked' },
  { value: Status.Done, label: 'Done' },
];

export const STATUS_COLORS: { [key in Status]: string } = {
  [Status.ToDo]: 'bg-slate-600 text-slate-100',
  [Status.InProgress]: 'bg-blue-800 text-blue-100',
  [Status.Blocked]: 'bg-orange-800 text-orange-100',
  [Status.Done]: 'bg-green-800 text-green-100',
};

export const PRIORITY_OPTIONS = [
    { value: Priority.Low, label: 'Low' },
    { value: Priority.Medium, label: 'Medium' },
    { value: Priority.High, label: 'High' },
];

export const PRIORITY_COLORS: { [key in Priority]: string } = {
    [Priority.Low]: 'bg-sky-800 text-sky-100',
    [Priority.Medium]: 'bg-yellow-800 text-yellow-100',
    [Priority.High]: 'bg-red-800 text-red-100',
};

export const PRIORITY_ORDER: { [key in Priority]: number } = {
    [Priority.High]: 2,
    [Priority.Medium]: 1,
    [Priority.Low]: 0,
};