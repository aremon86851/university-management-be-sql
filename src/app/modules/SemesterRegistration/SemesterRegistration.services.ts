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
import { SemesterRegistrationPayment } from '../SemesterRegistrationPayment/SemesterRegistrationPayment.services';
import { StudentEnrolledCourseMark } from '../StudentEnrolledCourseMark/StudentEnrolledCourseMark.services';
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

const createStudentSemesterRegistration = async (userInfo: {
  role: string;
  userId: string;
}) => {
  console.log(userInfo);
  const isExistUser = await prisma.student.findMany({
    where: {
      id: userInfo.userId,
    },
  });
  if (!isExistUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }

  const activeSemesterRegistration =
    await prisma.semesterRegistration.findFirst({
      where: {
        status: {
          in: [
            SemesterRegistrationStatus.UPCOMING,
            SemesterRegistrationStatus.ONGOING,
          ],
        },
      },
    });
  if (!activeSemesterRegistration) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Currently we dont have any upcoming or ongoing semester'
    );
  }

  const result = await prisma.studentSemesterRegistration.create({
    data: {
      studentId: userInfo.userId,
      semesterRegistrationId: activeSemesterRegistration.id,
    },
  });
  return result;
};

const enrollIntoCourse = async (
  payload: any,
  user: any
): Promise<string | null> => {
  const isExistsStudent = await prisma.student.findFirst({
    where: {
      id: user.userId,
    },
    include: {
      academicDepartment: true,
      academicFaculty: true,
      academicSemester: true,
    },
  });

  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
  });

  const isExistsOfferedCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: payload.offeredCourseId,
    },
    include: {
      semesterRegistration: true,
      course: true,
    },
  });

  const isExistsOfferedCourseSection =
    await prisma.offeredCourseSection.findFirst({
      where: {
        id: payload.offeredCourseSectionId,
      },
      include: {
        semesterRegistration: true,
        offeredCourse: true,
      },
    });

  if (!isExistsStudent) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }
  if (!semesterRegistration) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Semester not found');
  }
  if (!isExistsOfferedCourse) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Registered semester not found');
  }

  if (!isExistsOfferedCourseSection) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Offered course section not found'
    );
  }
  if (
    isExistsOfferedCourseSection.maxCapacity &&
    isExistsOfferedCourseSection.currentlyEnrolledStudent &&
    isExistsOfferedCourseSection.maxCapacity <=
      isExistsOfferedCourseSection.currentlyEnrolledStudent
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Seat not available');
  }
  const data = {
    studentId: user.userId,
    semesterRegistrationId: isExistsOfferedCourse.semesterRegistrationId,
    offeredCourseId: payload.offeredCourseId,
    offeredCourseSectionId: payload.offeredCourseSectionId,
  };

  await prisma.$transaction(async transactionClient => {
    await transactionClient.studentSemesterRegistrationCourse.create({
      data,
    });
    await transactionClient.offeredCourseSection.update({
      where: {
        id: payload.offeredCourseSectionId,
      },
      data: {
        currentlyEnrolledStudent: {
          increment: 1,
        },
      },
    });

    await transactionClient.studentSemesterRegistration.updateMany({
      where: {
        student: {
          id: isExistsStudent.id,
        },
        semesterRegistration: {
          id: semesterRegistration.id,
        },
      },
      data: {
        totalCreditTaken: {
          increment: isExistsOfferedCourse.course.credits,
        },
      },
    });
  });

  return 'Successfully enroll into course';
};

const withdrawIntoCourse = async (
  payload: any,
  user: any
): Promise<string | null> => {
  const isExistsStudent = await prisma.student.findFirst({
    where: {
      id: user.userId,
    },
    include: {
      academicDepartment: true,
      academicFaculty: true,
      academicSemester: true,
    },
  });

  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
  });

  const isExistsOfferedCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: payload.offeredCourseId,
    },
    include: {
      semesterRegistration: true,
      course: true,
    },
  });
  if (!isExistsStudent) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }
  if (!semesterRegistration) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Semester not found');
  }
  if (!isExistsOfferedCourse) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Registered semester not found');
  }

  await prisma.$transaction(async transactionClient => {
    await transactionClient.studentSemesterRegistrationCourse.delete({
      where: {
        semesterRegistrationId_studentId_offeredCourseId: {
          semesterRegistrationId: isExistsOfferedCourse.semesterRegistrationId,
          studentId: user.userId,
          offeredCourseId: payload.offeredCourseId,
        },
      },
    });
    await transactionClient.offeredCourseSection.update({
      where: {
        id: payload.offeredCourseSectionId,
      },
      data: {
        currentlyEnrolledStudent: {
          decrement: 1,
        },
      },
    });

    await transactionClient.studentSemesterRegistration.updateMany({
      where: {
        student: {
          id: isExistsStudent.id,
        },
        semesterRegistration: {
          id: semesterRegistration.id,
        },
      },
      data: {
        totalCreditTaken: {
          decrement: isExistsOfferedCourse.course.credits,
        },
      },
    });
  });

  return 'Successfully withdraw from course';
};

const confirmMyRegistration = async (user: {
  role: string;
  id: string;
}): Promise<{ message: string } | null> => {
  const ongoingRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
  });

  if (!ongoingRegistration) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ongoing semester not found');
  }

  const studentSemesterRegistrations =
    await prisma.studentSemesterRegistration.findFirst({
      where: {
        id: user.id,
        semesterRegistration: {
          id: ongoingRegistration.id,
        },
      },
    });

  if (!studentSemesterRegistrations) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Student semester registration not found'
    );
  }

  if (studentSemesterRegistrations.totalCreditTaken === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not enrolled any courses or semester'
    );
  }

  if (
    studentSemesterRegistrations.totalCreditTaken &&
    ongoingRegistration.minCredit &&
    ongoingRegistration.maxCredit &&
    (studentSemesterRegistrations.totalCreditTaken <
      ongoingRegistration.minCredit ||
      studentSemesterRegistrations.totalCreditTaken >
        ongoingRegistration.maxCredit)
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You maximum credit ${ongoingRegistration.maxCredit} and minimum credit ${ongoingRegistration.minCredit}`
    );
  }

  await prisma.studentSemesterRegistration.update({
    where: {
      id: studentSemesterRegistrations.id,
    },
    data: { isConfirmed: true },
  });

  return {
    message: 'Your registration confirmed successfully',
  };
};

const startNewSemester = async (id: string) => {
  const checkSemesterRegistration = await prisma.semesterRegistration.findFirst(
    {
      where: {
        id: id,
      },
      include: {
        academicSemester: true,
      },
    }
  );

  if (!checkSemesterRegistration) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Semester registration not found');
  }
  if (checkSemesterRegistration.status !== SemesterRegistrationStatus.ENDED) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Ongoing or upcoming semester not ended yet'
    );
  }

  // if (checkSemesterRegistration.academicSemester.isCurrent) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Semester is already started');
  // }

  await prisma.$transaction(async prismaTransactionClient => {
    await prismaTransactionClient.academicSemester.updateMany({
      where: {
        isCurrent: true,
      },
      data: {
        isCurrent: false,
      },
    });
    await prismaTransactionClient.academicSemester.update({
      where: {
        id: checkSemesterRegistration.academicSemester.id,
      },
      data: {
        isCurrent: true,
      },
    });
    const confirmedStudent =
      await prismaTransactionClient.studentSemesterRegistration.findMany({
        where: {
          semesterRegistration: {
            id,
          },
          isConfirmed: true,
        },
      });
    console.log(confirmedStudent);
    confirmedStudent.forEach(async element => {
      if (element.totalCreditTaken) {
        const totalPayableAmount = element.totalCreditTaken * 2000;
        await SemesterRegistrationPayment.createSemesterRegistrationPayment(
          prismaTransactionClient,
          {
            studentId: element.studentId,
            academicSemesterId: checkSemesterRegistration.academicSemester.id,
            totalPaymentAmont: totalPayableAmount,
          }
        );
      }

      const semesterRegisteredCourse =
        await prisma.studentSemesterRegistrationCourse.findMany({
          where: {
            semesterRegistration: {
              id,
            },
            student: {
              id: element.studentId,
            },
          },
          include: {
            offeredCourse: true,
          },
        });
      semesterRegisteredCourse.forEach(async semesterCourse => {
        const isExists = await prisma.studentEnrolledCourse.findFirst({
          where: {
            studentId: semesterCourse.studentId,
            courseId: semesterCourse.offeredCourse.courseId,
            academicSemesterId: checkSemesterRegistration.academicSemester.id,
          },
        });

        if (!isExists) {
          const studentEnrolledCourse =
            await prisma.studentEnrolledCourse.create({
              data: {
                studentId: semesterCourse.studentId,
                courseId: semesterCourse.offeredCourse.courseId,
                academicSemesterId:
                  checkSemesterRegistration.academicSemester.id,
              },
            });

          await StudentEnrolledCourseMark.createStudentEnrolledCourseDefaultMark(
            prismaTransactionClient,
            {
              studentId: studentEnrolledCourse.studentId,
              studentEnrolledCourseId: studentEnrolledCourse.id,
              academicSemesterId: studentEnrolledCourse.academicSemesterId,
            }
          );
        }
      });
    });
  });

  return {
    message: 'Semester started successfully',
  };
};

export const SemesterRegistrationService = {
  createSemesterRegistration,
  getAllSemesters,
  getASingleSemesterRegistration,
  deleteSemesterRegistration,
  createStudentSemesterRegistration,
  enrollIntoCourse,
  withdrawIntoCourse,
  confirmMyRegistration,
  startNewSemester,
};
