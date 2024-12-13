import { AcademicSemester, Prisma, PrismaClient } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { AcademicSemesterFilteredFields } from './AcademicSemester.constant';
import { IFilterOptions } from './AcademicSemester.interface';

const prisma = new PrismaClient();

const createAcademicSemester = async (payload: AcademicSemester) => {
  const createSemester = await prisma.academicSemester.create({
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
      OR: AcademicSemesterFilteredFields.map(field => ({
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

  const whereConditions: Prisma.AcademicSemesterWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const semesters = await prisma.academicSemester.findMany({
    where: whereConditions,
    skip,
    take: limit,
  });

  const total = await prisma.academicSemester.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: semesters,
  };
};

const getASingleAcademicSemester = async (
  id: string
): Promise<AcademicSemester | null> => {
  const academicSemester = await prisma.academicSemester.findUnique({
    where: { id },
  });
  return academicSemester;
};

const deleteAcademicSemester = async (id: string) => {
  const deleteSemester = await prisma.academicSemester.delete({
    where: { id },
  });
  return deleteSemester;
};

export const AcademicSemesterService = {
  createAcademicSemester,
  getAllSemesters,
  getASingleAcademicSemester,
  deleteAcademicSemester,
};
