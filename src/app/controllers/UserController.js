import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';

class UserController {
  async index(req, res) {
    // const { page = 1 } = req.query;
    const users = await User.findAll({
      where: { subscriber_id: req.subscriberId },
      attributes: User.FIELDS,
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: File.FIELDS,
        },
      ],
      // limit: 20,
      // offset: (page - 1) * 20,
    });

    return res.status(200).json(users);
  }

  async getById(req, res) {
    const user = await User.findByPk(req.params.id, {
      attributes: User.FIELDS,
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: File.FIELDS,
        },
      ],
    });

    return res.status(200).json(user);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      subscriber_id: Yup.number().required(),
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    req.body.subscriber_id = req.subscriberId;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação.' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ error: 'Usuário já existe.' });
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação.' });
    }

    const { id, email, avatar_id } = req.body;

    const user = await User.findByPk(id);

    if (avatar_id && user.avatar_id !== avatar_id) {
      const file = new File();
      await file.unlink(user.avatar_id);
    }

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'Usuário já existe' });
      }
    }

    req.body.password = user.password;

    await User.update(req.body, {
      where: { id },
    });

    const data = await User.findByPk(id, {
      attributes: User.FIELDS,
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: File.FIELDS,
        },
      ],
    });

    return res.json(data);
  }

  async delete(req, res) {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(401).json({
        error: 'Registro não encontrado.',
      });
    }

    if (user.subscriber_id !== req.subscriberId) {
      return res.status(401).json({
        error: 'Você não tem permissão para remover esse usuário.',
      });
    }

    await User.destroy({ where: { id: req.params.id } });

    return res.status(200).json({ status: true });
  }
}

export default new UserController();
