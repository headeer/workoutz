import type { VercelRequest, VercelResponse } from '@vercel/node';
import { workouts } from '../db.json';

export default function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method === 'GET') {
    return response.status(200).json(workouts);
  }
  
  return response.status(405).json({ message: 'Method not allowed' });
} 