import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provider' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    req.subscriberId = decoded.subscriber_id;
    req.subscriberEmail = decoded.subscriber_email;
    req.superUser = Number(decoded.permission) > 6;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
