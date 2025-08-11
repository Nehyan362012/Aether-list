import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import TodoApp from './components/TodoApp';
import { Task, Category } from './types';
import { CATEGORY_COLORS, THEMES } from './constants';

// --- Audio Player Utility ---
class AudioPlayer {
  private audioContext: AudioContext | null = null;
  private isEnabled: boolean = true;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.error("Web Audio API is not supported in this browser");
        return null;
      }
    }
    return this.audioContext;
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  private playSound(freq: number, duration: number, type: OscillatorType, volume: number = 0.3) {
    if (!this.isEnabled) return;
    const context = this.getContext();
    if (!context) return;
    
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + 0.01);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, context.currentTime);
    
    oscillator.start(context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
    oscillator.stop(context.currentTime + duration);
  }

  public playSuccess = () => this.playSound(600, 0.2, 'sine');
  public playTrash = () => this.playSound(200, 0.2, 'square', 0.15);
  public playToggle = () => this.playSound(440, 0.1, 'triangle', 0.2);
  public playNavigate = () => this.playSound(523.25, 0.15, 'sine', 0.2); // C5
  public playComplete = () => this.playSound(783.99, 0.2, 'sine', 0.25); // G5
}

export const audioPlayer = new AudioPlayer();


// --- Local Storage Hook ---
const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};


const App: React.FC = () => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage<boolean>('hasCompletedOnboarding', false);

  const defaultCategories: Category[] = [
    { id: 'cat-1', name: 'Work', color: CATEGORY_COLORS[4] },
    { id: 'cat-2', name: 'Personal', color: CATEGORY_COLORS[2] },
    { id: 'cat-3', name: 'Shopping', color: CATEGORY_COLORS[6] },
  ];

  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [categories, setCategories] = useLocalStorage<Category[]>('categories', defaultCategories);

  const [theme, setTheme] = useLocalStorage<string>('aetherlist-theme', 'dark');
  const [soundEnabled, setSoundEnabled] = useLocalStorage<boolean>('aetherlist-sound', true);

  useEffect(() => {
    const currentTheme = THEMES[theme] || THEMES.dark;
    const root = document.documentElement;
    Object.entries(currentTheme).forEach(([key, value]) => {
      root.style.setProperty(key, value as string);
    });
  }, [theme]);

  useEffect(() => {
    audioPlayer.setEnabled(soundEnabled);
  }, [soundEnabled]);

  const handleOnboardingComplete = () => {
    audioPlayer.playComplete();
    setHasCompletedOnboarding(true);
  };

  if (!hasCompletedOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} audioPlayer={audioPlayer} />;
  }

  return (
    <TodoApp
      tasks={tasks}
      setTasks={setTasks}
      categories={categories}
      setCategories={setCategories}
      theme={theme}
      setTheme={setTheme}
      soundEnabled={soundEnabled}
      setSoundEnabled={setSoundEnabled}
      audioPlayer={audioPlayer}
    />
  );
};

export default App;
