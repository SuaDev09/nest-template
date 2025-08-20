class ProjectQuery {
  getProjects() {
    return `SELECT * FROM VIEW_Get_Projects`;
  }

  getPhaseStatusById(phaseId: number) {
    return `SELECT * FROM VIEW_Get_Projects WHERE Phase_Id = ${phaseId}`;
  }
}

export default new ProjectQuery();
