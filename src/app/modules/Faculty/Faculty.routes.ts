import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyController } from './Faculty.controllers';
import { FacultyZodValidation } from './Faculty.validation';

const routes = express.Router();

routes.get('/', FacultyController.getAllSemesters);
routes.get('/:id', FacultyController.getASingleFaculty);
routes.post(
  '/create-faculty',
  validateRequest(FacultyZodValidation.createFacultyZodValidation),
  FacultyController.createFaculty
);

routes.delete('/:id', FacultyController.deleteFaculty);

export const FacultyRoutes = routes;
