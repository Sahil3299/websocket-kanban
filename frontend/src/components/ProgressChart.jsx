import React, { useContext } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TaskContext } from '../context/TaskContext';
import '../styles/ProgressChart.css';

const ProgressChart = () => {
  const { tasks } = useContext(TaskContext);

  const columnData = [
    { name: 'To Do', value: tasks.filter(t => t.column === 'todo').length, color: '#4A90E2' },
    { name: 'In Progress', value: tasks.filter(t => t.column === 'inprogress').length, color: '#F5A623' },
    { name: 'Done', value: tasks.filter(t => t.column === 'done').length, color: '#7ED321' }
  ];

  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#FF6B6B' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#FFD93D' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#6BCF7F' }
  ];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.column === 'done').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="progress-chart">
      <h3>📈 Task Progress</h3>
      
      <div className="completion-rate">
        <div className="rate-circle">
          <span className="rate-value">{completionRate}%</span>
          <span className="rate-label">Complete</span>
        </div>
        <div className="rate-stats">
          <p>Total Tasks: <strong>{totalTasks}</strong></p>
          <p>Completed: <strong>{completedTasks}</strong></p>
          <p>Remaining: <strong>{totalTasks - completedTasks}</strong></p>
        </div>
      </div>
      
      <div className="chart-container">
        <h4>Tasks by Status</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={columnData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8">
              {columnData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="chart-container">
        <h4>Tasks by Priority</h4>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={priorityData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${entry.value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {priorityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;