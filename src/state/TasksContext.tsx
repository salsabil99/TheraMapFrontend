import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { initialTasks, type CheckIn, type Task } from '../data/tasks';

// In-memory task state shared by Today, the Tasks tab and the task flow.
// TODO: replace with API calls once the backend exists.

type TasksValue = {
  tasks: Task[];
  getTask: (id: string) => Task | undefined;
  startTask: (id: string) => void;
  completeTask: (id: string) => void;
  saveCheckIn: (id: string, checkIn: Omit<CheckIn, 'savedAt'>) => void;
};

const TasksContext = createContext<TasksValue | null>(null);

export const clockTime = (date = new Date()) =>
  `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const value = useMemo<TasksValue>(() => {
    const update = (id: string, patch: (t: Task) => Partial<Task>) =>
      setTasks((all) => all.map((t) => (t.id === id ? { ...t, ...patch(t) } : t)));

    return {
      tasks,
      getTask: (id) => tasks.find((t) => t.id === id),
      startTask: (id) => update(id, (t) => (t.status === 'todo' ? { status: 'in_progress' } : {})),
      completeTask: (id) => update(id, (t) => (t.status === 'done' ? {} : { status: 'done', completedAt: clockTime() })),
      saveCheckIn: (id, checkIn) => update(id, () => ({ checkIn: { ...checkIn, savedAt: clockTime() } })),
    };
  }, [tasks]);

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const value = useContext(TasksContext);
  if (!value) throw new Error('useTasks must be used inside TasksProvider');
  return value;
}
