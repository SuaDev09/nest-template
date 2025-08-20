import GetProjectByIdDTO from '../dto/get-project-by-id.dto';

const GetProjectByIdTransformer = (project): GetProjectByIdDTO => {
  return {
    Project: project[0][0],
    Objectives: project[1] ? project[1] : [],
    Team_Members: project[2] ? project[2] : [],
    Stakeholders: project[3] ? project[3] : [],
  };
};
export default GetProjectByIdTransformer;
