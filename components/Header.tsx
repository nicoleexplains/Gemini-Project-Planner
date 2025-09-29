import React from 'react';
import { DownloadIcon, ProjectIcon } from './icons/Icons';

interface HeaderProps {
  onExport: () => void;
  isExporting: boolean;
}

const Header: React.FC<HeaderProps> = ({ onExport, isExporting }) => {
  return (
    <header className="bg-slate-800 shadow-md shadow-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <ProjectIcon className="h-8 w-8 text-primary-500" />
          <h1 className="text-2xl font-bold text-slate-100">
            Gemini Project Planner
          </h1>
        </div>
        <button
          onClick={onExport}
          disabled={isExporting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 disabled:cursor-not-allowed"
        >
          {isExporting ? (
             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <DownloadIcon className="-ml-1 mr-2 h-5 w-5" />
          )}
          {isExporting ? 'Exporting...' : 'Export to PDF'}
        </button>
      </div>
    </header>
  );
};

export default Header;