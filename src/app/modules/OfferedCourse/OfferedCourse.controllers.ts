import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { OfferedCourseService } from './OfferedCourse.services';

const createOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  const result = await OfferedCourseService.createOfferedCourse(body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester created successfully',
    data: result,
  });
});

const getAllSemesters = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['searchTerm', 'title', 'year']);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await OfferedCourseService.getAllSemesters(
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

const getASingleOfferedCourse = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await OfferedCourseService.getASingleOfferedCourse(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Semester get successfully',
      data: result,
    });
  }
);

const deleteOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OfferedCourseService.deleteOfferedCourse(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester deleted',
    data: result,
  });
});

const OfferedCourseClassSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const data = req.body;
    const result = await OfferedCourseService.createOfferedCourseClassSchedule(
      data
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered course created successfully',
      data: result,
    });
  }
);

export const OfferedCourseController = {
  createOfferedCourse,
  getAllSemesters,
  getASingleOfferedCourse,
  deleteOfferedCourse,
  OfferedCourseClassSchedule,
};
