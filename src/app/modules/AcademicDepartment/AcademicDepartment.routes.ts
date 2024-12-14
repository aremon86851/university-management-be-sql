import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentController } from './AcademicDepartment.controllers';
import { AcademicDepartmentZodValidation } from './AcademicDepartment.validation';

const routes = express.Router();

routes.get('/', AcademicDepartmentController.getAllDepartment);
routes.get('/:id', AcademicDepartmentController.getASingleAcademicDepartment);
routes.post(
  '/create-department',
  validateRequest(
    AcademicDepartmentZodValidation.createAcademicDepartmentZodValidation
  ),
  AcademicDepartmentController.createAcademicDepartment
);

routes.delete('/:id', AcademicDepartmentController.deleteAcademicDepartment);

export const AcademicDepartmentRoutes = routes;
