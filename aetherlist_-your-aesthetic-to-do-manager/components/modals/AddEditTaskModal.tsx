
import React, { useState, useEffect } from 'react';
import { Task, Category } from '../../types';
import { XMarkIcon } from '../Icons';

interface AddEditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  taskToEdit?: Task | null;
  categories: Category[];
  selectedCategoryId: string | null;
}

const AddEditTaskModal: React.FC<AddEditTaskModalProps> = ({ isOpen, onClose, onSave, taskToEdit, categories, selectedCategoryId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [reminder, setReminder] = useState(false);

  useEffect(() => {
    if (isOpen) {
        if (taskToEdit) {
            setTitle(taskToEdit.title);
            setDescription(taskToEdit.description);
            setCategoryId(taskToEdit.categoryId);
            setDueDate(taskToEdit.dueDate);
            setDueTime(taskToEdit.dueTime);
            setReminder(taskToEdit.reminder);
        } else {
            setTitle('');
            setDescription('');
            setCategoryId(selectedCategoryId && selectedCategoryId !== 'all' ? selectedCategoryId : (categories[0]?.id || ''));
            setDueDate('');
            setDueTime('');
            setReminder(false);
        }
    }
  }, [taskToEdit, isOpen, categories, selectedCategoryId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !categoryId) {
        alert("Please provide a title and select a category.");
        return;
    };

    onSave({
      id: taskToEdit ? taskToEdit.id : `task-${Date.now()}`,
      title: title.trim(),
      description,
      categoryId,
      dueDate,
      dueTime,
      reminder,
      isCompleted: taskToEdit ? taskToEdit.isCompleted : false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity">
      <div className="bg-secondary rounded-lg shadow-xl p-8 w-full max-w-lg m-4 transform transition-all scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-light">{taskToEdit ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="task-title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input id="task-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Finish project proposal" className="w-full bg-accent border-2 border-gray-600 rounded-md px-4 py-2 text-light focus:ring-2 focus:ring-highlight focus:border-highlight outline-none transition"/>
          </div>
          <div>
            <label htmlFor="task-description" className="block text-sm font-medium text-gray-300 mb-1">Description (Optional)</label>
            <textarea id="task-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Add more details..." className="w-full bg-accent border-2 border-gray-600 rounded-md px-4 py-2 text-light focus:ring-2 focus:ring-highlight focus:border-highlight outline-none transition"></textarea>
          </div>
          <div>
            <label htmlFor="task-category" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
            <select id="task-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full bg-accent border-2 border-gray-600 rounded-md px-4 py-2 text-light focus:ring-2 focus:ring-highlight focus:border-highlight outline-none transition">
              <option value="" disabled>Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-duedate" className="block text-sm font-medium text-gray-300 mb-1">Due Date</label>
              <input id="task-duedate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full bg-accent border-2 border-gray-600 rounded-md px-4 py-2 text-light focus:ring-2 focus:ring-highlight focus:border-highlight outline-none transition"/>
            </div>
            <div>
              <label htmlFor="task-duetime" className="block text-sm font-medium text-gray-300 mb-1">Time</label>
              <input id="task-duetime" type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} className="w-full bg-accent border-2 border-gray-600 rounded-md px-4 py-2 text-light focus:ring-2 focus:ring-highlight focus:border-highlight outline-none transition"/>
            </div>
          </div>
          <div className="flex items-center">
            <input id="task-reminder" type="checkbox" checked={reminder} onChange={(e) => setReminder(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-highlight bg-gray-700 focus:ring-highlight"/>
            <label htmlFor="task-reminder" className="ml-2 block text-sm text-gray-300">Set Reminder</label>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-md bg-accent text-light font-semibold hover:bg-gray-600 transition-all transform hover:scale-105">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-md bg-highlight text-white font-semibold hover:bg-violet-500 transition-all transform hover:scale-105 shadow-lg">{taskToEdit ? 'Save Changes' : 'Create Task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditTaskModal;