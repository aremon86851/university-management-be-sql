import { Room, Prisma } from '@prisma/client';
import prisma from '../../../constants/prisma-client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { RoomFilteredFields } from './Room.constant';
import { IFilterOptions } from './Room.interface';

const createRoom = async (payload: Room) => {
  const createSemester = await prisma.room.create({
    data: payload,
  });
  return createSemester;
};

const getAllRoom = async (
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
      OR: RoomFilteredFields.map(field => ({
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
  const whereConditions: Prisma.RoomWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const semesters = await prisma.room.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.room.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: semesters,
  };
};

const getASingleRoom = async (id: string): Promise<Room | null> => {
  const Room = await prisma.room.findUnique({
    where: { id },
  });
  return Room;
};

const deleteRoom = async (id: string) => {
  const deleteSemester = await prisma.room.delete({
    where: { id },
  });
  return deleteSemester;
};

export const RoomService = {
  createRoom,
  getAllRoom,
  getASingleRoom,
  deleteRoom,
};
