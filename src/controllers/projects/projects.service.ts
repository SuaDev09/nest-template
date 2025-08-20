import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { ProjectsDaoService } from './projects.dao.service';
import GetProjectsDTO from './dto/get-projects.dto';
import GeneralLogger from '@/common/loggers/general-logger/general-logger';
import AssignStakeholdersDTO from './dto/assign-stakeholders.dto';
import CreateProjectDTO from './dto/create-project.dto';
import AssignMembersToPhaseDTO from './dto/assing-members-to-phase.dto';
import { StatusTransitionService } from '@/common/services/status-transition.service';
import ReviewProjectDTO from './dto/review-project.dto';
import AssignPriorityDTO from './dto/assign-priority.dto';
import {
  ganttDTOToSpParams,
  recordsetToGanttDataModel,
} from './transformers/gantt.transformer';
import CreateGanttDTO from './dto/gantt/create-gantt.dto';
import UpdateProjectDTO from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly _projectsDaoService: ProjectsDaoService,
    private readonly _statusTransitionService: StatusTransitionService,
  ) {}
  async getProjects(): Promise<GetProjectsDTO[]> {
    try {
      const result = await this._projectsDaoService.getProjects();
      return result;
    } catch (error) {
      if (!error.message) {
        GeneralLogger('ProjectService ==> Getting Projects', error, 'ERROR');
      }
      throw new BadRequestException(
        error.message || `Error while fetching projects from the service.`,
      );
    }
  }

  async getProjectById(
    phaseId: number,
    projectId: number,
    reviewHistoryId: number,
  ) {
    try {
      const result = await this._projectsDaoService.getProjectById(
        phaseId,
        projectId,
        reviewHistoryId,
      );

      return result;
    } catch (error) {
      if (!error.message) {
        GeneralLogger(
          'ProjectService ==> Getting Project by ID',
          error,
          'ERROR',
        );
      }
      throw new BadRequestException(
        error.message ||
          `Error while fetching project by ID from the service. Please try again later.`,
      );
    }
  }

  async createNewProject(newProject: CreateProjectDTO) {
    try {
      const Phase_Id = await this._projectsDaoService.createProject(
        newProject,
        newProject.File_Current_Process,
      );
      await this._projectsDaoService.insertStakeholders(
        Phase_Id,
        newProject.Stakeholders,
      );
      await this._projectsDaoService.insertObjectives(
        Phase_Id,
        newProject.Objectives,
      );

      return HttpStatus.CREATED;
    } catch (error) {
      if (!error.message) {
        GeneralLogger(
          'ProjectService ==> Creating New Project',
          error,
          'ERROR',
        );
      }
      throw new BadRequestException(
        error.message ||
          'Error creating project from the service. Please try again later.',
      );
    }
  }

  async updateProject(updateProjectDTO: UpdateProjectDTO) {
    try {
      if (
        updateProjectDTO.Status_Id === 4 ||
        updateProjectDTO.Status_Id === 7
      ) {
        const transition = this._statusTransitionService.getNextTransition(
          'project',
          23,
          updateProjectDTO.Status_Id,
          updateProjectDTO.Created_By === updateProjectDTO.User_Id
            ? 1
            : updateProjectDTO.Role_Id,
        );
        if (!transition) {
          GeneralLogger(
            'ProjectService ==> No transition found for updating project status',
            updateProjectDTO,
            'ERROR',
          );
          throw new BadRequestException(
            'No transition found for updating project status.',
          );
        }
        await this.addNewStatus(
          updateProjectDTO.Phase_Id,
          transition.status,
          transition.actionId, // just in this case
          null,
          updateProjectDTO.User_Id, // reviewedBy can be set to the user performing the action
        );
      }
      await this._projectsDaoService.updateProject(updateProjectDTO);

      if (updateProjectDTO.Stakeholders) {
        await this._projectsDaoService.deleteStakeholdersByPhaseId(
          updateProjectDTO.Phase_Id,
        );
        await this._projectsDaoService.insertStakeholders(
          updateProjectDTO.Phase_Id,
          updateProjectDTO.Stakeholders,
        );
      }

      if (updateProjectDTO.Objectives) {
        await this._projectsDaoService.deleteObjectivesByPhaseId(
          updateProjectDTO.Phase_Id,
        );
        await this._projectsDaoService.insertObjectives(
          updateProjectDTO.Phase_Id,
          updateProjectDTO.Objectives,
        );
      }

      return HttpStatus.OK;
    } catch (error) {
      if (!error.message) {
        GeneralLogger('ProjectService ==> Updating Project', error, 'ERROR');
      }
      throw new BadRequestException(
        error.message ||
          'Error updating project from the service. Please try again later.',
      );
    }
  }

  async insertStakeholders(
    idPHR: number,
    stakeholders: AssignStakeholdersDTO[],
  ) {
    try {
      await this._projectsDaoService.insertStakeholders(idPHR, stakeholders);
    } catch (error) {
      if (!error.message) {
        GeneralLogger(
          'ProjectService ==> Inserting Stakeholders',
          error,
          'ERROR',
        );
      }
      throw new BadRequestException(
        error.message ||
          'Error inserting stakeholders from the service. Please try again later.',
      );
    }
  }

  async assignMembersToPhase(
    assignMembersToPhaseRequestDto: AssignMembersToPhaseDTO,
  ) {
    try {
      // const currentStatus =
      //   await this._projectsDaoService.getCurrentPhaseStatus(
      //     assignMembersToPhaseRequestDto.Phase_Id,
      //   );
      const transition = this._statusTransitionService.getNextTransition(
        'project',
        2,
        assignMembersToPhaseRequestDto.Current_Status_Id,
        assignMembersToPhaseRequestDto.User_Role_Id,
      );
      if (!transition) {
        GeneralLogger(
          'ProjectService ==> No transition found for assigning members to phase',
          assignMembersToPhaseRequestDto,
          'ERROR',
        );
        throw new BadRequestException(
          'No transition found for assigning members to phase.',
        );
      }

      await this._projectsDaoService.assignMembersToPhase(
        assignMembersToPhaseRequestDto.Phase_Id,
        assignMembersToPhaseRequestDto.Members,
      );

      await this.addNewStatus(
        assignMembersToPhaseRequestDto.Phase_Id,
        transition.status,
        transition.actionId, // just in this case
        null,
        assignMembersToPhaseRequestDto.User_Id, // reviewedBy can be set to the user performing the action
      );
    } catch (error) {
      if (!error.message) {
        GeneralLogger(
          'ProjectService ==> Assigning Members to Phase',
          error,
          'ERROR',
        );
      }

      throw new BadRequestException(
        error.message || 'Error assigning members to phase from the service.',
      );
    }
  }

  async getCurrentPhaseStatus(phaseId: number) {
    try {
      const result =
        await this._projectsDaoService.getCurrentPhaseStatus(phaseId);
      return result;
    } catch (error) {
      if (!error.message) {
        GeneralLogger(
          'ProjectService ==> Getting Current Phase Status',
          error,
          'ERROR',
        );
      }
      throw new BadRequestException(
        error.message ||
          'Error fetching current phase status from the service. Please try again later.',
      );
    }
  }

  async addNewStatus(
    phaseId: number,
    newStatusId: number,
    newActionId: number,
    reasonForRejection: string | null,
    reviewedBy: number,
  ) {
    try {
      await this._projectsDaoService.addNewStatus(
        phaseId,
        newStatusId,
        newActionId,
        reasonForRejection,
        reviewedBy,
      );
    } catch (error) {
      if (!error.message) {
        GeneralLogger('ProjectService ==> Adding New Status', error, 'ERROR');
      }
      throw new BadRequestException(
        error.message ||
          'Error adding new status from the service. Please try again later.',
      );
    }
  }

  // async adminReview(
  //   phaseId: number,
  //   review: string,
  //   currentStatus: number,
  //   comment: string,
  // ) {
  //   const transition = this._statusTransitionService.getNextTransition(
  //     'project',
  //     review,
  //     'Pending',
  //   );
  // }

  async insertObjectives(idPHR: number, objectives: string[]) {
    try {
      await this._projectsDaoService.insertObjectives(idPHR, objectives);
    } catch (error) {
      if (!error.message) {
        GeneralLogger(
          'ProjectService ==> Inserting Objectives',
          error,
          'ERROR',
        );
      }
      throw new BadRequestException(
        error.message ||
          'Error inserting objectives from the service. Please try again later.',
      );
    }
  }

  async assignPriority(assignPriorityDTO: AssignPriorityDTO): Promise<void> {
    const transition = this._statusTransitionService.getNextTransition(
      'project',
      8,
      assignPriorityDTO.Current_Status_Id,
      assignPriorityDTO.Role_Id, // User_Role_Id can be used here if needed
    );
    if (!transition) {
      GeneralLogger(
        'ProjectService ==> No transition found for assigning priority to project',
        assignPriorityDTO,
        'ERROR',
      );
      throw new BadRequestException(
        'No transition found for assigning priority to project.',
      );
    }

    await this._projectsDaoService.assignPriority(
      assignPriorityDTO.Phase_Id,
      assignPriorityDTO.Priority_Id,
    );
    await this.addNewStatus(
      assignPriorityDTO.Phase_Id,
      transition.status,
      transition.actionId, // just in this case
      null,
      2, // reviewedBy can be set to the user performing the action
    );
  }

  async reviewProject(reviewProject: ReviewProjectDTO): Promise<void> {
    try {
      const currentAction = this._statusTransitionService.getReviewType(
        reviewProject.Condition,
        reviewProject.Role_Id,
      ); // User_Role_Id can be used here if needed
      const transition = this._statusTransitionService.getNextTransition(
        'project',
        currentAction,
        reviewProject.Current_Status_Id,
        reviewProject.Role_Id, // User_Role_Id can be used here if needed
      );
      if (!transition) {
        GeneralLogger(
          'ProjectService ==> No transition found for reviewing project',
          reviewProject,
          'ERROR',
        );
        throw new BadRequestException(
          'No transition found for reviewing project.',
        );
      }
      await this.addNewStatus(
        reviewProject.Phase_Id,
        transition.status,
        transition.actionId,
        reviewProject.Comments,
        reviewProject.User_Id,
      );

      // Additional logic for handling the review can be added here
    } catch (error) {
      if (!error.message) {
        GeneralLogger('ProjectService ==> Reviewing Project', error, 'ERROR');
      }
      throw new BadRequestException(
        error.message || 'Error reviewing project from the service.',
      );
    }
  }

  async createGanttChart(data: CreateGanttDTO) {
    try {
      // const result = await this._projectsDaoService.createGanttChart(data);
      const transition = this._statusTransitionService.getNextTransition(
        'project',
        9,
        data.Current_Status_Id,
        data.Role_Id,
      );
      if (!transition) {
        GeneralLogger(
          'ProjectService ==> No transition found for creating Gantt Chart',
          data,
          'ERROR',
        );
        throw new BadRequestException(
          'No transition found for assigning members to phase.',
        );
      }
      const ganttData = ganttDTOToSpParams(data.Gantt_Data);
      await this._projectsDaoService.createGantt(
        data.Project_Id,
        data.Phase_Id,
        ganttData,
      );
      await this.addNewStatus(
        data.Phase_Id,
        transition.status,
        transition.actionId, // just in this case
        null,
        data.User_Id, // reviewedBy can be set to the user performing the action
      );
    } catch (error) {
      if (!error.message) {
        GeneralLogger(
          'ProjectService ==> Creating Gantt Chart',
          error,
          'ERROR',
        );
      }
      throw new BadRequestException(
        error.message || 'Error creating Gantt Chart from the service.',
      );
    }
  }

  async getGantt(phaseId: number, projectId: number, reviewHistoryId: number) {
    try {
      const result = await this._projectsDaoService.getGantt(
        phaseId,
        projectId,
        reviewHistoryId,
      );
      return {
        Project_Info: result[0][0],
        Gantt_Info: result[1][0],
        Gantt_Activities: recordsetToGanttDataModel(result[2]),
      };
    } catch (error) {
      if (!error.message) {
        GeneralLogger('ProjectService ==> Getting Gantt Chart', error, 'ERROR');
      }
      throw new BadRequestException(
        error.message ||
          'Error fetching Gantt Chart from the service. Please try again later.',
      );
    }
  }
}
