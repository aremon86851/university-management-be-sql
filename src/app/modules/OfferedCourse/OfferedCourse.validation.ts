import { z } from 'zod';

const createOfferedCourseZodValidation = z.object({
  body: z.object({
    courseIds: z.array(z.string({ required_error: 'Course id is required' })),
    academicDepartmentId: z.string({
      required_error: 'Academic department id is required',
    }),
    semesterRegistrationId: z.string({
      required_error: 'Semester registration id is required',
    }),
  }),
});

export const OfferedCourseZodValidation = {
  createOfferedCourseZodValidation,
};
