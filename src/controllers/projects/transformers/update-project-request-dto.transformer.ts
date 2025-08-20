import { BadRequestException } from '@nestjs/common';
import UploadFileDTO from '../dto/upload-file.dto';
import UpdateProjectDTO from '../dto/update-project.dto';

const UpdateProjectRequestDTOTransformer = (
  dto: any,
  file: UploadFileDTO,
): UpdateProjectDTO => {
  try {
    return {
      Project_Name: dto.Project_Name,
      Role_Id: dto.Role_Id,
      User_Id: parseInt(dto.User_Id, 10),
      Area_Id: parseInt(dto.Area_Id, 10),
      Created_By: parseInt(dto.Created_By, 10),
      Project_Id: parseInt(dto.Project_Id, 10),
      Status_Id: parseInt(dto.Status_Id, 10),
      Review_History_Id: parseInt(dto.Review_History_Id, 10),
      Phase_Id: parseInt(dto.Phase_Id, 10),
      Baseline: dto.Baseline,
      Objectives: Array.isArray(dto.Objectives)
        ? dto.Objectives
        : JSON.parse(dto.Objectives),
      Problem_Statement: dto.Problem_Statement,
      Scope: dto.Scope,
      Out_Of_Scope: dto.Out_Of_Scope,
      Impact: dto.Impact,
      Stakeholders: Array.isArray(dto.Stakeholders)
        ? dto.Stakeholders
        : JSON.parse(dto.Stakeholders),
      File_Current_Process: file.filename,
    };
  } catch (error) {
    console.error('Error transforming UpdateProjectRequestDto:', error);
    throw new BadRequestException(
      'Invalid input format for UpdateProjectRequestDto.',
    );
  }
};

export default UpdateProjectRequestDTOTransformer;
