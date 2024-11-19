import { useState, FormEvent, ChangeEvent } from 'react';
import { uploadFile, ApiError } from '@/lib/api';
import { sendMessageToParent } from '@/utils/iframeMessage';

const getErrorMessage = (error: ApiError): string => {
  if (process.env.NODE_ENV === 'development') {
    return error.message;
  }

  switch (error.code) {
    case 'NETWORK_ERROR':
      return 'Unable to connect to our servers. Please check your internet connection and try again.';
    case 'SERVER_ERROR':
      return 'We\'re experiencing technical difficulties. Please try again later.';
    case 'VALIDATION_ERROR':
      return error.message;
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

export const FileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!selectedFile) {
      const errorMsg = 'Please select a file';
      setError(errorMsg);
      sendMessageToParent({
        type: 'ERROR',
        payload: { message: errorMsg, code: 'VALIDATION_ERROR' }
      });
      return;
    }

    if (!password) {
      const errorMsg = 'Please enter a password';
      setError(errorMsg);
      sendMessageToParent({
        type: 'ERROR',
        payload: { message: errorMsg, code: 'VALIDATION_ERROR' }
      });
      return;
    }

    setIsUploading(true);
    sendMessageToParent({
      type: 'LOADING',
      payload: { message: 'Uploading file...' }
    });

    try {
      const response = await uploadFile(selectedFile, password);

      sendMessageToParent({
        type: 'UPLOAD_COMPLETE',
        payload: {
          message: 'File uploaded successfully!',
          url: response.url
        }
      });

      // Reset form
      setSelectedFile(null);
      setPassword('');

    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = getErrorMessage(apiError);
      setError(errorMessage);

      sendMessageToParent({
        type: apiError.code === 'NETWORK_ERROR' ? 'BACKEND_ERROR' : 'ERROR',
        payload: {
          message: errorMessage,
          code: apiError.code
        }
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload PowerPoint File</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File input */}
        <div className="space-y-2">
          <label
            htmlFor="file"
            className="block text-sm font-medium text-gray-700"
          >
            Select PowerPoint File
          </label>
          <input
            type="file"
            id="file"
            accept=".ppt,.pptx"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            disabled={isUploading}
          />
          {selectedFile && (
            <p className="text-sm text-gray-500 mt-1">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>

        {/* Password input */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Set Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2
              focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter password for protection"
            disabled={isUploading}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isUploading || !selectedFile || !password}
          className="w-full flex justify-center py-2 px-4 border border-transparent
            rounded-md shadow-sm text-sm font-medium text-white bg-blue-600
            hover:bg-blue-700 focus:outline-none focus:ring-2
            focus:ring-offset-2 focus:ring-blue-500
            disabled:bg-blue-300 disabled:cursor-not-allowed"
          aria-label={isUploading ? 'Uploading file...' : 'Upload file'}
        >
          {isUploading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : (
            'Upload File'
          )}
        </button>
      </form>
    </div>
  );
};