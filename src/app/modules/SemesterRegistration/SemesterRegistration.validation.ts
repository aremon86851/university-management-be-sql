import { z } from 'zod';

const createSemesterRegistrationZodValidation = z.object({
  body: z.object({
    startDate: z.string({ required_error: 'Start date must be a valid date.' }),
    endDate: z.string({ required_error: 'End date must be a valid date.' }),
    academicSemesterId: z.string({
      required_error: 'Academic Semester id is required.',
    }),
  }),
});
export const SemesterRegistrationZodValidation = {
  createSemesterRegistrationZodValidation,
};
