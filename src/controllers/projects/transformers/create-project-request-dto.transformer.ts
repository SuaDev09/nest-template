import { BadRequestException } from '@nestjs/common';
import CreateProjectDTO from '../dto/create-project.dto';
import UploadFileDTO from '../dto/upload-file.dto';

/**
 * Transforms a raw DTO object into a structured `CreateProjectDTO` object.
 * This function ensures proper type conversion and validation for specific fields.
 *
 * @param dto - The raw data transfer object containing project request details.
 *
 * @returns A structured `CreateProjectDTO` object with validated and transformed fields.
 *
 * @throws {BadRequestException} Throws an exception if the input format is invalid or parsing fails.
 *
 * ### Transformation Details:
 * - `Project_Name`: Directly mapped from the input DTO.
 * - `Area_Id`: Parsed as an integer from the input DTO.
 * - `Baseline`: Directly mapped from the input DTO.
 * - `Objectives`: Ensures the field is an array. If not, attempts to parse it as JSON.
 * - `Problem_Statement`: Directly mapped from the input DTO.
 * - `Scope`: Directly mapped from the input DTO.
 * - `Out_Of_Scope`: Directly mapped from the input DTO.
 * - `Impact`: Directly mapped from the input DTO.
 * - `Stakeholders`: Ensures the field is an array. If not, attempts to parse it as JSON.
 * - `Client_Id`: Parsed as an integer from the input DTO.
 * - `Request_Date`: Directly mapped from the input DTO.
 * - `File_Current_Process`: Directly mapped from the input DTO.
 * - `Phase_Id`: Directly mapped from the input DTO.
 *
 * ### Error Handling:
 * Logs the error details to the console and throws a `BadRequestException`
 * with a descriptive message if any transformation or parsing fails.
 */
const CreateProjectRequestDTOTransformer = (
  dto: any,
  file: UploadFileDTO,
): CreateProjectDTO => {
  try {
    return {
      Project_Name: dto.Project_Name,
      Role_Id: dto.Role_Id,
      User_Id: parseInt(dto.User_Id, 10),
      Area_Id: parseInt(dto.Area_Id, 10),
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
      Request_Date: dto.Request_Date,
      File_Current_Process: file.filename,
      Phase_Id: dto.Phase_Id,
    };
  } catch (error) {
    console.error('Error transforming CreateProjectRequestDto:', error);
    throw new BadRequestException(
      'Invalid input format for CreateProjectRequestDto.',
    );
  }
};

export default CreateProjectRequestDTOTransformer;
