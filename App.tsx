import React, { useState, useCallback } from 'react';
import { Project, Task, Status } from './types';
import Header from './components/Header';
import ProjectInfoForm from './components/ProjectInfoForm';
import TaskList from './components/TaskList';
import GanttChart from './components/GanttChart';
import AddTaskModal from './components/AddTaskModal';

// Declare jspdf and html2canvas from global scope
declare const jspdf: any;
declare const html2canvas: any;

const App: React.FC = () => {
  const [projectInfo, setProjectInfo] = useState<Project>({
    name: 'My Awesome Project',
    description: 'Developing a next-generation project planner with AI features.',
    startDate: '2024-08-01',
    endDate: '2024-09-30',
  });

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', name: 'Initial Setup & Scaffolding', description: 'Create the basic React project structure.', assignee: 'Alice', status: Status.Done, startDate: '2024-08-01', endDate: '2024-08-05' },
    { id: '2', name: 'UI/UX Design Mockups', description: 'Design the main dashboard and components.', assignee: 'Bob', status: Status.Done, startDate: '2024-08-03', endDate: '2024-08-10' },
    { id: '3', name: 'Develop Core Components', description: 'Build reusable React components.', assignee: 'Alice', status: Status.InProgress, startDate: '2024-08-11', endDate: '2024-08-25' },
    { id: '4', name: 'Integrate Gemini API', description: 'Implement AI task suggestion feature.', assignee: 'Charlie', status: Status.ToDo, startDate: '2024-08-20', endDate: '2024-09-05' },
    { id: '5', name: 'Implement PDF Export', description: 'Add functionality to export the plan as a PDF.', assignee: 'Bob', status: Status.ToDo, startDate: '2024-09-01', endDate: '2024-09-10' },
    { id: '6', name: 'Testing and QA', description: 'Perform end-to-end testing and fix bugs.', assignee: 'Diana', status: Status.ToDo, startDate: '2024-09-11', endDate: '2024-09-25' },
    { id: '7', name: 'Deployment', description: 'Deploy the application to production.', assignee: 'Alice', status: Status.ToDo, startDate: '2024-09-26', endDate: '2024-09-30' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleOpenModal = (task: Task | null = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleSaveTask = (task: Omit<Task, 'id' | 'status'>, id?: string) => {
    if (id) {
      setTasks(tasks.map(t => t.id === id ? { ...t, ...task } : t));
    } else {
      setTasks([...tasks, { ...task, id: Date.now().toString(), status: Status.ToDo }]);
    }
    handleCloseModal();
  };
  
  const handleUpdateTaskStatus = useCallback((taskId: string, status: Status) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  }, []);

  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  }, []);

  const handleUpdateTaskDates = useCallback((taskId: string, startDate: string, endDate: string) => {
    setTasks(prevTasks => prevTasks.map(task =>
      task.id === taskId ? { ...task, startDate, endDate } : task
    ));
  }, []);

  const handleExportPDF = async () => {
    setIsExporting(true);
    const input = document.getElementById('project-plan');
    if (input) {
      try {
        const canvas = await html2canvas(input, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#0f172a', // Match body bg (slate-900)
          onclone: (document) => {
            // Remove box-shadows during capture as they can render poorly
            const elements = document.querySelectorAll('.shadow-md, .shadow-lg');
            elements.forEach(el => (el as HTMLElement).style.boxShadow = 'none');
          }
        });
        const imgData = canvas.toDataURL('image/png');
        
        // Use jspdf from the global window object
        const { jsPDF } = jspdf;
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [canvas.width, canvas.height],
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`${projectInfo.name.replace(/\s/g, '_')}_Plan.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Sorry, there was an error generating the PDF. Please try again.");
      }
    }
    setIsExporting(false);
  };

  return (
    <div className="bg-slate-900 min-h-screen font-sans text-slate-200">
      <Header onExport={handleExportPDF} isExporting={isExporting} />
      <main className="p-4 md:p-8">
        <div id="project-plan" className="max-w-7xl mx-auto space-y-8 p-8 bg-slate-800/50 rounded-lg">
          <ProjectInfoForm projectInfo={projectInfo} setProjectInfo={setProjectInfo} />
          <GanttChart tasks={tasks} projectInfo={projectInfo} onUpdateTaskDates={handleUpdateTaskDates} />
          <TaskList 
            tasks={tasks} 
            projectInfo={projectInfo}
            setTasks={setTasks}
            onEditTask={handleOpenModal} 
            onDeleteTask={handleDeleteTask} 
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onAddTask={() => handleOpenModal(null)} 
          />
        </div>
      </main>
      {isModalOpen && (
        <AddTaskModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          onSave={handleSaveTask}
          task={editingTask}
        />
      )}
    </div>
  );
};

export default App;