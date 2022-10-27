import { useState } from "react";
import useTaskDetailContext from "../../context/task_detail/useTaskDetailContext";
import { SortBy, STATUS } from "./taskTypes";
import TaskDetailModal from "./taskDetails/TaskDetailsModal";
import TaskListView from "./TaskListView";
import TaskNavigation from "./TaskNavigation";
import { Box } from "@chakra-ui/react";

type Props = {};

export default function TaskView({}: Props) {
  const [sortBy, setSortBy] = useState<SortBy>(STATUS);
  const { isModalOpen } = useTaskDetailContext();

  return (
    <Box>
      <TaskNavigation sortBy={sortBy} setSortBy={setSortBy} />
      <TaskListView sortBy={sortBy} />

      {/* 
        Put modal outside list view, 
        to prevent list view refresh and close modal 
      */}
      {isModalOpen && <TaskDetailModal />}
    </Box>
  );
}
