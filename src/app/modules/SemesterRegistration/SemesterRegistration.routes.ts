import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationController } from './SemesterRegistration.controllers';
import { SemesterRegistrationZodValidation } from './SemesterRegistration.validation';

const routes = express.Router();

routes.get('/', SemesterRegistrationController.getAllSemesters);
routes.get(
  '/:id',
  SemesterRegistrationController.getASingleSemesterRegistration
);
routes.post(
  '/create-semester',
  validateRequest(
    SemesterRegistrationZodValidation.createSemesterRegistrationZodValidation
  ),
  SemesterRegistrationController.createSemesterRegistration
);

routes.delete(
  '/:id',
  SemesterRegistrationController.deleteSemesterRegistration
);

export const SemesterRegistrationRoutes = routes;
