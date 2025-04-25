import type { VercelRequest, VercelResponse } from '@vercel/node';
import { userProgress } from '../db.json';

export default function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method === 'GET') {
    return response.status(200).json(userProgress);
  }
  
  if (request.method === 'PUT') {
    // In a real application, you would update a database here
    // For now, we'll just return the request body
    return response.status(200).json(request.body);
  }
  
  return response.status(405).json({ message: 'Method not allowed' });
} 