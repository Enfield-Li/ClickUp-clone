import { useState } from "react";
import { SortBy, STATUS } from "./Data";
import TaskDetailModal from "./taskDetails/TaskDetails";
import TaskListView from "./TaskList";
import TaskNavigation from "./TaskNavigation";

type Props = {};

export default function TaskView({}: Props) {
  const [sortBy, setSortBy] = useState<SortBy>(STATUS);

  return (
    <>
      <TaskNavigation sortBy={sortBy} setSortBy={setSortBy} />
      <TaskListView sortBy={sortBy} />

      {/* Task details inside Modal */}
      <TaskDetailModal />
    </>
  );
}
