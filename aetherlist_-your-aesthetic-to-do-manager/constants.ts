export const CATEGORY_COLORS = [
  '#EF4444', // red-500
  '#F97316', // orange-500
  '#EAB308', // yellow-500
  '#22C55E', // green-500
  '#3B82F6', // blue-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
  '#14B8A6', // teal-500
];

export const THEMES: Record<string, { name: string; [key: string]: string }> = {
  dark: {
    name: 'Dark',
    '--color-primary': '#1a1a1a',
    '--color-secondary': '#2a2a2a',
    '--color-accent': '#3a3a3a',
    '--color-light': '#f0f0f0',
    '--color-highlight': '#8B5CF6',
  },
  light: {
    name: 'Light',
    '--color-primary': '#f0f2f5',
    '--color-secondary': '#ffffff',
    '--color-accent': '#e5e7eb',
    '--color-light': '#111827',
    '--color-highlight': '#8B5CF6',
  },
  synthwave: {
    name: 'Synthwave',
    '--color-primary': '#2d2a4c',
    '--color-secondary': '#201f33',
    '--color-accent': '#37325f',
    '--color-light': '#fdfdfe',
    '--color-highlight': '#ff79c6',
  },
  forest: {
    name: 'Forest',
    '--color-primary': '#2a3d34',
    '--color-secondary': '#1e2d25',
    '--color-accent': '#395348',
    '--color-light': '#e6f0e9',
    '--color-highlight': '#6a994e',
  },
  coffee: {
    name: 'Coffee',
    '--color-primary': '#4a2c2a',
    '--color-secondary': '#3e2723',
    '--color-accent': '#5d4037',
    '--color-light': '#d7ccc8',
    '--color-highlight': '#a1887f',
  },
  ocean: {
    name: 'Ocean',
    '--color-primary': '#0d47a1',
    '--color-secondary': '#1565c0',
    '--color-accent': '#1e88e5',
    '--color-light': '#e3f2fd',
    '--color-highlight': '#ffc107',
  },
  sakura: {
    name: 'Sakura',
    '--color-primary': '#fdf0f4',
    '--color-secondary': '#ffffff',
    '--color-accent': '#fce4ec',
    '--color-light': '#4c223a',
    '--color-highlight': '#e91e63',
  }
};
