import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../../../../lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, sectionId } = req.query;

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('workout_id', id)
        .eq('section_id', sectionId)
        .order('order', { ascending: true });

      if (error) throw error;
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching exercises' });
    }
  } else if (req.method === 'POST') {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .insert([{ ...req.body, workout_id: id, section_id: sectionId }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error creating exercise' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 