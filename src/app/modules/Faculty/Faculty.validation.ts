import { z } from 'zod';

const createFacultyZodValidation = z.object({
  body: z.object({
    firstName: z.string({ required_error: 'First name is required' }),
    lastName: z.string({ required_error: 'Last name is required' }),
    middleName: z.string().optional(),
    profileImage: z.string({ required_error: 'Profile image is required' }),
    email: z.string({ required_error: 'Email is required' }),
    contactNo: z.string({ required_error: 'Contact no is required' }),
    gender: z.string({ required_error: 'Gender is required' }),
    bloodGroup: z.string({ required_error: 'Blood groups is required' }),
    designation: z.string({ required_error: 'Designation is required' }),
    academicDepartmentId: z.string({
      required_error: 'Academic department id is required',
    }),
    academicFacultyId: z.string({
      required_error: 'Academic faculty id is required',
    }),
  }),
});

export const FacultyZodValidation = {
  createFacultyZodValidation,
};
