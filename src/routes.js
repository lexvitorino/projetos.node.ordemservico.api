import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import authMiddlewares from './app/middlewares/auth';

import SubscriberController from './app/controllers/SubscriberController';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import CustomerController from './app/controllers/CustomerController';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/', (_, res) =>
  res.send({ status: 'build success', date: new Date() })
);

routes.post('/subscribers', SubscriberController.store);
routes.post('/sessions', SessionController.store);
routes.post('/lock', SessionController.lock);
routes.post('/unlock', SessionController.unlock);

routes.use(authMiddlewares);

routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.getById);
routes.post('/users', UserController.store);
routes.put('/users', UserController.update);
routes.delete('/users/:id', UserController.delete);

routes.get('/subscribers', SubscriberController.index);
routes.get('/subscribers/:id', SubscriberController.getById);
routes.put('/subscribers', SubscriberController.update);
routes.delete('/subscribers/:id', SubscriberController.delete);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/customers', CustomerController.index);
routes.get('/customers/:id', CustomerController.getById);
routes.post('/customers', CustomerController.store);
routes.put('/customers', CustomerController.update);
routes.delete('/customers/:id', CustomerController.delete);

export default routes;
