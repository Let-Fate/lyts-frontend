// Alert.tsx
import React, { useState } from 'react';

interface AlertProps {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
    const typeStyles = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-black',
        info: 'bg-blue-500 text-white',
    };

    return (
        <div className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end">
            <div className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${typeStyles[type]}`}>
                <div className="p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            {/* 这里可以添加图标 */}
                        </div>
                        <div className="ml-3 w-0 flex-1 pt-0.5">
                            <p className="text-sm font-medium">{message}</p>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                            <button onClick={onClose} className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <span className="sr-only">Close</span>
                                {/* 关闭图标 */}
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const useAlert = () => {
    const [alertProps, setAlertProps] = useState<AlertProps | null>(null);
  
    const showAlert = (message: string, type: AlertProps['type'], duration: number = 3000) => {
      setAlertProps({ message, type, onClose: () => setAlertProps(null) });
      setTimeout(() => {
        setAlertProps(null);
      }, duration);
    };
  
    const AlertComponent = () => {
      return alertProps ? <Alert {...alertProps} /> : null;
    };
  
    return { showAlert, AlertComponent };
  };
  
export { useAlert };
