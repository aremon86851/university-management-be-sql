import {
  OfferedCourse,
  OfferedCourseClassSchedule,
  Prisma,
} from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../../constants/prisma-client';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { OfferedCourseFilteredFields } from './OfferedCourse.constant';
import { IFilterOptions, IOfferedCourse } from './OfferedCourse.interface';

const createOfferedCourse = async (payload: IOfferedCourse) => {
  const { academicDepartmentId, semesterRegistrationId, courseIds } = payload;
  const result: any = [];
  courseIds.forEach(async courseId => {
    const isExists = await prisma.offeredCourse.findFirst({
      where: {
        academicDepartmentId,
        semesterRegistrationId,
        courseId,
      },
    });
    if (!isExists) {
      const createSemester = await prisma.offeredCourse.create({
        data: {
          academicDepartmentId,
          semesterRegistrationId,
          courseId,
        },
      });
      result.push(createSemester);
    }
  });
  return result;
};

const getAllSemesters = async (
  filter: IFilterOptions,
  paginationOptions: IPaginationOptions
) => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);
  // Filter
  const { searchTerm, ...filterData } = filter;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: OfferedCourseFilteredFields.map(field => ({
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

  const whereConditions: Prisma.OfferedCourseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const semesters = await prisma.offeredCourse.findMany({
    where: whereConditions,
    skip,
    take: limit,
  });

  const total = await prisma.offeredCourse.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: semesters,
  };
};

const getASingleOfferedCourse = async (
  id: string
): Promise<OfferedCourse | null> => {
  const OfferedCourse = await prisma.offeredCourse.findUnique({
    where: { id },
  });
  return OfferedCourse;
};

const deleteOfferedCourse = async (id: string) => {
  const deleteSemester = await prisma.offeredCourse.delete({
    where: { id },
  });
  return deleteSemester;
};

const createOfferedCourseClassSchedule = async (
  payload: OfferedCourseClassSchedule
): Promise<OfferedCourseClassSchedule | null> => {
  const existingClass = await prisma.offeredCourseClassSchedule.findMany({
    where: {
      dayOfWeek: payload.dayOfWeek,
      room: {
        id: payload.roomId,
      },
    },
  });

  const existingFaculty = await prisma.offeredCourseClassSchedule.findFirst({
    where: {
      dayOfWeek: payload.dayOfWeek,
      faculty: {
        id: payload.facultyId,
      },
    },
  });
  if (!existingFaculty) {
    throw new ApiError(httpStatus.CONFLICT, 'Faculty is not availablel');
  }

  const existingSlot = existingClass.map(slot => ({
    startTime: slot.startTime,
    endTime: slot.endTime,
    dayOfWeek: slot.dayOfWeek,
  }));

  const newSlot = {
    startTime: new Date(payload.startTime),
    endTime: new Date(payload.endTime),
    dayOfWeek: payload.dayOfWeek,
  };

  for (const slot of existingSlot) {
    if (slot.startTime < newSlot.endTime && slot.endTime > newSlot.startTime) {
      throw new ApiError(httpStatus.CONFLICT, 'Slot already exists');
    }
  }
  const result = await prisma.offeredCourseClassSchedule.create({
    data: payload,
  });
  return result;
};

export const OfferedCourseService = {
  createOfferedCourse,
  getAllSemesters,
  getASingleOfferedCourse,
  deleteOfferedCourse,
  createOfferedCourseClassSchedule,
};
