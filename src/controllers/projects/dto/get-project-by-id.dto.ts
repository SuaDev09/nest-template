export default interface GetProjectByIdDTO {
  Project: {
    Project_Id: number;
    Project_Name: string;
    Creation_Date: Date;
    Phase_Name: string;
    Phase_Creation_Date: Date;
    Phase_Id: number;
    Baseline: string;
    Problem_Statement: string;
    Scope: string;
    Out_Of_Scope: string;
    Area: string;
    Impact: string;
    File_Current_Process: string;
    Reason_For_Rejection: string;
    Client_Name: string;
    Client_Email: string;
    Client_Employee_Id: string;
  };
  Objectives: {
    Objective: string;
  }[];
  Team_Members: {
    Assignation_Date: Date;
    Employee_Id: number;
    Name: string;
  };
  Stakeholders: {
    Area: string;
    Area_Id: number;
    Employee_Id: number;
    User_Id: number;
    Name: string;
    Stakeholder_Type: string;
    Stakeholder_Type_Id: number;
  }[];
}
