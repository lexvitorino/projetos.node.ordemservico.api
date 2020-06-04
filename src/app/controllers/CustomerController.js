import * as Yup from 'yup';
import Customer from '../models/Customer';

class CustomerController {
  async index(req, res) {
    // const { page = 1 } = req.query;
    const customers = await Customer.findAll({
      where: {
        subscriber_id: req.subscriberId,
      },
      attributes: [
        'id',
        'name',
        'document',
        'inscription',
        'email',
        'telephone',
        'zip_code',
        'street',
        'number',
        'neighborhood',
        'city',
        'state',
      ],
      // limit: 20,
      // offset: (page - 1) * 20,
    });

    return res.status(200).json(customers);
  }

  async getById(req, res) {
    const customer = await Customer.findByPk(req.params.id, {
      attributes: [
        'id',
        'name',
        'document',
        'inscription',
        'email',
        'telephone',
        'zip_code',
        'street',
        'number',
        'neighborhood',
        'city',
        'state',
      ],
    });

    return res.status(200).json(customer);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      subscriber_id: Yup.number().required(),
      name: Yup.string().required(),
    });

    req.body.subscriber_id = req.subscriberId;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha nas validações.' });
    }

    const { subscriber_id, name } = req.body;

    const customerExists = await Customer.findOne({
      where: {
        subscriber_id,
        name,
      },
    });

    if (customerExists) {
      return res.status(400).json({ error: 'Cliente já existe.' });
    }

    const { id } = await Customer.create(req.body);

    if (!id) {
      return res.status(400).json({ error: 'Cliente não cadastrado.' });
    }

    const customer = await Customer.findByPk(id, {
      attributes: [
        'id',
        'name',
        'document',
        'inscription',
        'email',
        'telephone',
        'zip_code',
        'street',
        'number',
        'neighborhood',
        'city',
        'state',
      ],
    });

    return res.status(200).json(customer);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha nas validações.' });
    }

    const { id, subscriber_id, email } = req.body;

    let customer = await Customer.findByPk(id);
    if (email !== customer.email) {
      const customerExists = await Customer.findOne({
        where: { subscriber_id, email },
      });
      if (customerExists) {
        return res.status(400).json({ error: 'Cliente já existe' });
      }
    }

    await Customer.update(req.body, { where: { id } });

    customer = await Customer.findByPk(id, {
      attributes: [
        'id',
        'name',
        'document',
        'inscription',
        'email',
        'telephone',
        'zip_code',
        'street',
        'number',
        'neighborhood',
        'city',
        'state',
      ],
    });

    return res.status(200).json(customer);
  }

  async delete(req, res) {
    const operator = await Customer.findByPk(req.params.id);

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

    await Customer.destroy({ where: { id: req.params.id } });

    return res.status(200).json({ status: true });
  }
}

export default new CustomerController();
