import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Project, Task, Status } from '../types';

interface GanttChartProps {
  tasks: Task[];
  projectInfo: Project;
  onUpdateTaskDates: (taskId: string, startDate: string, endDate: string) => void;
}

const statusColors: { [key in Status]: string } = {
  [Status.Done]: '#22c55e', // green-500
  [Status.InProgress]: '#3b82f6', // blue-500
  [Status.ToDo]: '#64748b', // slate-500
};

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

const addDaysToDate = (dateStr: string, days: number): string => {
    const date = new Date(`${dateStr}T00:00:00Z`); // Use Zulu time to avoid timezone issues
    date.setUTCDate(date.getUTCDate() + days);
    return formatDate(date);
};

interface DragState {
  taskId: string;
  action: 'move' | 'resize-start' | 'resize-end';
  initialMouseX: number;
  currentMouseX: number;
  pixelsPerDay: number;
  originalX: number;
  originalWidth: number;
  originalStartDate: string;
  originalEndDate: string;
}

const GanttChart: React.FC<GanttChartProps> = ({ tasks, projectInfo, onUpdateTaskDates }) => {
  const [dragState, setDragState] = useState<DragState | null>(null);

  const dayDifference = useCallback((date1Str: string, date2Str: string) => {
    const date1 = new Date(date1Str);
    const date2 = new Date(date2Str);
    return Math.round((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24));
  }, []);

  const chartData = useMemo(() => tasks.map(task => {
    const startDay = dayDifference(projectInfo.startDate, task.startDate);
    const duration = dayDifference(task.startDate, task.endDate) + 1;
    return {
      name: task.name,
      id: task.id,
      timeline: [startDay, startDay + duration],
      status: task.status,
      startDate: task.startDate,
      endDate: task.endDate,
    };
  }).sort((a, b) => a.timeline[0] - b.timeline[0]), [tasks, projectInfo, dayDifference]);

  const projectDuration = dayDifference(projectInfo.startDate, projectInfo.endDate);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setDragState(prev => prev ? { ...prev, currentMouseX: e.clientX } : null);
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (dragState) {
        const { taskId, action, initialMouseX, pixelsPerDay, originalStartDate, originalEndDate } = dragState;
        const deltaX = e.clientX - initialMouseX;
        const deltaDays = Math.round(deltaX / pixelsPerDay);

        if (deltaDays !== 0) {
          let newStartDate = originalStartDate;
          let newEndDate = originalEndDate;

          if (action === 'move') {
            newStartDate = addDaysToDate(originalStartDate, deltaDays);
            newEndDate = addDaysToDate(originalEndDate, deltaDays);
          } else if (action === 'resize-end') {
            newEndDate = addDaysToDate(originalEndDate, deltaDays);
            if (new Date(newEndDate) < new Date(newStartDate)) {
              newEndDate = newStartDate;
            }
          } else if (action === 'resize-start') {
            newStartDate = addDaysToDate(originalStartDate, deltaDays);
            if (new Date(newStartDate) > new Date(newEndDate)) {
              newStartDate = newEndDate;
            }
          }
          onUpdateTaskDates(taskId, newStartDate, newEndDate);
        }
        setDragState(null);
      }
    };

    if (dragState) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp, { once: true });
      document.body.style.cursor = dragState.action === 'move' ? 'grabbing' : 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [dragState, onUpdateTaskDates]);

  const CustomBar = (props: any) => {
    const { x, y, width, height, fill, payload } = props;

    const handleMouseDown = (e: React.MouseEvent, action: DragState['action']) => {
      e.stopPropagation();
      const durationDays = dayDifference(payload.startDate, payload.endDate) + 1;
      setDragState({
        taskId: payload.id,
        action,
        initialMouseX: e.clientX,
        currentMouseX: e.clientX,
        pixelsPerDay: width / durationDays,
        originalX: x,
        originalWidth: width,
        originalStartDate: payload.startDate,
        originalEndDate: payload.endDate,
      });
    };

    let displayX = x;
    let displayWidth = width;

    if (dragState && dragState.taskId === payload.id) {
      const deltaX = dragState.currentMouseX - dragState.initialMouseX;
      if (dragState.action === 'move') {
        displayX += deltaX;
      } else if (dragState.action === 'resize-end') {
        displayWidth = Math.max(dragState.pixelsPerDay, dragState.originalWidth + deltaX);
      } else if (dragState.action === 'resize-start') {
        const newWidth = Math.max(dragState.pixelsPerDay, dragState.originalWidth - deltaX);
        displayX = dragState.originalX + (dragState.originalWidth - newWidth);
        displayWidth = newWidth;
      }
    }

    return (
      <g>
        <rect
          x={displayX}
          y={y}
          width={displayWidth}
          height={height}
          fill={fill}
          onMouseDown={(e) => handleMouseDown(e, 'move')}
          style={{ cursor: 'grab' }}
          rx="2"
          ry="2"
        />
        {/* Resize Handles */}
        <rect
          x={displayX - 4}
          y={y}
          width={8}
          height={height}
          fill="transparent"
          onMouseDown={(e) => handleMouseDown(e, 'resize-start')}
          style={{ cursor: 'ew-resize' }}
        />
        <rect
          x={displayX + displayWidth - 4}
          y={y}
          width={8}
          height={height}
          fill="transparent"
          onMouseDown={(e) => handleMouseDown(e, 'resize-end')}
          style={{ cursor: 'ew-resize' }}
        />
      </g>
    );
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const start = data.timeline[0];
      const end = data.timeline[1];
      const duration = end - start;
      return (
        <div className="bg-slate-900 p-3 border border-slate-700 rounded-md shadow-lg">
          <p className="font-bold text-slate-100">{`${label}`}</p>
          <p className="text-sm text-slate-400">{`Status: ${data.status}`}</p>
          <p className="text-sm text-slate-400">{`Starts on Day ${start}`}</p>
          <p className="text-sm text-slate-400">{`Duration: ${duration} day(s)`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-md select-none">
      <h2 className="text-xl font-bold text-slate-100 mb-4 border-b border-slate-700 pb-2">Project Timeline</h2>
      <div style={{ width: '100%', height: tasks.length * 50 + 60, minHeight: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            barCategoryGap="35%"
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
            {/* Fix: Changed allowDecals to allowDecimals */}
            <XAxis type="number" domain={[0, projectDuration]} allowDecimals={false} label={{ value: 'Days Since Project Start', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} tick={{ fill: '#94a3b8' }} />
            <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12, fill: '#cbd5e1' }} interval={0} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(71, 85, 105, 0.5)' }} />
            <Bar dataKey="timeline" isAnimationActive={false}>
               {chartData.map((entry, index) => (
                  <Bar key={`cell-${index}`} fill={statusColors[entry.status as Status]} shape={<CustomBar />} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GanttChart;