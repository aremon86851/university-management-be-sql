import {
  Prisma,
  SemesterRegistration,
  SemesterRegistrationStatus,
} from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../../constants/prisma-client';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { SemesterRegistrationFilteredFields } from './SemesterRegistration.constant';
import { IFilterOptions } from './SemesterRegistration.interface';

const createSemesterRegistration = async (payload: SemesterRegistration) => {
  const isUpcomingOrOngoingSemester =
    await prisma.semesterRegistration.findFirst({
      where: {
        OR: [
          {
            status: SemesterRegistrationStatus.UPCOMING,
          },
          {
            status: SemesterRegistrationStatus.ONGOING,
          },
        ],
      },
    });

  if (
    isUpcomingOrOngoingSemester?.status ===
      SemesterRegistrationStatus.ONGOING ||
    isUpcomingOrOngoingSemester?.status === SemesterRegistrationStatus.UPCOMING
  ) {
    throw new ApiError(
      httpStatus.BAD_GATEWAY,
      `Already semester ${isUpcomingOrOngoingSemester.status}`
    );
  }

  const createSemester = await prisma.semesterRegistration.create({
    data: payload,
  });
  return createSemester;
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
      OR: SemesterRegistrationFilteredFields.map(field => ({
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

  const whereConditions: Prisma.SemesterRegistrationWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const semesters = await prisma.semesterRegistration.findMany({
    where: whereConditions,
    skip,
    take: limit,
  });

  const total = await prisma.semesterRegistration.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: semesters,
  };
};

const getASingleSemesterRegistration = async (
  id: string
): Promise<SemesterRegistration | null> => {
  const SemesterRegistration = await prisma.semesterRegistration.findUnique({
    where: { id },
  });
  return SemesterRegistration;
};

const deleteSemesterRegistration = async (id: string) => {
  const deleteSemester = await prisma.semesterRegistration.delete({
    where: { id },
  });
  return deleteSemester;
};

export const SemesterRegistrationService = {
  createSemesterRegistration,
  getAllSemesters,
  getASingleSemesterRegistration,
  deleteSemesterRegistration,
};
