import ReviewCondition from '@/common/constants/review-condition.constant';

export default interface ReviewProjectDTO {
  Phase_Id: number;
  Last_Action_Id: number;
  Current_Status_Id: number;
  User_Id: number;
  Role_Id: number;
  Condition: ReviewCondition;
  Comments: string;
}
