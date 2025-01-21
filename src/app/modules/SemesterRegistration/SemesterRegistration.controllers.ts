import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { SemesterRegistrationService } from './SemesterRegistration.services';

const createSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const body = req.body;
    const result = await SemesterRegistrationService.createSemesterRegistration(
      body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Semester created successfully',
      data: result,
    });
  }
);

const getAllSemesters = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['searchTerm', 'title', 'year']);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await SemesterRegistrationService.getAllSemesters(
    filter,
    paginationOptions
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Semesters get successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getASingleSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await SemesterRegistrationService.getASingleSemesterRegistration(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Semester get successfully',
      data: result,
    });
  }
);

const deleteSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SemesterRegistrationService.deleteSemesterRegistration(
      id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Semester deleted',
      data: result,
    });
  }
);

const createStudentSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result =
      await SemesterRegistrationService.createStudentSemesterRegistration(user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student semester registration successfully',
      data: result,
    });
  }
);

const enrollIntoCourse = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  const user = (req as any).user;
  console.log('user', user);
  const result = await SemesterRegistrationService.enrollIntoCourse(body, user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student enrolled successfully',
    data: result,
  });
});
const withdrawIntoCourse = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  const user = (req as any).user;
  console.log('user', user);
  const result = await SemesterRegistrationService.withdrawIntoCourse(
    body,
    user
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student enrolled successfully',
    data: result,
  });
});

const confirmMyRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const user = (req as any).user;
    console.log('user', user);
    const result = await SemesterRegistrationService.confirmMyRegistration(
      user
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Your semester complete successfully',
      data: result,
    });
  }
);

const startNewSemester = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SemesterRegistrationService.startNewSemester(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your semester complete successfully',
    data: result,
  });
});

export const SemesterRegistrationController = {
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
