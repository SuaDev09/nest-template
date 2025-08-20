import GanttDataModel from '@/common/models/gantt-data.model';

// export const GanttDTOTransformer = (ganttActivities: any[]): GanttDataModel => {
//   try {
//       return {

//     };
//   } catch (error) {
//     console.error('Error transforming CreateProjectRequestDto:', error);
//     throw new BadRequestException(
//       'Invalid input format for CreateProjectRequestDto.',
//     );
//   }
// };

export const ganttDTOToSpParams = (ganttData, parentTaskId = null) => {
  const result = [];

  ganttData.forEach((task) => {
    // Add the current task to the result
    result.push({
      TaskID: task.TaskID,
      TaskName: task.TaskName,
      StartDate: task.StartDate,
      EndDate: task.EndDate,
      Duration: task.Duration,
      Progress: task.Progress,
      Predecessor: task.Predecessor,
      ParentTaskId: parentTaskId, // Set the parent task ID
    });

    // If the task has subtasks, process them recursively
    if (task.subtasks && task.subtasks.length > 0) {
      result.push(...ganttDTOToSpParams(task.subtasks, task.TaskID));
    }
  });

  return result;
};

export const recordsetToGanttDataModel = (
  recordset: any[],
): GanttDataModel[] => {
  // Create a map to store tasks by TaskID
  const taskMap: { [key: number]: GanttDataModel } = {};

  // Initialize the result array for top-level tasks
  const result: GanttDataModel[] = [];

  // Iterate through the recordset to build the task map
  recordset.forEach((task) => {
    const ganttTask: GanttDataModel = {
      TaskID: task.TaskID,
      TaskName: task.TaskName,
      StartDate: new Date(task.StartDate),
      EndDate: new Date(task.EndDate),
      Duration: task.Duration,
      Progress: task.Progress ?? 0,
      Predecessor: task.Predecessor,
      subtasks: [],
    };

    // Add the task to the map
    taskMap[task.TaskID] = ganttTask;

    // If the task has no ParentTaskId, it's a top-level task
    if (!task.ParentTaskId) {
      result.push(ganttTask);
    } else {
      // Otherwise, add it as a subtask of its parent
      const parentTask = taskMap[task.ParentTaskId];
      if (parentTask) {
        parentTask.subtasks?.push(ganttTask);
      }
    }
  });

  return result;
};
