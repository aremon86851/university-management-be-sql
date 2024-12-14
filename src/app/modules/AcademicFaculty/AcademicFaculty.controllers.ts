import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { AcademicFacultyService } from './AcademicFaculty.services';

const createAcademicFaculty = catchAsync(
  async (req: Request, res: Response) => {
    const body = req.body;
    const result = await AcademicFacultyService.createAcademicFaculty(body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Faculty created successfully',
      data: result,
    });
  }
);

const getAllFaculty = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['searchTerm', 'title']);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await AcademicFacultyService.getAllFaculty(
    filter,
    paginationOptions
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Faculty get successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getASingleAcademicFaculty = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AcademicFacultyService.getASingleAcademicFaculty(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Faculty get successfully',
      data: result,
    });
  }
);

const deleteAcademicFaculty = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AcademicFacultyService.deleteAcademicFaculty(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Faculty deleted',
      data: result,
    });
  }
);

export const AcademicFacultyController = {
  createAcademicFaculty,
  getAllFaculty,
  getASingleAcademicFaculty,
  deleteAcademicFaculty,
};
