export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000',
  endpoints: {
    upload: '/api/upload',
    process: '/api/process'
  }
} as const