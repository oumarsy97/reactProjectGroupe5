import React, { useEffect } from 'react';
import { Alert, AlertDescription } from './alert';
import { CheckCircle, XCircle } from 'lucide-react';

const alertStyles = {
  success: 'bg-green-50 border-green-400 text-green-700',
  error: 'bg-red-50 border-red-400 text-red-700',
};

const iconStyles = {
  success: 'text-green-400',
  error: 'text-red-400',
};

export function TimedAlert({ message, onClose, duration = 3000, type = 'error' }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm animate-fade-in-up">
      <Alert 
        variant={type === 'success' ? 'default' : 'destructive'} 
        className={`mb-4 border ${alertStyles[type]} flex items-center`}
      >
        <Icon className={`mr-2 h-5 w-5 ${iconStyles[type]} animate-bounce`} />
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
}