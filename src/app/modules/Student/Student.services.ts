import { Student, Prisma } from '@prisma/client';
import prisma from '../../../constants/prisma-client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { StudentFilteredFields } from './Student.constant';
import { IFilterOptions } from './Student.interface';

const createStudent = async (payload: Student) => {
  const createSemester = await prisma.student.create({
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
      OR: StudentFilteredFields.map(field => ({
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
  const whereConditions: Prisma.StudentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const semesters = await prisma.student.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.student.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: semesters,
  };
};

const getASingleStudent = async (id: string): Promise<Student | null> => {
  const Student = await prisma.student.findUnique({
    where: { id },
  });
  return Student;
};

const deleteStudent = async (id: string) => {
  const deleteSemester = await prisma.student.delete({
    where: { id },
  });
  return deleteSemester;
};

export const StudentService = {
  createStudent,
  getAllDepartment,
  getASingleStudent,
  deleteStudent,
};
