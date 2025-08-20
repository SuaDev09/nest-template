const ProjectRequestSP = {
  SP_CREATE_NEW_PROJECT: 'uspPR_Create_New_Project',
  /**
   * Used to update an existing project in the database.
   * @param {number} Phase_Id. The ID of the project phase to update.
   * @param {number} Project_Id
   * @param {string} Project_Name
   * @param {string} Baseline
   * @param {string} Problem_Statement
   * @param {string} Scope
   * @param {string} Out_Of_Scope
   * @param {string} Impact
   * @param {string} File_Path
   */
  SP_UPDATE_PROJECT: 'uspPR_Update_Project',
  SP_ASSIGN_PHASE_STAKEHOLDERS: 'uspPR_Assign_Phase_Stakeholders',
  SP_ASSIGN_PHASE_OBJECTIVE: 'uspPR_Assign_Phase_Objective',
  SP_GET_PROJECTS: 'uspPR_Get_Projects',
  SP_ASSIGN_PHASE_MEMBERS: 'uspPR_Assign_Phase_Members',
  SP_GET_PROJECT_STATUS: 'uspPR_Get_Project_Status',
  SP_ASSIGN_PHASE_PRIORITY: 'uspPR_Assign_Priority',
  SP_ADD_NEW_STATUS: 'uspPR_Add_New_Status',
  SP_GET_PROJECT_BY_ID: 'uspPR_Get_Project_By_Id',
  SP_DELETE_PHASE_MEMBERS: 'uspPR_Delete_Phase_Members',
  SP_CREATE_GANTT: 'uspPR_Create_Gantt',
  SP_INSERT_GANTT_ACTIVITIES: 'uspPR_Insert_Gantt_Activities',
  SP_GET_GANTT_BY_PHASE: 'uspPR_Get_Gantt_By_Phase',
  /**
   * This stored procedure is used to remove all stakeholders linked to a given project phase.
   * @param {number} Phase_Id - The ID of the project phase for which stakeholders should be deleted.
   */
  SP_DELETE_STAKEHOLDERS_BY_PHASE_ID: 'uspPR_Delete_Stakeholders_By_Phase_Id',
  /**
   * This stored procedure is used to remove all objectives linked to a given project phase.
   * @param {number} Phase_Id - The ID of the project phase for which objectives should be deleted.
   */
  SP_DELETE_OBJECTIVES_BY_PHASE_ID: 'uspPR_Delete_Objectives_By_Phase_Id',
};

export default ProjectRequestSP;
