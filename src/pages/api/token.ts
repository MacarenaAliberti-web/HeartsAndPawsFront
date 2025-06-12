import type { NextApiRequest, NextApiResponse } from 'next';
import { getAccessToken, withApiAuthRequired, AccessTokenRequest } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { accessToken } = await getAccessToken(
      req,
      res,
      { audience: 'https://backend-hearts-paws/api' } as AccessTokenRequest
    );

    console.log('Este es el token: ' + accessToken)
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Error obteniendo token:', error);
    res.status(500).json({ error: 'No se pudo obtener el token' });
  }
});
