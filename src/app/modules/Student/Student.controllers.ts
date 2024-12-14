import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { StudentService } from './Student.services';

const createStudent = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  const result = await StudentService.createStudent(body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department created successfully',
    data: result,
  });
});

const getAllDepartment = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['searchTerm', 'title']);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await StudentService.getAllDepartment(
    filter,
    paginationOptions
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Department get successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getASingleStudent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StudentService.getASingleStudent(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department get successfully',
    data: result,
  });
});

const deleteStudent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StudentService.deleteStudent(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department deleted',
    data: result,
  });
});

export const StudentController = {
  createStudent,
  getAllDepartment,
  getASingleStudent,
  deleteStudent,
};
