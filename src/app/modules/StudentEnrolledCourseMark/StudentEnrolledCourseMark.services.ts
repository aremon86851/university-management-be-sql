import { ExamType, Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import prisma from '../../../constants/prisma-client';

const createStudentEnrolledCourseDefaultMark = async (
  transaction: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >,
  payload: {
    studentId: string;
    studentEnrolledCourseId: string;
    academicSemesterId: string;
  }
) => {
  const isExistsMidterm = await prisma.studentEnrolledCourseMark.findFirst({
    where: {
      studentId: payload.studentId,
      studentEnrolledCourseId: payload.studentEnrolledCourseId,
      academicSemesterId: payload.academicSemesterId,
      examType: ExamType.MIDTERM,
    },
  });
  if (!isExistsMidterm) {
    const midtermData = {
      studentId: payload.studentId,
      studentEnrolledCourseId: payload.studentEnrolledCourseId,
      academicSemesterId: payload.academicSemesterId,
      examType: ExamType.MIDTERM,
    };
    await prisma.studentEnrolledCourseMark.create({
      data: midtermData,
    });
  }
  const isExistsFinal = await prisma.studentEnrolledCourseMark.findFirst({
    where: {
      studentId: payload.studentId,
      studentEnrolledCourseId: payload.studentEnrolledCourseId,
      academicSemesterId: payload.academicSemesterId,
      examType: ExamType.FINAL,
    },
  });
  if (!isExistsMidterm) {
    const finalData = {
      studentId: payload.studentId,
      studentEnrolledCourseId: payload.studentEnrolledCourseId,
      academicSemesterId: payload.academicSemesterId,
      examType: ExamType.FINAL,
    };
    await prisma.studentEnrolledCourseMark.create({
      data: finalData,
    });
  }

  console.log('hh');
};

export const StudentEnrolledCourseMark = {
  createStudentEnrolledCourseDefaultMark,
};
