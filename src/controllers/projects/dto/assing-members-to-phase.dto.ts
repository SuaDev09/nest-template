export default interface AssignMembersToPhaseDTO {
  Phase_Id: number;
  User_Id: number; // The user who is assigning the members
  User_Role_Id: number; // The role of the user who is assigning the members
  Last_Action_Id: number;
  Current_Status_Id: number;
  Members: number[];
}
