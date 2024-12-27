import { z } from 'zod';

const createOfferedCourseSectionZodValidation = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    maxCapacity: z.number({ required_error: 'Max capacity is required' }),
    currentlyEnrolledStudent: z.number().optional(),
    offeredCourseId: z.string({
      required_error: 'Offered course id is required',
    }),
    semesterRegistrationId: z.string({
      required_error: 'Semester Registration id is required',
    }),
  }),
});

export const OfferedCourseSectionZodValidation = {
  createOfferedCourseSectionZodValidation,
};
