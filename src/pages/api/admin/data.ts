// pages/api/admin/data.ts
import { getSession } from '@auth0/nextjs-auth0';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);

  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const roles = session.user['process.env.AUTH0_BASE_URL'] || [];

  if (!roles.includes('admin')) {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }

  // Admin logic here
  res.status(200).json({ message: 'Welcome admin!' });
}
