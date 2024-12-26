import { z } from 'zod';

const createRoomZodValidation = z.object({
  body: z.object({
    roomNumber: z.string({ required_error: 'Room number is required' }),
    floor: z.string({ required_error: 'Floor is required' }),
    buildingId: z.string({ required_error: 'Building id is required' }),
  }),
});

export const RoomZodValidation = {
  createRoomZodValidation,
};
