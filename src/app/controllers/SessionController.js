import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Subscriber from '../models/Subscriber';
import User from '../models/User';
import File from '../models/File';
import authConfig from '../../config/auth';
import Mail from '../../lib/Mail';

class SessionController {
  async store(req, res) {
    const { email, password, unlock } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [
        { model: File, as: 'avatar', attributes: ['id', 'path', 'url'] },
      ],
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    if (!unlock) {
      if (!(await user.checkPassword(password))) {
        return res.status(401).json({ error: 'Password não confere.' });
      }
    }

    const { subscriber_id, id, name, avatar, permission } = user;

    const subscriber = await Subscriber.findByPk(subscriber_id);

    return res.status(200).json({
      token: jwt.sign(
        {
          subscriber_id,
          subscriber_email: subscriber.email,
          id,
          name,
          email,
          avatar,
          permission,
        },
        authConfig.secret,
        {
          expiresIn: authConfig.expiresIn,
        }
      ),
    });
  }

  async lock(req, res) {
    const { email, unlock } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [
        { model: File, as: 'avatar', attributes: ['id', 'path', 'url'] },
      ],
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    const password = Math.floor(
      Math.random() * (99999999 - 10000000) + 10000000
    ).toString();

    const password_lock = await bcrypt.hash(password, 8);
    await User.update({ password_lock }, { where: { id: user.id } });

    if (!password_lock) {
      return res.status(400).json({ error: 'Nenhum password foi gerado.' });
    }

    const { subscriber_id, id, name, avatar } = user;

    const subscriber = await Subscriber.findByPk(subscriber_id);

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'TEC Corretor',
      template: 'unlock',
      context: {
        subscriber_name: subscriber.name,
        name,
        email,
        password,
      },
    });

    return res.status(200).json({
      token: jwt.sign(
        {
          subscriber_id,
          subscriber_email: subscriber.email,
          id,
          name,
          email,
          avatar,
          logged: !unlock,
        },
        authConfig.secret,
        {
          expiresIn: authConfig.expiresIn,
        }
      ),
    });
  }

  async unlock(req, res) {
    const { email, password_lock, password, repassword } = req.body;

    if (password !== repassword) {
      return res.status(401).json({ error: 'Passwords não conferem.' });
    }

    const user = await User.findOne({
      where: { email },
      include: [
        { model: File, as: 'avatar', attributes: ['id', 'path', 'url'] },
      ],
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    if (!(await user.checkPasswordLock(password_lock))) {
      return res.status(401).json({ error: 'Código de acesso não confere.' });
    }

    if (password !== repassword) {
      return res.status(401).json({ error: 'Password não confere.' });
    }

    const pass = await bcrypt.hash(password, 8);

    await User.update(
      {
        password_hash: pass,
        password_lock: null,
      },
      { where: { id: user.id } }
    );

    const { subscriber_id, id, name, avatar, permission } = user;

    const subscriber = await Subscriber.findByPk(subscriber_id);

    return res.status(200).json({
      token: jwt.sign(
        {
          subscriber_id,
          subscriber_email: subscriber.email,
          id,
          name,
          email,
          avatar,
          permission,
        },
        authConfig.secret,
        {
          expiresIn: authConfig.expiresIn,
        }
      ),
    });
  }
}

export default new SessionController();
