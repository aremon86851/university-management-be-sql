import express from 'express';
import { SemesterRegistrationController } from './SemesterRegistration.controllers';

const routes = express.Router();

routes.get('/', SemesterRegistrationController.getAllSemesters);
routes.get(
  '/:id',
  SemesterRegistrationController.getASingleSemesterRegistration
);
routes.post(
  '/create-semester',
  // validateRequest(
  //   SemesterRegistrationZodValidation.createSemesterRegistrationZodValidation
  // ),
  SemesterRegistrationController.createSemesterRegistration
);

routes.delete(
  '/:id',
  SemesterRegistrationController.deleteSemesterRegistration
);

export const SemesterRegistrationRoutes = routes;
