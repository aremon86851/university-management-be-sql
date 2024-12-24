import { Building, Prisma } from '@prisma/client';
import prisma from '../../../constants/prisma-client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { BuildingFilteredFields } from './Building.constant';
import { IFilterOptions } from './Building.interface';

const createBuilding = async (payload: Building) => {
  const createSemester = await prisma.building.create({
    data: payload,
  });
  return createSemester;
};

const getAllBuilding = async (
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
      OR: BuildingFilteredFields.map(field => ({
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
  const whereConditions: Prisma.BuildingWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const semesters = await prisma.building.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.building.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: semesters,
  };
};

const getASingleBuilding = async (id: string): Promise<Building | null> => {
  const Building = await prisma.building.findUnique({
    where: { id },
  });
  return Building;
};

const deleteBuilding = async (id: string) => {
  const deleteSemester = await prisma.building.delete({
    where: { id },
  });
  return deleteSemester;
};

export const BuildingService = {
  createBuilding,
  getAllBuilding,
  getASingleBuilding,
  deleteBuilding,
};
