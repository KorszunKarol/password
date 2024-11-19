type MessageType = 'SUCCESS' | 'ERROR' | 'LOADING' | 'UPLOAD_COMPLETE' | 'BACKEND_ERROR';

interface IframeMessage {
  type: MessageType;
  payload?: {
    message?: string;
    url?: string;
    error?: string;
    code?: 'NETWORK_ERROR' | 'SERVER_ERROR' | 'VALIDATION_ERROR';
  };
}

export const sendMessageToParent = (message: IframeMessage) => {
  if (window.parent !== window) {
    window.parent.postMessage(message, '*');
  }
};