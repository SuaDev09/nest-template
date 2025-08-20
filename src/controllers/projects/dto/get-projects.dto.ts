export default class GetProjectsDTO {
  Project_Id: number;
  Project_Name: number;
  Project_Creation_Date: Date;
  Client_Id: number;
  Client_Name: string;
  Project_Deleted: boolean;
  Area_Id: number;
  Area: string;
  Phase_Id: number;
  Phase_Creation_Date: Date;
  Review_History_Id: number;
  Status_Id: number;
  Status_Label: string;
  Action_Id: number;
  Action: string;
  Review_Date: Date;
  Reason_For_Rejection: string;
  Reviewed_By: number;
}
