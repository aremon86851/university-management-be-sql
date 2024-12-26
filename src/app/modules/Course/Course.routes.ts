import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseController } from './Course.controllers';
import { CourseZodValidation } from './Course.validation';

const routes = express.Router();

routes.get('/', CourseController.getAllCourse);
routes.get('/:id', CourseController.getASingleCourse);
routes.post(
  '/create-course',
  validateRequest(CourseZodValidation.createCourseZodValidation),
  CourseController.createCourse
);
routes.post(
  '/:id/assign-faculty',
  validateRequest(CourseZodValidation.assignCourseFacultyZodValidation),
  CourseController.assignFacultyToCourse
);
routes.delete('/:id/remove-faculty', CourseController.deleteFacultyFromCourse);

routes.delete('/:id', CourseController.deleteCourse);

export const CourseRoutes = routes;
