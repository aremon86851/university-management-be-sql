import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BuildingController } from './Building.controllers';
import { BuildingZodValidation } from './Building.validation';

const routes = express.Router();

routes.get('/', BuildingController.getAllBuilding);
routes.get('/:id', BuildingController.getASingleBuilding);
routes.post(
  '/create-Building',
  validateRequest(BuildingZodValidation.createBuildingZodValidation),
  BuildingController.createBuilding
);

routes.delete('/:id', BuildingController.deleteBuilding);

export const BuildingRoutes = routes;
