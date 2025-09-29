import React from 'react';
import { Task, Status, Priority } from '../types';
import { STATUS_OPTIONS, STATUS_COLORS, PRIORITY_COLORS } from '../constants';
import { EditIcon, TrashIcon, PriorityIcon } from './icons/Icons';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onUpdateStatus: (taskId: string, status: Status) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete, onUpdateStatus }) => {
  const priority = task.priority || Priority.Medium;

  return (
    <div className="bg-slate-700/50 border border-slate-700 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex-1">
        <p className="font-semibold text-slate-200">{task.name}</p>
        <p className="text-sm text-slate-400">{task.description}</p>
        <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
          <span>Assignee: {task.assignee}</span>
          <span className="h-4 border-l border-slate-600"></span>
          <span>Due: {task.endDate}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
         <span className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2 py-1 ${PRIORITY_COLORS[priority]}`}>
          <PriorityIcon priority={priority} className="h-3 w-3" />
          {priority}
        </span>
        <select
          value={task.status}
          onChange={(e) => onUpdateStatus(task.id, e.target.value as Status)}
          className={`text-sm font-medium rounded-full px-3 py-1 border-0 focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 ${STATUS_COLORS[task.status]}`}
        >
          {STATUS_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <button onClick={() => onEdit(task)} className="text-slate-400 hover:text-primary-500">
          <EditIcon className="h-5 w-5" />
        </button>
        <button onClick={() => onDelete(task.id)} className="text-slate-400 hover:text-red-500">
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;