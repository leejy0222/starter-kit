import { useToastStore, ToastType } from '../store/toastStore';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import clsx from 'clsx';

const getStyles = (type: ToastType) => {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };
  return styles[type];
};

const getIcon = (type: ToastType) => {
  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
  };
  return icons[type];
};

export const ToastContainer = () => {
  const { toasts, remove } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={clsx(
            'flex items-center gap-3 rounded-lg border p-4 shadow-lg animate-in fade-in slide-in-from-bottom-4',
            getStyles(t.type),
          )}
        >
          <div className="flex-shrink-0">{getIcon(t.type)}</div>
          <div className="flex-1 text-sm font-medium">{t.message}</div>
          <button
            onClick={() => remove(t.id)}
            className="flex-shrink-0 ml-auto text-current opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
