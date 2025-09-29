import React from 'react';
import { Project } from '../types';

interface ProjectInfoFormProps {
  projectInfo: Project;
  setProjectInfo: React.Dispatch<React.SetStateAction<Project>>;
}

const ProjectInfoForm: React.FC<ProjectInfoFormProps> = ({ projectInfo, setProjectInfo }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectInfo(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-slate-100 mb-4 border-b border-slate-700 pb-2">Project Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300">Project Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={projectInfo.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 text-slate-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-slate-300">Description</label>
          <textarea
            name="description"
            id="description"
            rows={3}
            value={projectInfo.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 text-slate-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-slate-300">Start Date</label>
          <input
            type="date"
            name="startDate"
            id="startDate"
            value={projectInfo.startDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 text-slate-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-slate-300">End Date</label>
          <input
            type="date"
            name="endDate"
            id="endDate"
            value={projectInfo.endDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 text-slate-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoForm;