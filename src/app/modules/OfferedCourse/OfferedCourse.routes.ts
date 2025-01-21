import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseController } from './OfferedCourse.controllers';
import { OfferedCourseZodValidation } from './OfferedCourse.validation';

const routes = express.Router();

routes.get('/', OfferedCourseController.getAllSemesters);
routes.get('/:id', OfferedCourseController.getASingleOfferedCourse);
routes.post(
  '/create-offered-course',
  validateRequest(OfferedCourseZodValidation.createOfferedCourseZodValidation),
  OfferedCourseController.createOfferedCourse
);

routes.post(
  '/create-offered-course-class-schedule',
  OfferedCourseController.OfferedCourseClassSchedule
);

routes.delete('/:id', OfferedCourseController.deleteOfferedCourse);

export const OfferedCourseRoutes = routes;
