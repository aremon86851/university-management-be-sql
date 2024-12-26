import { z } from 'zod';

const createCourseZodValidation = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
  }),
});
const assignCourseFacultyZodValidation = z.object({
  body: z.object({
    faculties: z.array(z.string(), { required_error: 'Faculties is required' }),
  }),
});

export const CourseZodValidation = {
  createCourseZodValidation,
  assignCourseFacultyZodValidation,
};
