import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationController } from './SemesterRegistration.controllers';
import { SemesterRegistrationZodValidation } from './SemesterRegistration.validation';

const routes = express.Router();

routes.post(
  '/enroll-into-course',
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.enrollIntoCourse
);
routes.delete(
  '/withdraw-from-course',
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.withdrawIntoCourse
);

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

routes.post(
  '/student-semester-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.createStudentSemesterRegistration
);
routes.post(
  '/confirm-my-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.confirmMyRegistration
);

routes.post(
  '/:id/start-new-semester',
  SemesterRegistrationController.startNewSemester
);

routes.delete(
  '/:id',
  SemesterRegistrationController.deleteSemesterRegistration
);
export const SemesterRegistrationRoutes = routes;
