import { memo, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { CLIENT_ROUTE } from "../../constant";
import useAuthContext from "../../context/auth/useAuthContext";
import useTaskDetailContext from "../../context/task_detail/useTaskDetailContext";
import { SortBy } from "../../types";
import TaskDetailsModal from "../taskModal/TaskDetailsModal";
import TaskBoardView from "./TaskBoardView";
import TaskSortingOptions from "./TaskSortingOptions";

type Props = {};

export default memo(TaskView);
function TaskView({}: Props) {
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.STATUS);

  const navigate = useNavigate();
  const { authState } = useAuthContext();
  const { modalState } = useTaskDetailContext();
  const { isModalOpen } = modalState;

  // Reset to base url when modal closed
  //   useEffect(() => {
  //     if (!isModalOpen) {
  //       //   navigate(-1);
  //       navigate(CLIENT_ROUTE.TASK_BOARD + `/${1}`, {
  //         replace: true,
  //       });
  //     }
  //   }, [isModalOpen, authState.openedTaskListId]);

  return (
    <>
      <TaskSortingOptions sortBy={sortBy} setSortBy={setSortBy} />
      <TaskBoardView sortBy={sortBy} />

      {isModalOpen && <TaskDetailsModal />}
      {/* <Outlet /> */}
    </>
  );
}
