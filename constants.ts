import { Status } from './types';

export const STATUS_OPTIONS = [
  { value: Status.ToDo, label: 'To Do' },
  { value: Status.InProgress, label: 'In Progress' },
  { value: Status.Done, label: 'Done' },
];

export const STATUS_COLORS: { [key in Status]: string } = {
  [Status.ToDo]: 'bg-slate-600 text-slate-100',
  [Status.InProgress]: 'bg-blue-800 text-blue-100',
  [Status.Done]: 'bg-green-800 text-green-100',
};