import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { StudentController } from './Student.controllers';
import { StudentZodValidation } from './Student.validation';

const routes = express.Router();

routes.get('/', StudentController.getAllDepartment);
routes.get('/:id', StudentController.getASingleStudent);
routes.post(
  '/create-student',
  validateRequest(StudentZodValidation.createStudentZodValidation),
  StudentController.createStudent
);

routes.delete('/:id', StudentController.deleteStudent);

export const StudentRoutes = routes;
