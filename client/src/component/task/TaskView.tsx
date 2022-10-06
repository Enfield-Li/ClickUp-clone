import { useState } from "react";
import { SortBy, STATUS } from "./Data";
import TaskListView from "./TaskList";
import TaskNavigation from "./TaskNavigation";

type Props = {};

export default function TaskView({}: Props) {
  const [sortBy, setSortBy] = useState<SortBy>(STATUS);

  return (
    <>
      <TaskNavigation sortBy={sortBy} setSortBy={setSortBy} />
      <TaskListView sortBy={sortBy} />
    </>
  );
}
