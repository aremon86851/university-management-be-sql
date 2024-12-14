import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyController } from './AcademicFaculty.controllers';
import { AcademicFacultyZodValidation } from './AcademicFaculty.validation';

const routes = express.Router();

routes.get('/', AcademicFacultyController.getAllFaculty);
routes.get('/:id', AcademicFacultyController.getASingleAcademicFaculty);
routes.post(
  '/create-faculty',
  validateRequest(
    AcademicFacultyZodValidation.createAcademicFacultyZodValidation
  ),
  AcademicFacultyController.createAcademicFaculty
);

routes.delete('/:id', AcademicFacultyController.deleteAcademicFaculty);

export const AcademicFacultyRoutes = routes;
