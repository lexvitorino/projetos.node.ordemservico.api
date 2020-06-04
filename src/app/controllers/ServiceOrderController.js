import * as Yup from 'yup';
import ServiceOrder from '../models/ServiceOrder';

class ServiceOrderController {
  async index(req, res) {
    // const { page = 1 } = req.query;
    const users = await ServiceOrder.findAll({
      where: { subscriber_id: req.subscriberId },
      attributes: ['id', 'name', 'email', 'avatar_id', 'permission'],
      // limit: 20,
      // offset: (page - 1) * 20,
    });

    return res.status(200).json(users);
  }

  async getById(req, res) {
    const user = await ServiceOrder.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'avatar_id', 'permission'],
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

    const { id, description } = await ServiceOrder.create(req.body);

    return res.json({
      id,
      description,
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

    const { id } = req.body;

    await ServiceOrder.update(req.body, {
      where: { id },
    });

    const data = await ServiceOrder.findByPk(id, {
      attributes: ['id', 'description'],
    });

    return res.json(data);
  }

  async delete(req, res) {
    const user = await ServiceOrder.findByPk(req.params.id);

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

    await ServiceOrder.destroy({ where: { id: req.params.id } });

    return res.status(200).json({ status: true });
  }
}

export default new ServiceOrderController();
