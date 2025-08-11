import React, { useState, useMemo } from 'react';
import { Task, Category } from '../types';
import { PlusIcon, EditIcon, TrashIcon, CalendarIcon, ClockIcon, CheckIcon, TagIcon, PaletteIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from './Icons';
import AddEditTaskModal from './modals/AddEditTaskModal';
import AddEditCategoryModal from './modals/AddEditCategoryModal';
import { THEMES } from '../constants';

interface TodoAppProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  theme: string;
  setTheme: (theme: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  audioPlayer: { playSuccess: () => void; playTrash: () => void; playToggle: () => void; };
}

const TodoApp: React.FC<TodoAppProps> = ({ tasks, setTasks, categories, setCategories, theme, setTheme, soundEnabled, setSoundEnabled, audioPlayer }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [modalState, setModalState] = useState<{ type: 'task' | 'category' | null; mode: 'add' | 'edit'; data?: Task | Category }>({ type: null, mode: 'add' });

  const handleSaveTask = (task: Task) => {
    setTasks(prev => {
      const exists = prev.some(t => t.id === task.id);
      return exists ? prev.map(t => (t.id === task.id ? task : t)) : [...prev, task];
    });
    audioPlayer.playSuccess();
  };

  const handleDeleteTask = (taskId: string) => {
    if(window.confirm('Are you sure you want to delete this task?')){
      setTasks(tasks.filter(t => t.id !== taskId));
      audioPlayer.playTrash();
    }
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t));
    audioPlayer.playToggle();
  };
  
  const handleSaveCategory = (category: Category) => {
    setCategories(prev => {
      const exists = prev.some(c => c.id === category.id);
      return exists ? prev.map(c => (c.id === category.id ? category : c)) : [...prev, category];
    });
     audioPlayer.playSuccess();
  };

  const handleDeleteCategory = (categoryId: string) => {
     if (tasks.some(task => task.categoryId === categoryId)) {
      alert("Cannot delete category with active tasks. Please reassign or delete tasks first.");
      return;
    }
    if(window.confirm('Are you sure you want to delete this category?')){
      setCategories(categories.filter(c => c.id !== categoryId));
      if(selectedCategoryId === categoryId){
        setSelectedCategoryId('all');
      }
      audioPlayer.playTrash();
    }
  };

  const filteredTasks = useMemo(() => {
    if (selectedCategoryId === 'all') return tasks;
    return tasks.filter(task => task.categoryId === selectedCategoryId);
  }, [tasks, selectedCategoryId]);

  const getCategory = (id: string) => categories.find(c => c.id === id);
  const selectedCategory = getCategory(selectedCategoryId);

  return (
    <div className="flex h-screen bg-primary text-light">
      {/* Sidebar */}
      <aside className="w-72 bg-secondary p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-8 text-highlight">AetherList</h1>
        <nav className="flex-grow">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Categories</h2>
          <ul>
            <li className="mb-2">
              <button onClick={() => setSelectedCategoryId('all')} className={`w-full flex items-center p-2 rounded-md transition ${selectedCategoryId === 'all' ? 'bg-accent text-light font-semibold' : 'hover:bg-accent text-gray-300'}`}>
                <TagIcon className="w-5 h-5 mr-3" /> All Tasks
              </button>
            </li>
            {categories.map(cat => (
              <li key={cat.id} className="mb-2 group">
                <div className={`w-full flex items-center justify-between p-2 rounded-md transition ${selectedCategoryId === cat.id ? 'bg-accent font-semibold' : 'hover:bg-accent'}`}>
                  <button onClick={() => setSelectedCategoryId(cat.id)} className="flex-grow flex items-center text-left min-w-0">
                    <span className="w-3 h-3 rounded-full mr-3 flex-shrink-0" style={{ backgroundColor: cat.color }}></span>
                    <span className="truncate">{cat.name}</span>
                  </button>
                  <div className="flex items-center ml-2">
                    <button onClick={() => setModalState({ type: 'category', mode: 'edit', data: cat })} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-highlight transition-all transform hover:scale-125 mr-1">
                      <EditIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all transform hover:scale-125">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </nav>
        <button onClick={() => setModalState({ type: 'category', mode: 'add' })} className="w-full flex items-center justify-center p-2 mt-4 rounded-md bg-accent hover:bg-gray-600 transition-all font-semibold transform hover:scale-105">
          <PlusIcon className="w-5 h-5 mr-2" /> Add Category
        </button>

        {/* Settings */}
        <div className="mt-8 pt-4 border-t border-accent">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Settings</h3>
          <div className="space-y-4">
            <div>
                <label className="flex items-center text-sm text-gray-300 mb-2">
                    <PaletteIcon className="w-5 h-5 mr-2 text-gray-400"/> Theme
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {Object.entries(THEMES).map(([key, themeData]) => (
                        <button
                            key={key}
                            onClick={() => setTheme(key)}
                            className={`w-full h-10 rounded-lg flex items-center justify-center p-1 border-2 transition-all duration-200 ${theme === key ? 'border-highlight scale-105' : 'border-transparent hover:border-accent'}`}
                            title={themeData.name}
                            aria-label={`Select ${themeData.name} theme`}
                        >
                            <div className="flex space-x-1.5" aria-hidden="true">
                                <span className="w-3 h-6 rounded" style={{ backgroundColor: themeData['--color-primary'] }} />
                                <span className="w-3 h-6 rounded" style={{ backgroundColor: themeData['--color-secondary'] }} />
                                <span className="w-3 h-6 rounded" style={{ backgroundColor: themeData['--color-highlight'] }} />
                                <span className="w-3 h-6 rounded" style={{ backgroundColor: themeData['--color-light'] }} />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center text-gray-300">
                  {soundEnabled ? <SpeakerWaveIcon className="w-5 h-5 mr-2 text-gray-400"/> : <SpeakerXMarkIcon className="w-5 h-5 mr-2 text-gray-400"/>} Sound
              </span>
              <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${soundEnabled ? 'bg-highlight' : 'bg-accent'}`}
                  aria-pressed={soundEnabled}
              >
                  <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-1'}`}/>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
              <h2 className="text-3xl font-bold">{selectedCategory ? selectedCategory.name : 'All Tasks'}</h2>
              <p className="text-gray-400">{filteredTasks.length} task(s)</p>
          </div>
          <button onClick={() => setModalState({ type: 'task', mode: 'add'})} className="flex items-center bg-highlight text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-violet-500 transition-transform transform hover:scale-105">
            <PlusIcon className="w-6 h-6 mr-2" /> New Task
          </button>
        </header>

        <div className="space-y-4">
          {filteredTasks.length > 0 ? filteredTasks.sort((a,b) => Number(a.isCompleted) - Number(b.isCompleted)).map(task => {
            const category = getCategory(task.categoryId);
            return (
              <div key={task.id} className={`p-5 rounded-lg bg-secondary shadow-md transition-all duration-300 ${task.isCompleted ? 'opacity-50' : 'hover:shadow-xl hover:-translate-y-1'}`}>
                <div className="flex items-start">
                    <button onClick={() => toggleTaskCompletion(task.id)} className={`w-6 h-6 mt-1 rounded-md flex-shrink-0 flex items-center justify-center border-2 transition-all ${task.isCompleted ? 'bg-highlight border-highlight' : 'border-gray-500 hover:border-highlight'}`}>
                        {task.isCompleted && <CheckIcon className="w-4 h-4 text-white" />}
                    </button>
                    <div className="flex-grow mx-4">
                        <p className={`text-lg font-medium text-light ${task.isCompleted ? 'line-through text-gray-400' : ''}`}>{task.title}</p>
                        {task.description && <p className="text-sm text-gray-400 mt-1">{task.description}</p>}
                        <div className="flex items-center flex-wrap text-xs text-gray-400 mt-2 gap-x-4 gap-y-1">
                            {task.dueDate && <div className="flex items-center"><CalendarIcon className="w-4 h-4 mr-1.5" /><span>{task.dueDate}</span></div>}
                            {task.dueTime && <div className="flex items-center"><ClockIcon className="w-4 h-4 mr-1.5" /><span>{task.dueTime}</span></div>}
                            {category && selectedCategoryId === 'all' && (
                                <div className="flex items-center">
                                    <span className="w-2.5 h-2.5 rounded-full mr-2" style={{backgroundColor: category.color}}></span>
                                    <span>{category.name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => setModalState({type: 'task', mode: 'edit', data: task})} className="p-2 text-gray-400 hover:text-highlight transition-transform transform hover:scale-125"><EditIcon className="w-5 h-5"/></button>
                        <button onClick={() => handleDeleteTask(task.id)} className="p-2 text-gray-400 hover:text-red-500 transition-transform transform hover:scale-125"><TrashIcon className="w-5 h-5" /></button>
                    </div>
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-16 px-8 bg-secondary rounded-lg border-2 border-dashed border-accent">
                <h3 className="text-xl font-semibold text-light">No tasks here!</h3>
                <p className="text-gray-400 mt-2">Click "New Task" to add your first one in this category.</p>
            </div>
          )}
        </div>
      </main>

      {modalState.type === 'task' && (
        <AddEditTaskModal
          isOpen={true}
          onClose={() => setModalState({ type: null, mode: 'add' })}
          onSave={handleSaveTask}
          taskToEdit={modalState.mode === 'edit' ? modalState.data as Task : undefined}
          categories={categories}
          selectedCategoryId={selectedCategoryId}
        />
      )}
      
      {modalState.type === 'category' && (
        <AddEditCategoryModal
          isOpen={true}
          onClose={() => setModalState({ type: null, mode: 'add' })}
          onSave={handleSaveCategory}
          categoryToEdit={modalState.mode === 'edit' ? modalState.data as Category : undefined}
        />
      )}
    </div>
  );
};

export default TodoApp;