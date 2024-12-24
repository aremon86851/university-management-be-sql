/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { AcademicDepartmentRoutes } from '../modules/AcademicDepartment/AcademicDepartment.routes';
import { AcademicFacultyRoutes } from '../modules/AcademicFaculty/AcademicFaculty.routes';
import { AcademicSemesterRoutes } from '../modules/AcademicSemester/AcademicSemester.routes';
import { BuildingRoutes } from '../modules/Building/Building.routes';
import { FacultyRoutes } from '../modules/Faculty/Faculty.routes';
import { RoomRoutes } from '../modules/Room/Room.routes';
import { StudentRoutes } from '../modules/Student/Student.routes';
import { CourseRoutes } from '../modules/Course/Course.routes';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/academic-semester',
    routes: AcademicSemesterRoutes,
  },
  {
    path: '/academic-faculty',
    routes: AcademicFacultyRoutes,
  },
  {
    path: '/academic-department',
    routes: AcademicDepartmentRoutes,
  },
  {
    path: '/students',
    routes: StudentRoutes,
  },
  {
    path: '/faculty',
    routes: FacultyRoutes,
  },
  {
    path: '/buildings',
    routes: BuildingRoutes,
  },
  {
    path: '/rooms',
    routes: RoomRoutes,
  },
  {
    path: '/courses',
    routes: CourseRoutes,
  },
];

moduleRoutes.forEach((route: any) => router.use(route.path, route.routes));
export default router;
