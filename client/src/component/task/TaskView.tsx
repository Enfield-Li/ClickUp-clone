import { useState } from "react";
import useTaskDetailContext from "../../context/task_detail/useTaskDetailContext";
import { SortBy, STATUS } from "./Data";
import TaskDetailModal from "./taskDetails/TaskDetailsModal";
import TaskListView from "./TaskList";
import TaskNavigation from "./TaskNavigation";

type Props = {};

export default function TaskView({}: Props) {
  const [sortBy, setSortBy] = useState<SortBy>(STATUS);
  const { isModalOpen } = useTaskDetailContext();

  return (
    <>
      <TaskNavigation sortBy={sortBy} setSortBy={setSortBy} />
      <TaskListView sortBy={sortBy} />

      {/* Task details inside Modal */}
      {isModalOpen && <TaskDetailModal />}
    </>
  );
}
