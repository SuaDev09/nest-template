// NestJS Core Imports
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
// Third-Party Libraries
import { FileInterceptor } from '@nest-lab/fastify-multer';
import { diskStorage } from 'multer';

// Services
import { UsersService } from '../users/users.service';
import { ProjectsService } from './projects.service';
import { FastifyReply } from 'fastify';
import * as fs from 'fs';
import { createReadStream } from 'fs';
// DTOs
import GetProjectsDTO from './dto/get-projects.dto';
import AssignMembersToPhaseDTO from './dto/assing-members-to-phase.dto';

// Transformers
import CreateProjectRequestDTOTransformer from './transformers/create-project-request-dto.transformer';

// Helpers
import FileHandlerHelper from './helpers/file-handler.helper';

// Utilities
import GeneralLogger from '@/common/loggers/general-logger/general-logger';
import UploadFileDTO from './dto/upload-file.dto';
import { sendSucces, ApiResponse } from '@/common/models/api-response.model';
import GetProjectByIdDTO from './dto/get-project-by-id.dto';
import AssignPriorityDTO from './dto/assign-priority.dto';
import ReviewProjectDTO from './dto/review-project.dto';
import CreateGanttDTO from './dto/gantt/create-gantt.dto';
import UpdateProjectRequestDTOTransformer from './transformers/update-project-request-dto.transformer';
import * as path from 'path';
@Controller('projects')
export class ProjectsController {
  constructor(
    @Inject(UsersService) private readonly _usersService: UsersService,
    private readonly _projectsService: ProjectsService,
  ) {}
  @Get('get-projects')
  @HttpCode(HttpStatus.OK)
  async getProjects(): Promise<ApiResponse<GetProjectsDTO[]>> {
    try {
      const projects = await this._projectsService.getProjects();
      return sendSucces<GetProjectsDTO[]>(
        HttpStatus.OK,
        projects,
        'Projects retrieved successfully.',
      );
    } catch (error) {
      if (!error.message) {
        GeneralLogger('ProjectsController', error, 'ERROR');
      }
      // Include the original error message for debugging (optional)
      throw new BadRequestException(
        error.message || 'Error retrieving projects. Please try again later.',
      );
    }
  }

  @Get('get-project-by-id/:phaseId/:projectId/:reviewHistoryId')
  async getProjectById(
    @Param('phaseId') phaseId: number,
    @Param('projectId') projectId: number,
    @Param('reviewHistoryId') reviewHistoryId: number, // Make it optional
  ) {
    try {
      if (!phaseId || !projectId || !reviewHistoryId) {
        throw new BadRequestException(
          'Phase_Id and Project_Id are required parameters.',
        );
      }

      // Call service to get project by ID
      const project = await this._projectsService.getProjectById(
        phaseId,
        projectId,
        reviewHistoryId || null, // Pass null if reviewHistoryId is not provided
      );

      if (!project) {
        throw new NotFoundException('Project not found.');
      }

      return sendSucces<GetProjectByIdDTO>(
        HttpStatus.OK,
        project,
        'Project retrieved successfully.',
      );
    } catch (error) {
      if (!error.message) {
        GeneralLogger('ProjectsController', error, 'ERROR');
      }

      throw new BadRequestException(
        error.message ||
          'Error retrieving project. Please check the input data.',
      );
    }
  }
  /**
   * Controller method to handle the creation of a new project.
   * This method accepts a file upload and a request body containing project details.
   * It validates the input, processes the file, and creates a new project.
   *
   * @param createProjectRequestDto - The request body containing project details.
   * @param file - The uploaded file containing the current process document.
   * @returns A success response with the file path if the project is created successfully.
   * @throws BadRequestException - If validation fails or an error occurs during processing.
   */
  @Post('create')
  @UseInterceptors(
    FileInterceptor('File_Current_Process', {
      storage: diskStorage({
        destination: FileHandlerHelper.getDestinationPath,
        filename: FileHandlerHelper.generateFileName,
      }),
    }),
  )
  async createNewProject(
    @Body() createProjectRequestDto: any,
    @UploadedFile()
    file: UploadFileDTO,
  ): Promise<ApiResponse<any>> {
    // ): Promise<{ statusCode: number; message: string; fileDetails: any }> {
    try {
      // Validate file existence
      if (!file) {
        throw new BadRequestException('No file uploaded.');
      }
      // Validate required fields in the request DTO
      if (
        !createProjectRequestDto.Project_Name ||
        !createProjectRequestDto.User_Id
      ) {
        throw new BadRequestException(
          'Missing required fields in request DTO.',
        );
      }

      // Transform the request DTO
      const transformedDto = CreateProjectRequestDTOTransformer(
        createProjectRequestDto,
        file,
      );

      // Call the service to create the project
      await this._projectsService.createNewProject(transformedDto);

      // Include file details in the response
      // return HttpStatus.CREATED;
      return sendSucces(
        HttpStatus.CREATED,
        null,
        'Project created successfully.',
      );
    } catch (error) {
      if (!error.message) {
        GeneralLogger('ProjectsController', error, 'ERROR');
      }
      FileHandlerHelper.deleteFileOnError(file);

      throw new BadRequestException(
        error.message ||
          'Error creating Project Request. Please check the input data.',
      );
    }
  }
  @UseInterceptors(
    FileInterceptor('File_Current_Process', {
      storage: diskStorage({
        destination: FileHandlerHelper.getDestinationPath,
        filename: FileHandlerHelper.generateFileName,
      }),
    }),
  )
  @Put('update')
  async updateProject(
    @Body() updateProjectRequestDto: any,
    @UploadedFile()
    file: UploadFileDTO,
  ): Promise<ApiResponse<any>> {
    try {
      if (
        !updateProjectRequestDto.Project_Name ||
        !updateProjectRequestDto.User_Id
      ) {
        throw new BadRequestException(
          'Missing required fields in request DTO.',
        );
      }
      const transformedDto = UpdateProjectRequestDTOTransformer(
        updateProjectRequestDto,
        file,
      );
      await this._projectsService.updateProject(transformedDto);

      return sendSucces(HttpStatus.OK, null, 'Project updated successfully.');
    } catch (error) {
      if (!error.message) {
        GeneralLogger('ProjectsController', error, 'ERROR');
      }

      throw new BadRequestException(
        error.message || 'Error updating project. Please check the input data.',
      );
    }
  }

  @Post('assing-members-to-phase')
  async assignMembersToPhase(
    @Body() assignMembersToPhaseRequestDto: AssignMembersToPhaseDTO,
  ): Promise<ApiResponse<any>> {
    try {
      // Validate required fields
      if (!assignMembersToPhaseRequestDto.Phase_Id) {
        GeneralLogger(
          'ProjectsController ==> Missing Phase_Id in assignMembersToPhase',
          assignMembersToPhaseRequestDto,
          'ERROR',
        );
        throw new BadRequestException('Phase_Id is a required field.');
      }

      // Call service to assign members to phase
      await this._projectsService.assignMembersToPhase(
        assignMembersToPhaseRequestDto,
      );

      return sendSucces(
        HttpStatus.OK,
        null,
        'Members assigned to phase successfully.',
      );
    } catch (error) {
      if (!error.message) {
        GeneralLogger('ProjectsController', error, 'ERROR');
      }

      throw new BadRequestException(
        error.message ||
          'Error assigning members to phase. Please check the input data.',
      );
    }
  }

  // @Get('pdf/:filename')
  // async getPdf(@Param('filename') filename: string) {
  //   try {
  //     // Define the base directory for PDF files (use environment variables or config)
  //     console.log(`Fetching PDF file: ${filename}`); // Debugging log
  //     const baseDir =
  //       process.env.PDF_BASE_PATH || '\\\\mextesteng02\\html\\pr\\';

  //     // Construct the full file path
  //     const filePath = path.join(baseDir, filename);
  //     console.log(`Full file path: ${filePath}`); // Debugging log
  //     const file = createReadStream(filePath);

  //     // Send the file to the client
  //     return new StreamableFile(file);
  //   } catch (error) {
  //     console.error('Error retrieving file:', error);
  //     if (!error.message) {
  //       GeneralLogger('ProjectsController', error, 'ERROR');
  //     }

  //     throw new BadRequestException(
  //       error.message ||
  //         'Error assigning members to phase. Please check the input data.',
  //     );
  //   }
  // }
  @Get('pdf/:filename')
  async getPdf(@Param('filename') filename: string, @Res() res: FastifyReply) {
    try {
      // Define the base directory for PDF files (use environment variables or config)
      const baseDir =
        process.env.PDF_BASE_PATH ||
        '\\\\MEXGXYENGDEV01\\ultron\\nest-project-request-files';

      // Construct the full file path
      const filePath = path.join(baseDir, filename);

      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        throw new BadRequestException(`File ${filename} not found.`);
      }

      // Set headers for the response
      res.header('Content-Type', 'application/pdf');
      res.header('Content-Disposition', `inline; filename=${filename}`);
      res.header('Cache-Control', 'public, max-age=3600');

      // Create a stream of the file and send it as a response
      const fileStream = createReadStream(filePath);
      return res.send(fileStream);
    } catch (error) {
      console.error('Error retrieving file:', error);
      throw new BadRequestException(
        error.message || 'Error retrieving the requested file.',
      );
    }
  }
  @Post('assign-priority')
  async assignPriority(
    @Body() assignPriorityRequestDto: AssignPriorityDTO,
  ): Promise<ApiResponse<any>> {
    try {
      // Validate required fields
      if (!assignPriorityRequestDto.Phase_Id) {
        GeneralLogger(
          'ProjectsController ==> Missing Phase_Id in assignPriority',
          assignPriorityRequestDto,
          'ERROR',
        );
        throw new BadRequestException('Phase_Id is a required field.');
      }

      // Call service to assign priority
      await this._projectsService.assignPriority(assignPriorityRequestDto);

      return sendSucces(HttpStatus.OK, null, 'Priority assigned successfully.');
    } catch (error) {
      if (!error.message) {
        GeneralLogger('ProjectsController', error, 'ERROR');
      }

      throw new BadRequestException(
        error.message ||
          'Error assigning priority. Please check the input data.',
      );
    }
  }

  @Post('review-project')
  async reviewProject(
    @Body() reviewProjectDTO: ReviewProjectDTO,
  ): Promise<ApiResponse<any>> {
    try {
      // Validate required fields
      if (
        !reviewProjectDTO.Phase_Id ||
        !reviewProjectDTO.Last_Action_Id ||
        !reviewProjectDTO.Current_Status_Id ||
        !reviewProjectDTO.User_Id ||
        !reviewProjectDTO.Role_Id ||
        !reviewProjectDTO.Condition ||
        !reviewProjectDTO.Comments
      ) {
        GeneralLogger(
          'ProjectsController ==> Missing required fields in reviewProject',
          reviewProjectDTO,
          'ERROR',
        );
        throw new BadRequestException(
          'Missing required fields in request DTO.',
        );
      }
      // Call service to review project
      await this._projectsService.reviewProject(reviewProjectDTO);

      return sendSucces(HttpStatus.OK, null, 'Project reviewed successfully.');
    } catch (error) {
      if (!error.message) {
        GeneralLogger('ProjectsController', error, 'ERROR');
      }

      throw new BadRequestException(
        error.message ||
          'Error reviewing project. Please check the input data.',
      );
    }
  }

  @Post('create-project-gantt')
  async createGanttChart(
    @Body() createGanttDTO: CreateGanttDTO,
  ): Promise<ApiResponse<any>> {
    try {
      await this._projectsService.createGanttChart(createGanttDTO);
      return sendSucces(
        HttpStatus.CREATED,
        null,
        'Gantt chart created successfully.',
      );
    } catch (error) {
      if (!error.message) {
        GeneralLogger('ProjectsController', error, 'ERROR');
      }
      throw new BadRequestException(
        error.message ||
          'Error creating Gantt chart. Please check the input data.',
      );
    }
  }

  @Get('get-gantt/:phaseId/:projectId/:reviewHistoryId')
  async getGantt(
    @Param('phaseId') phaseId: number,
    @Param('projectId') projectId: number,
    @Param('reviewHistoryId') reviewHistoryId: number,
  ) {
    try {
      if (!phaseId || !projectId || !reviewHistoryId) {
        throw new BadRequestException(
          'Phase_Id, Project_Id, and ReviewHistory_Id are required parameters.',
        );
      }

      // Call service to get Gantt chart
      const ganttData = await this._projectsService.getGantt(
        phaseId,
        projectId,
        reviewHistoryId,
      );

      if (!ganttData) {
        throw new NotFoundException('Gantt data not found.');
      }

      return sendSucces<any>(
        HttpStatus.OK,
        ganttData,
        'Gantt chart retrieved successfully.',
      );
    } catch (error) {
      if (!error.message) {
        GeneralLogger('ProjectsController', error, 'ERROR');
      }

      throw new BadRequestException(
        error.message ||
          'Error retrieving Gantt chart. Please check the input data.',
      );
    }
  }
}
