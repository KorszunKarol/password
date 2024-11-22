import { AlertCircle } from 'lucide-react'

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay = ({ message }: ErrorDisplayProps) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-red-600">
      <AlertCircle className="h-4 w-4 text-red-600" /> 
      <span>{message}</span>
    </div>
  );
};

export default ErrorDisplay;