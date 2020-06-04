import * as Yup from 'yup';
import Subscriber from '../models/Subscriber';
import User from '../models/User';

class SubscriberController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const subscribers = await Subscriber.findAll({
      where: {},
      attributes: ['id', 'name', 'email'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.status(200).json(subscribers);
  }

  async getById(req, res) {
    const operators = await Subscriber.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email'],
    });

    return res.status(200).json(operators);
  }

  async store(req, res) {
    /* valida user para vincular ao subscriber */
    const schemaUser = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schemaUser.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação.' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    /* valida subscriber */
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação.' });
    }

    const subscriberExists = await Subscriber.findOne({
      where: { email: req.body.email },
    });
    if (subscriberExists) {
      return res
        .status(400)
        .json({ error: 'Já existe uma inscrição para este e-mail' });
    }

    /* cria subscribe */
    const { id, name, email } = await Subscriber.create(req.body);
    if (id) {
      /* cria user */
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        subscriber_id: id,
        permission: 6,
      });
    }

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

    const { id, name, email } = req.body;

    const subscriber = await Subscriber.findByPk(id);
    if (email !== subscriber.email) {
      const subscriberExists = await Subscriber.findOne({ where: { email } });
      if (subscriberExists) {
        return res
          .status(400)
          .json({ error: 'Já existe uma inscrição para este e-mail' });
      }
    }

    await Subscriber.update(req.body, {
      where: { id },
    });

    return res.json({ id, name, email });
  }

  async delete(req, res) {
    const subscriber = await Subscriber.findByPk(req.params.id);

    if (!subscriber) {
      return res.status(401).json({
        error: 'Registro não encontrado.',
      });
    }

    if (subscriber.subscriber_id !== req.subscriberId) {
      return res.status(401).json({
        error: 'Você não tem permissão para remover está inscrição.',
      });
    }

    await Subscriber.destroy({ where: { id: req.params.id } });

    return res.status(200).json({ status: true });
  }
}

export default new SubscriberController();
