import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { RoomController } from './Room.controllers';
import { RoomZodValidation } from './Room.validation';

const routes = express.Router();

routes.get('/', RoomController.getAllRoom);
routes.get('/:id', RoomController.getASingleRoom);
routes.post(
  '/create-room',
  validateRequest(RoomZodValidation.createRoomZodValidation),
  RoomController.createRoom
);

routes.delete('/:id', RoomController.deleteRoom);

export const RoomRoutes = routes;
