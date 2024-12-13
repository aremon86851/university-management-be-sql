import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterController } from './AcademicSemester.controllers';
import { AcademicSemesterZodValidation } from './AcademicSemester.validation';

const routes = express.Router();

routes.get('/', AcademicSemesterController.getAllSemesters);
routes.get('/:id', AcademicSemesterController.getASingleAcademicSemester);
routes.post(
  '/create-semester',
  validateRequest(
    AcademicSemesterZodValidation.createAcademicSemesterZodValidation
  ),
  AcademicSemesterController.createAcademicSemester
);

routes.delete('/:id', AcademicSemesterController.deleteAcademicSemester);

export const AcademicSemesterRoutes = routes;
