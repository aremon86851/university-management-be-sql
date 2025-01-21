import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import prisma from '../../../constants/prisma-client';

const createSemesterRegistrationPayment = async (
  transaction: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >,
  payload: {
    studentId: string;
    academicSemesterId: string;
    totalPaymentAmont: number;
  }
) => {
  const isExists = await prisma.studentSemesterPayment.findFirst({
    where: {
      studentId: payload.studentId,
      academicSemester: {
        id: payload.academicSemesterId,
      },
    },
  });
  if (!isExists) {
    const data = {
      studentId: payload.studentId,
      academicSemesterId: payload.academicSemesterId,
      totalDueAmount: payload.totalPaymentAmont,
      totalPaidAmount: 0,
    };
    await prisma.studentSemesterPayment.create({
      data,
    });
  }
};

export const SemesterRegistrationPayment = {
  createSemesterRegistrationPayment,
};
