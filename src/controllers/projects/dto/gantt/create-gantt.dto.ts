import GanttDataModel from '@/common/models/gantt-data.model';

export default interface CreateGanttDTO {
  User_Id: number;
  Role_Id: number;
  Current_Status_Id: number;
  Project_Id: number;
  Phase_Id: number;
  Gantt_Data: GanttDataModel[];
}
