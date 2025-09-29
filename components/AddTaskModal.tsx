
import React, { useState, useEffect } from 'react';
import { Task, Priority } from '../types';
import { PRIORITY_OPTIONS } from '../constants';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'status'>, id?: string) => void;
  task: Task | null;
  tasks: Task[];
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onSave, task, tasks }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    assignee: '',
    startDate: '',
    endDate: '',
    priority: Priority.Medium,
    dependencies: [] as string[],
  });

  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name,
        description: task.description,
        assignee: task.assignee,
        startDate: task.startDate,
        endDate: task.endDate,
        priority: task.priority || Priority.Medium,
        dependencies: task.dependencies || [],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        assignee: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        priority: Priority.Medium,
        dependencies: [],
      });
    }
  }, [task, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDependenciesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIds = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
    setFormData(prev => ({ ...prev, dependencies: selectedIds }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, task?.id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-slate-100">{task ? 'Edit Task' : 'Add New Task'}</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300">Task Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 text-slate-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-300">Description</label>
                <textarea name="description" id="description" rows={3} value={formData.description} onChange={handleChange} className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 text-slate-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="assignee" className="block text-sm font-medium text-slate-300">Assignee</label>
                    <input type="text" name="assignee" id="assignee" value={formData.assignee} onChange={handleChange} className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 text-slate-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-slate-300">Priority</label>
                    <select
                        name="priority"
                        id="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 text-slate-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    >
                        {PRIORITY_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-slate-300">Start Date</label>
                  <input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 text-slate-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-slate-300">End Date</label>
                  <input type="date" name="endDate" id="endDate" value={formData.endDate} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 text-slate-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                </div>
              </div>
               <div>
                <label htmlFor="dependencies" className="block text-sm font-medium text-slate-300">Dependencies (Ctrl/Cmd + click to select multiple)</label>
                <select
                  multiple
                  name="dependencies"
                  id="dependencies"
                  value={formData.dependencies}
                  onChange={handleDependenciesChange}
                  className="mt-1 block w-full h-24 rounded-md bg-slate-700 border-slate-600 text-slate-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  {tasks.filter(t => t.id !== task?.id).map(potentialDep => (
                    <option key={potentialDep.id} value={potentialDep.id}>{potentialDep.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 border-t border-slate-700 px-6 py-3 text-right space-x-2 rounded-b-lg">
            <button type="button" onClick={onClose} className="inline-flex justify-center rounded-md border border-slate-600 bg-slate-700 px-4 py-2 text-sm font-medium text-slate-200 shadow-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-800">
              Cancel
            </button>
            <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-800">
              {task ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;