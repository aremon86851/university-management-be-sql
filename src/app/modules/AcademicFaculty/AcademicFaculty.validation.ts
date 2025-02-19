import { z } from 'zod';

const createAcademicFacultyZodValidation = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
  }),
});

export const AcademicFacultyZodValidation = {
  createAcademicFacultyZodValidation,
};
