/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { AcademicSemesterRoutes } from '../modules/AcademicSemester/AcademicSemester.routes';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/academic-semester',
    routes: AcademicSemesterRoutes,
  },
];

moduleRoutes.forEach((route: any) => router.use(route.path, route.routes));
export default router;
