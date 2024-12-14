import { AcademicDepartment, Prisma } from '@prisma/client';
import prisma from '../../../constants/prisma-client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { AcademicDepartmentFilteredFields } from './AcademicDepartment.constant';
import { IFilterOptions } from './AcademicDepartment.interface';

const createAcademicDepartment = async (payload: AcademicDepartment) => {
  const createSemester = await prisma.academicDepartment.create({
    data: payload,
  });
  return createSemester;
};

const getAllDepartment = async (
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
      OR: AcademicDepartmentFilteredFields.map(field => ({
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
  const whereConditions: Prisma.AcademicDepartmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const semesters = await prisma.academicDepartment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.academicDepartment.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: semesters,
  };
};

const getASingleAcademicDepartment = async (
  id: string
): Promise<AcademicDepartment | null> => {
  const AcademicDepartment = await prisma.academicDepartment.findUnique({
    where: { id },
  });
  return AcademicDepartment;
};

const deleteAcademicDepartment = async (id: string) => {
  const deleteSemester = await prisma.academicDepartment.delete({
    where: { id },
  });
  return deleteSemester;
};

export const AcademicDepartmentService = {
  createAcademicDepartment,
  getAllDepartment,
  getASingleAcademicDepartment,
  deleteAcademicDepartment,
};
