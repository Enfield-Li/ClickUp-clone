import { useEffect, useState } from "react";
import useTaskDetailContext from "../../context/task_detail/useTaskDetailContext";
import { SortBy, STATUS } from "./taskTypes";
import TaskBoardView from "./TaskBoardView";
import TaskSortingOptions from "./TaskSortingOptions";
import { Box } from "@chakra-ui/react";
import TaskDetailModal from "../taskModal/TaskDetailsModal";
import { useNavigate } from "react-router-dom";
import { CLIENT_ROUTE } from "../../utils/constant";

type Props = {};

export default function TaskView({}: Props) {
  const navigate = useNavigate();
  const { isModalOpen } = useTaskDetailContext();
  const [sortBy, setSortBy] = useState<SortBy>(STATUS);

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

      {/* 
        Put modal outside list view, 
        to prevent list view refresh and close modal 
      */}
      {isModalOpen && <TaskDetailModal />}
    </Box>
  );
}
