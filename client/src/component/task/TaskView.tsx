import { memo, useEffect, useState } from "react";
import useTaskDetailContext from "../../context/task_detail/useTaskDetailContext";
import { SortBy } from "../../types";
import TaskBoardView from "./TaskBoardView";
import TaskSortingOptions from "./TaskSortingOptions";
import { Box } from "@chakra-ui/react";
import TaskDetailModal from "../taskModal/TaskDetailsModal";
import { useNavigate } from "react-router-dom";
import { CLIENT_ROUTE } from "../../constant";

type Props = {};

function TaskView({}: Props) {
  const navigate = useNavigate();
  const { modalState } = useTaskDetailContext();
  const { isModalOpen } = modalState;

  const [sortBy, setSortBy] = useState<SortBy>(SortBy.STATUS);

  // Reset to base url when modal closed
  useEffect(() => {
    if (!isModalOpen) {
      //   navigate(-1);
      navigate(CLIENT_ROUTE.TASK);
    }
  }, [isModalOpen]);

  return (
    <Box>
      <TaskSortingOptions sortBy={sortBy} setSortBy={setSortBy} />
      <TaskBoardView sortBy={sortBy} />

      {/* Put modal outside list view, to prevent list view refresh and close modal */}
      {isModalOpen && <TaskDetailModal />}
    </Box>
  );
}

export default memo(TaskView);
