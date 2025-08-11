
export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:MM
  isCompleted: boolean;
  reminder: boolean;
}
