import { getState } from '../lib/kv.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') { res.status(405).end(); return; }
  const state = await getState();
  res.status(200).json(state);
}
