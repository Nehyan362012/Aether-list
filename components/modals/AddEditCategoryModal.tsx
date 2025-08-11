
import React, { useState, useEffect } from 'react';
import { Category } from '../../types';
import { CATEGORY_COLORS } from '../../constants';
import { XMarkIcon } from '../Icons';

interface AddEditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Category) => void;
  categoryToEdit?: Category | null;
}

const AddEditCategoryModal: React.FC<AddEditCategoryModalProps> = ({ isOpen, onClose, onSave, categoryToEdit }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(CATEGORY_COLORS[0]);

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setColor(categoryToEdit.color);
    } else {
      setName('');
      setColor(CATEGORY_COLORS[0]);
    }
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: categoryToEdit ? categoryToEdit.id : `cat-${Date.now()}`,
      name: name.trim(),
      color,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity">
      <div className="bg-secondary rounded-lg shadow-xl p-8 w-full max-w-md m-4 transform transition-all scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-light">{categoryToEdit ? 'Edit Category' : 'New Category'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="category-name" className="block text-sm font-medium text-gray-300 mb-2">
              Category Name
            </label>
            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Personal"
              className="w-full bg-accent border-2 border-gray-600 rounded-md px-4 py-2 text-light focus:ring-2 focus:ring-highlight focus:border-highlight outline-none transition"
            />
          </div>
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
            <div className="grid grid-cols-8 gap-2">
              {CATEGORY_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-full transition transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-offset-secondary ring-white' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-md bg-accent text-light font-semibold hover:bg-gray-600 transition-all transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-highlight text-white font-semibold hover:bg-violet-500 transition-all transform hover:scale-105 shadow-lg"
            >
              {categoryToEdit ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditCategoryModal;