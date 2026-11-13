import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type ToastMessage = {
  id: number;
  title: string;
  description?: string;
};

type ToastApi = {
  push: (message: { title: string; description?: string }) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const nextId = useRef(0);
  const timers = useRef<number[]>([]);

  const push = useCallback((message: { title: string; description?: string }) => {
    const id = (nextId.current += 1);
    setMessages((current) => [...current.slice(-2), { ...message, id }]);
    const timer = window.setTimeout(() => {
      setMessages((current) => current.filter((item) => item.id !== id));
    }, 3800);
    timers.current.push(timer);
  }, []);

  useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
    },
    [],
  );

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed bottom-5 left-1/2 z-[130] flex w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 flex-col gap-2 print-hide md:left-[max(1.25rem,var(--spacing-gutter))] md:translate-x-0"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className="toast-enter pointer-events-auto border border-ink/12 bg-cream px-4 py-3 text-ink shadow-[0_18px_50px_-28px_rgba(16,18,15,0.5)]"
          >
            <p className="text-[0.8125rem] font-medium leading-snug">{message.title}</p>
            {message.description ? (
              <p className="mt-1 text-[0.75rem] leading-snug text-ink/60">{message.description}</p>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
};
