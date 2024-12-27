import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseSectionController } from './OfferedCourseSection.controllers';
import { OfferedCourseSectionZodValidation } from './OfferedCourseSection.validation';

const routes = express.Router();

routes.get('/', OfferedCourseSectionController.getAllSemesters);
routes.get(
  '/:id',
  OfferedCourseSectionController.getASingleOfferedCourseSection
);
routes.post(
  '/create-offered-course-section',
  validateRequest(
    OfferedCourseSectionZodValidation.createOfferedCourseSectionZodValidation
  ),
  OfferedCourseSectionController.createOfferedCourseSection
);

routes.delete(
  '/:id',
  OfferedCourseSectionController.deleteOfferedCourseSection
);

export const OfferedCourseSectionRoutes = routes;
