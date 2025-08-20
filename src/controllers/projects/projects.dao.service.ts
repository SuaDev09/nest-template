import { DAOExecutor } from '@/config/mssql/executor.dao.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { POOL_NAMES } from '@/common/constants/pool-names.constants';
import ProjectRequestSP from './utils/projects.sp';
import GeneralLogger from '@/common/loggers/general-logger/general-logger';
import CreateProjectDTO from './dto/create-project.dto';
import AssignStakeholdersDTO from './dto/assign-stakeholders.dto';
import GetProjectsDTO from './dto/get-projects.dto';
import GetProjectByIdDTO from './dto/get-project-by-id.dto';
import GetProjectByIdTransformer from './transformers/get-project-by-id.transformer';
import UpdateProjectDTO from './dto/update-project.dto';

@Injectable()
export class ProjectsDaoService {
  constructor(
    @Inject(DAOExecutor)
    private readonly _daoExecutor: DAOExecutor,
  ) {}
  getProjects = async (): Promise<GetProjectsDTO[]> => {
    try {
      const result = await this._daoExecutor._executeStoredProcedure(
        POOL_NAMES.PROJECT_REQUEST,
        ProjectRequestSP.SP_GET_PROJECTS,
        {},
      );
      return result.recordset;
    } catch (error) {
      GeneralLogger('ProjectDAOService ==> Getting Projects', error, 'ERROR');
      throw new BadRequestException(
        `Error while fetching projects from the database.`,
      );
    }
  };

  getProjectById = async (
    phaseId: number,
    projectId: number,
    reviewHistoryId: number,
  ): Promise<GetProjectByIdDTO> => {
    try {
      const result = await this._daoExecutor._executeStoredProcedure(
        POOL_NAMES.PROJECT_REQUEST,
        ProjectRequestSP.SP_GET_PROJECT_BY_ID,
        {
          phaseId,
          projectId,
          reviewHistoryId,
        },
      );

      return GetProjectByIdTransformer(result.recordsets);
    } catch (error) {
      GeneralLogger(
        'ProjectsDaoService ==> Getting Project by ID',
        error,
        'ERROR',
      );
      throw new BadRequestException(
        `Error while fetching project by ID from the database.`,
      );
    }
  };

  createProject = async (
    CreateProjectDTO: CreateProjectDTO,
    filePath: string,
  ): Promise<number> => {
    try {
      const result = await this._daoExecutor._executeStoredProcedure(
        POOL_NAMES.PROJECT_REQUEST,
        ProjectRequestSP.SP_CREATE_NEW_PROJECT,
        {
          Project_Name: CreateProjectDTO.Project_Name,
          Client_Id: CreateProjectDTO.User_Id,
          Area_Id: CreateProjectDTO.Area_Id,
          Baseline: CreateProjectDTO.Baseline,
          Problem_Statement: CreateProjectDTO.Problem_Statement,
          Scope: CreateProjectDTO.Scope,
          Out_Of_Scope: CreateProjectDTO.Out_Of_Scope,
          Impact: CreateProjectDTO.Impact,
          // File_Path: filePath,
          File_Path: CreateProjectDTO.File_Current_Process,
        },
      );
      return result.recordset[0].Phase_Id;
    } catch (error) {
      GeneralLogger('ProjectsDaoService ==> Creating Project', error, 'ERROR');
      throw new BadRequestException(
        `Error while creating project in the database.`,
      );
    }
  };

  updateProject = async (updateProjectDTO: UpdateProjectDTO): Promise<void> => {
    try {
      await this._daoExecutor._executeStoredProcedure(
        POOL_NAMES.PROJECT_REQUEST,
        ProjectRequestSP.SP_UPDATE_PROJECT,
        {
          Phase_Id: updateProjectDTO.Phase_Id,
          Project_Id: updateProjectDTO.Project_Id,
          Project_Name: updateProjectDTO.Project_Name,
          Baseline: updateProjectDTO.Baseline,
          Problem_Statement: updateProjectDTO.Problem_Statement,
          Scope: updateProjectDTO.Scope,
          Out_Of_Scope: updateProjectDTO.Out_Of_Scope,
          Impact: updateProjectDTO.Impact,
          File_Path: updateProjectDTO.File_Current_Process,
        },
      );
    } catch (error) {
      GeneralLogger('ProjectsDaoService ==> Updating Project', error, 'ERROR');
      throw new BadRequestException(
        `Error while updating project in the database.`,
      );
    }
  };

  insertStakeholders = async (
    phaseId: number,
    stakeholders: AssignStakeholdersDTO[],
  ) => {
    try {
      if (stakeholders.length === 0) return;
      const inputList = stakeholders.map((stakeholder) => ({
        ...stakeholder,
        Phase_Id: phaseId,
      }));
      if (inputList.length > 0) {
        await this._daoExecutor._executeTransaction(
          POOL_NAMES.PROJECT_REQUEST,
          ProjectRequestSP.SP_ASSIGN_PHASE_STAKEHOLDERS,
          inputList,
        );
      }
    } catch (error) {
      GeneralLogger(
        'ProjectsDaoService ==> Inserting Stakeholders',
        error,
        'ERROR',
      );
      throw new BadRequestException(
        `Error while inserting stakeholders to the phase in the database.`,
      );
    }
  };

  assignMembersToPhase = async (phaseId: number, members: number[]) => {
    try {
      if (members.length === 0) return;
      const inputList = members.map((member) => ({
        User_Id: member,
        Phase_Id: phaseId,
      }));
      await this._daoExecutor._executeStoredProcedure(
        POOL_NAMES.PROJECT_REQUEST,
        ProjectRequestSP.SP_DELETE_PHASE_MEMBERS,
        { Phase_Id: phaseId },
      );
      if (inputList.length > 0) {
        await this._daoExecutor._executeTransaction(
          POOL_NAMES.PROJECT_REQUEST,
          ProjectRequestSP.SP_ASSIGN_PHASE_MEMBERS,
          inputList,
        );
      }
    } catch (error) {
      GeneralLogger(
        'ProjectsDaoService ==> Assigning Members to Phase',
        error,
        'ERROR',
      );
      throw new BadRequestException(
        `Error while assigning members to the phase in the database.`,
      );
    }
  };

  assignPriority = async (phaseId: number, priorityId: number) => {
    try {
      await this._daoExecutor._executeStoredProcedure(
        POOL_NAMES.PROJECT_REQUEST,
        ProjectRequestSP.SP_ASSIGN_PHASE_PRIORITY,
        {
          Phase_Id: phaseId,
          Priority_Id: priorityId,
        },
      );
    } catch (error) {
      GeneralLogger(
        'ProjectsDaoService ==> Assigning Priority to Phase',
        error,
        'ERROR',
      );
      throw new BadRequestException(
        `Error while assigning priority to the phase in the database.`,
      );
    }
  };

  getCurrentPhaseStatus = async (phaseId: number) => {
    try {
      const result = await this._daoExecutor._executeStoredProcedure(
        POOL_NAMES.PROJECT_REQUEST,
        ProjectRequestSP.SP_GET_PROJECT_STATUS,
        {
          Phase_Id: phaseId,
        },
      );
      return result.recordset[0];
    } catch (error) {
      GeneralLogger(
        'ProjectsDaoService ==> Getting Current Phase Status',
        error,
        'ERROR',
      );
      throw new BadRequestException(
        `Error while fetching current phase status in the database.`,
      );
    }
  };

  addNewStatus = async (
    phaseId: number,
    newStatusId: number,
    newActionId: number,
    reasonForRejection: string | null,
    reviewedBy: number,
  ) => {
    try {
      await this._daoExecutor._executeStoredProcedure(
        POOL_NAMES.PROJECT_REQUEST,
        ProjectRequestSP.SP_ADD_NEW_STATUS,
        {
          Phase_Id: phaseId,
          New_Status_Id: newStatusId,
          New_Action_Id: newActionId,
          Reason_For_Rejection: reasonForRejection,
          Reviewed_By: reviewedBy,
        },
      );
    } catch (error) {
      GeneralLogger('ProjectsDaoService ==> Adding New Status', error, 'ERROR');
      throw new BadRequestException(
        `Error while adding new status to the phase in the database.`,
      );
    }
  };

  insertObjectives = async (phaseId: number, objectives: string[]) => {
    try {
      if (objectives.length === 0) return;
      const inputList = objectives.map((objective) => ({
        Phase_Id: phaseId,
        Objective: objective,
      }));
      await this._daoExecutor._executeTransaction(
        POOL_NAMES.PROJECT_REQUEST,
        ProjectRequestSP.SP_ASSIGN_PHASE_OBJECTIVE,
        inputList,
      );
    } catch (error) {
      GeneralLogger(
        'ProjectsDaoService ==> Inserting Objectives',
        error,
        'ERROR',
      );
      throw new BadRequestException(
        `Error while inserting objectives to the phase in the database.`,
      );
    }
  };

  createGantt = async (
    projectId: number,
    phaseId: number,
    ganttData: any[],
  ) => {
    try {
      if (ganttData.length === 0) return;

      const newGanttId = await this._daoExecutor._executeStoredProcedure(
        POOL_NAMES.PROJECT_REQUEST,
        ProjectRequestSP.SP_CREATE_GANTT,
        {
          Phase_Id: phaseId,
        },
      );

      const inputList = ganttData.map((task) => ({
        TaskID: task.TaskID,
        TaskName: task.TaskName,
        StartDate: task.StartDate,
        EndDate: task.EndDate,
        Duration: parseFloat(task.Duration.toFixed(2)),
        Progress: parseFloat(task.Progress.toFixed(2)), // Ensure Progress is a decimal with two decimal places
        Predecessor: task.Predecessor,
        ParentTaskId: task.ParentTaskId || null, // Ensure ParentTaskId is set correctly
        Phase_Gantt_Id: newGanttId.recordset[0].Phase_Gantt_Id, // Use the new Gantt ID
      }));

      await this._daoExecutor._executeTransaction(
        POOL_NAMES.PROJECT_REQUEST,
        ProjectRequestSP.SP_INSERT_GANTT_ACTIVITIES,
        inputList,
      );
    } catch (error) {
      GeneralLogger('ProjectsDaoService ==> Creating Gantt', error, 'ERROR');
      throw new BadRequestException(
        `Error while creating Gantt chart in the database.`,
      );
    }
  };

  getGantt = async (
    phaseId: number,
    projectId: number,
    reviewHistoryId: number,
  ): Promise<any> => {
    try {
      const result = await this._daoExecutor._executeStoredProcedure(
        POOL_NAMES.PROJECT_REQUEST,
        ProjectRequestSP.SP_GET_GANTT_BY_PHASE,
        {
          Phase_Id: phaseId,
          Project_Id: projectId,
          Review_History_Id: reviewHistoryId,
        },
      );
      return result.recordsets;
    } catch (error) {
      GeneralLogger('ProjectsDaoService ==> Getting Gantt', error, 'ERROR');
      throw new BadRequestException(
        `Error while fetching Gantt chart from the database.`,
      );
    }
  };

  deleteStakeholdersByPhaseId = async (phaseId: number): Promise<any> => {
    try {
      await this._daoExecutor._executeStoredProcedure(
        POOL_NAMES.PROJECT_REQUEST,
        ProjectRequestSP.SP_DELETE_STAKEHOLDERS_BY_PHASE_ID,
        { Phase_Id: phaseId },
      );
    } catch (error) {
      GeneralLogger(
        'ProjectsDaoService ==> Deleting Stakeholders by Phase ID',
        error,
        'ERROR',
      );
      throw new BadRequestException(
        `Error while deleting stakeholders by phase ID in the database.`,
      );
    }
  };
  deleteObjectivesByPhaseId = async (phaseId: number): Promise<any> => {
    try {
      await this._daoExecutor._executeStoredProcedure(
        POOL_NAMES.PROJECT_REQUEST,
        ProjectRequestSP.SP_DELETE_OBJECTIVES_BY_PHASE_ID,
        { Phase_Id: phaseId },
      );
    } catch (error) {
      GeneralLogger(
        'ProjectsDaoService ==> Deleting Objectives by Phase ID',
        error,
        'ERROR',
      );
      throw new BadRequestException(
        `Error while deleting objectives by phase ID in the database.`,
      );
    }
  };
}
