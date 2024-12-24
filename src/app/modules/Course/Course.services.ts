import { Course, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../../constants/prisma-client';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { CourseFilteredFields } from './Course.constant';
import { ICourses, IFilterOptions } from './Course.interface';

const createCourse = async (payload: ICourses): Promise<Course | undefined> => {
  const { prerequisiteCourses, ...courseData } = payload;

  const newCourse = await prisma.$transaction(async transactionClient => {
    const createCourse = await transactionClient.course.create({
      data: courseData,
    });
    if (prerequisiteCourses.length > 0) {
      for (let i = 0; i < prerequisiteCourses.length; i++) {
        await transactionClient.courseToPrerequisite.create({
          data: {
            courseId: createCourse.id,
            prerequisiteId: prerequisiteCourses[i].courseId,
          },
        });
      }
    }
    return createCourse;
  });

  if (newCourse) {
    const result = await prisma.course.findUnique({
      where: {
        id: newCourse.id,
      },
      include: {
        prerequisite: {
          include: {
            prerequisite: true,
          },
        },
        prerequisiteFor: {
          include: {
            course: true,
          },
        },
      },
    });
    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Course not found');
    }
    return result;
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'Course not created successfully');
  // return newCourse;
};

const getAllCourse = async (
  filter: IFilterOptions,
  paginationOptions: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);
  // Filter
  const { searchTerm, ...filterData } = filter;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: CourseFilteredFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditions: Prisma.CourseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const Courses = await prisma.course.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.course.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: Courses,
  };
};

const getASingleCourse = async (id: string): Promise<Course | null> => {
  const Course = await prisma.course.findUnique({
    where: { id },
  });
  return Course;
};

const deleteCourse = async (id: string) => {
  const deleteCourse = await prisma.course.delete({
    where: { id },
  });
  return deleteCourse;
};

export const CourseService = {
  createCourse,
  getAllCourse,
  getASingleCourse,
  deleteCourse,
};
