import AssignStakeholdersDTO from './assign-stakeholders.dto';

export default interface UpdateProjectDTO {
  Phase_Id: number;
  Created_By: number;
  Status_Id: number;
  Project_Id: number;
  Review_History_Id: number;
  Area_Id: number;
  Baseline: string;
  File_Current_Process: string;
  Impact: string;
  Objectives: string[];
  Out_Of_Scope: string;
  Problem_Statement: string;
  Project_Name: string;
  Scope: string;
  Stakeholders: AssignStakeholdersDTO[];
  Role_Id: number;
  User_Id: number;
}
