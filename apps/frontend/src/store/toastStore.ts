import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  add: (toast: Omit<Toast, 'id'>) => string;
  remove: (id: string) => void;
  clear: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  add: (toast) => {
    const id = Date.now().toString();
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    if (toast.duration !== 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, toast.duration || 3000);
    }

    return id;
  },

  remove: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clear: () => set({ toasts: [] }),
}));

export const toast = {
  success: (message: string, duration?: number) =>
    useToastStore.getState().add({ type: 'success', message, duration }),
  error: (message: string, duration?: number) =>
    useToastStore.getState().add({ type: 'error', message, duration }),
  info: (message: string, duration?: number) =>
    useToastStore.getState().add({ type: 'info', message, duration }),
  warning: (message: string, duration?: number) =>
    useToastStore.getState().add({ type: 'warning', message, duration }),
};
