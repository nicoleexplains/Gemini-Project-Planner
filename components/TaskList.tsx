import React, { useState, useMemo } from 'react';
import { Project, Task, Status, Priority } from '../types';
import TaskItem from './TaskItem';
import { generateTaskSuggestions } from '../services/geminiService';
import { AddIcon, SparklesIcon } from './icons/Icons';
import { PRIORITY_ORDER } from '../constants';

interface TaskListProps {
  tasks: Task[];
  projectInfo: Project;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, status: Status) => void;
  onAddTask: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, projectInfo, setTasks, onEditTask, onDeleteTask, onUpdateTaskStatus, onAddTask }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'default' | 'priority'>('default');

  const handleGenerateSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const suggestions = await generateTaskSuggestions(projectInfo);
      const newTasks: Task[] = suggestions.map((suggestion, index) => ({
        id: `ai-${Date.now()}-${index}`,
        name: suggestion.name || 'Untitled Task',
        description: suggestion.description || '',
        assignee: suggestion.assignee || 'Unassigned',
        status: Status.ToDo,
        priority: Priority.Medium,
        startDate: suggestion.startDate || projectInfo.startDate,
        endDate: suggestion.endDate || projectInfo.endDate,
      }));
      setTasks(prev => [...prev, ...newTasks]);
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred.');
        }
    } finally {
      setIsLoading(false);
    }
  };
  
  const sortedTasks = useMemo(() => {
    const sortableTasks = [...tasks];
    if (sortBy === 'priority') {
      sortableTasks.sort((a, b) => {
        const priorityA = PRIORITY_ORDER[a.priority || Priority.Medium];
        const priorityB = PRIORITY_ORDER[b.priority || Priority.Medium];
        return priorityB - priorityA; // Descending order (High to Low)
      });
    }
    return sortableTasks;
  }, [tasks, sortBy]);


  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-md">
      <div className="flex flex-wrap justify-between items-center mb-4 border-b border-slate-700 pb-2 gap-4">
        <h2 className="text-xl font-bold text-slate-100">Tasks</h2>
        <div className="flex items-center space-x-2">
            <div>
              <label htmlFor="sort-by" className="sr-only">Sort by</label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'default' | 'priority')}
                className="rounded-md bg-slate-700 border-slate-600 text-slate-200 text-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="default">Sort by Default</option>
                <option value="priority">Sort by Priority</option>
              </select>
            </div>
           <button
            onClick={handleGenerateSuggestions}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-300"
          >
            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                <SparklesIcon className="-ml-1 mr-2 h-5 w-5" />
            )}
            {isLoading ? 'Generating...' : 'Generate Suggestions'}
          </button>
          <button
            onClick={onAddTask}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <AddIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Task
          </button>
        </div>
      </div>
      {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-md mb-4">{error}</div>}
      <div className="space-y-3">
        {sortedTasks.length > 0 ? (
          sortedTasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onEdit={onEditTask} 
              onDelete={onDeleteTask}
              onUpdateStatus={onUpdateTaskStatus}
            />
          ))
        ) : (
          <div className="text-center text-slate-400 py-8">
            <p>No tasks yet. Add a task or generate suggestions to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;