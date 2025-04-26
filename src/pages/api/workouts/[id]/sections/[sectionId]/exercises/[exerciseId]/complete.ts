import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../../../../../../lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, sectionId, exerciseId } = req.query;

  if (req.method === 'POST') {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .update({ completed: true })
        .eq('id', exerciseId)
        .eq('workout_id', id)
        .eq('section_id', sectionId)
        .select()
        .single();

      if (error) throw error;
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error completing exercise' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 