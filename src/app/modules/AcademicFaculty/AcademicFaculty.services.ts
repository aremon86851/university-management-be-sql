import { AcademicFaculty, Prisma } from '@prisma/client';
import prisma from '../../../constants/prisma-client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { AcademicFacultyFilteredFields } from './AcademicFaculty.constant';
import { IFilterOptions } from './AcademicFaculty.interface';

const createAcademicFaculty = async (payload: AcademicFaculty) => {
  const createSemester = await prisma.academicFaculty.create({
    data: payload,
  });
  return createSemester;
};

const getAllFaculty = async (
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
      OR: AcademicFacultyFilteredFields.map(field => ({
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
  const whereConditions: Prisma.AcademicFacultyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const semesters = await prisma.academicFaculty.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.academicFaculty.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: semesters,
  };
};

const getASingleAcademicFaculty = async (
  id: string
): Promise<AcademicFaculty | null> => {
  const AcademicFaculty = await prisma.academicFaculty.findUnique({
    where: { id },
  });
  return AcademicFaculty;
};

const deleteAcademicFaculty = async (id: string) => {
  const deleteSemester = await prisma.academicFaculty.delete({
    where: { id },
  });
  return deleteSemester;
};

export const AcademicFacultyService = {
  createAcademicFaculty,
  getAllFaculty,
  getASingleAcademicFaculty,
  deleteAcademicFaculty,
};
