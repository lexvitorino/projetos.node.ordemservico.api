import * as Yup from 'yup';
import ServiceOrder from '../models/ServiceOrder';
import Customer from '../models/Customer';
import User from '../models/User';

class ServiceOrderController {
  async index(req, res) {
    // const { page = 1 } = req.query;
    const serviceOrders = await ServiceOrder.findAll({
      where: {
        subscriber_id: req.subscriberId,
      },
      attributes: ServiceOrder.FIELDS,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: Customer.SINGLE_FIELDS,
        },
        {
          model: User,
          as: 'support',
          attributes: User.SINGLE_FIELDS,
        },
      ],
      // limit: 20,
      // offset: (page - 1) * 20,
    });

    return res.status(200).json(serviceOrders);
  }

  async getById(req, res) {
    const serviceOrder = await ServiceOrder.findByPk(req.params.id, {
      attributes: ServiceOrder.FIELDS,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: Customer.SINGLE_FIELDS,
        },
        {
          model: User,
          as: 'support',
          attributes: User.SINGLE_FIELDS,
        },
      ],
    });

    return res.status(200).json(serviceOrder);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      order_number: Yup.string().required(),
      order_date: Yup.date().required(),
      customer_id: Yup.number().required(),
      support_id: Yup.string().required(),
      problem_description: Yup.string().required(),
    });

    req.body.subscriber_id = req.subscriberId;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha nas validações.' });
    }

    const { subscriber_id, order_number } = req.body;

    const serviceOrderExists = await ServiceOrder.findOne({
      where: {
        subscriber_id,
        order_number,
      },
    });

    if (serviceOrderExists) {
      return res.status(400).json({ error: 'Cliente já existe.' });
    }

    const { id } = await ServiceOrder.create(req.body);

    if (!id) {
      return res.status(400).json({ error: 'Cliente não cadastrado.' });
    }

    const serviceOrder = await ServiceOrder.findByPk(id, {
      attributes: ServiceOrder.FIELDS,
    });

    return res.status(200).json(serviceOrder);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      subscriber_id: Yup.number().required(),
      order_number: Yup.string().required(),
      order_date: Yup.date().required(),
      customer_id: Yup.number().required(),
      support_id: Yup.string().required(),
      problem_description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha nas validações.' });
    }

    const { id } = req.body;
    await ServiceOrder.update(req.body, { where: { id } });

    const serviceOrder = await ServiceOrder.findByPk(id, {
      attributes: ServiceOrder.FIELDS,
    });

    return res.status(200).json(serviceOrder);
  }

  async delete(req, res) {
    const operator = await ServiceOrder.findByPk(req.params.id);

    if (!operator) {
      return res.status(401).json({
        error: 'Registro não encontrado.',
      });
    }

    if (!req.superUser && operator.subscriber_id !== req.subscriberId) {
      return res.status(401).json({
        error: 'Você não tem permissão para remover está operadora.',
      });
    }

    await ServiceOrder.destroy({ where: { id: req.params.id } });

    return res.status(200).json({ status: true });
  }
}

export default new ServiceOrderController();
