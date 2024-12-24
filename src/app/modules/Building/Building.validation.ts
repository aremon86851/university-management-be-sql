import { z } from 'zod';

const createBuildingZodValidation = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
  }),
});

export const BuildingZodValidation = {
  createBuildingZodValidation,
};
