import { Multer } from 'multer';
import AssignStakeholdersDTO from './assign-stakeholders.dto';
import { IsNotEmpty } from 'class-validator';

export default class CreateProjectDTO {
  Project_Name: string;
  User_Id: number;
  Role_Id: number;
  Area_Id: number;
  Request_Date: Date;
  Baseline: string;
  Objectives: string[];
  Problem_Statement: string;
  Scope: string;
  Out_Of_Scope: string;
  Impact: string;
  Stakeholders: AssignStakeholdersDTO[];
  File_Current_Process: Multer.File;
  Phase_Id: string;
}
