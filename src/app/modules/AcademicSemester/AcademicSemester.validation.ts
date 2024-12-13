import { z } from 'zod';

const createAcademicSemesterZodValidation = z.object({
  body: z.object({
    year: z.string({ required_error: 'Year is required' }),
    title: z.string({ required_error: 'Title is required' }),
    code: z.number({ required_error: 'code is required' }),
    startDate: z.string({ required_error: 'Start date is required' }),
    endDate: z.string({ required_error: 'End date is required' }),
  }),
});

export const AcademicSemesterZodValidation = {
  createAcademicSemesterZodValidation,
};
