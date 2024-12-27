import { OfferedCourseSection, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../../constants/prisma-client';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { OfferedCourseSectionFilteredFields } from './OfferedCourseSection.constant';
import { IFilterOptions } from './OfferedCourseSection.interface';

const createOfferedCourseSection = async (payload: OfferedCourseSection) => {
  const isExists = await prisma.offeredCourse.findUnique({
    where: {
      id: payload.offeredCourseId,
    },
  });
  if (!isExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Course is not found');
  }
  const result = await prisma.offeredCourseSection.create({
    data: payload,
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
      OR: OfferedCourseSectionFilteredFields.map(field => ({
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

  const whereConditions: Prisma.OfferedCourseSectionWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const semesters = await prisma.offeredCourseSection.findMany({
    where: whereConditions,
    skip,
    take: limit,
  });

  const total = await prisma.offeredCourseSection.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: semesters,
  };
};

const getASingleOfferedCourseSection = async (
  id: string
): Promise<OfferedCourseSection | null> => {
  const OfferedCourseSection = await prisma.offeredCourseSection.findUnique({
    where: { id },
  });
  return OfferedCourseSection;
};

const deleteOfferedCourseSection = async (id: string) => {
  const deleteSemester = await prisma.offeredCourseSection.delete({
    where: { id },
  });
  return deleteSemester;
};

export const OfferedCourseSectionService = {
  createOfferedCourseSection,
  getAllSemesters,
  getASingleOfferedCourseSection,
  deleteOfferedCourseSection,
};
