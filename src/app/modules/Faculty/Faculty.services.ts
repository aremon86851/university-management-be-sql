import { Faculty, Prisma } from '@prisma/client';
import prisma from '../../../constants/prisma-client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { FacultyFilteredFields } from './Faculty.constant';
import { IFilterOptions } from './Faculty.interface';

const createFaculty = async (payload: Faculty) => {
  const createSemester = await prisma.faculty.create({
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
      OR: FacultyFilteredFields.map(field => ({
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

  const whereConditions: Prisma.FacultyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const semesters = await prisma.faculty.findMany({
    where: whereConditions,
    skip,
    take: limit,
  });

  const total = await prisma.faculty.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: semesters,
  };
};

const getASingleFaculty = async (id: string): Promise<Faculty | null> => {
  const Faculty = await prisma.faculty.findUnique({
    where: { id },
  });
  return Faculty;
};

const deleteFaculty = async (id: string) => {
  const deleteSemester = await prisma.faculty.delete({
    where: { id },
  });
  return deleteSemester;
};

export const FacultyService = {
  createFaculty,
  getAllSemesters,
  getASingleFaculty,
  deleteFaculty,
};
