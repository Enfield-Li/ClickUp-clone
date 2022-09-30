import { useState } from "react";
import { SortBy } from "./Data";
import TaskList from "./TaskList";
import TaskNavigation from "./TaskNavigation";

type Props = {};

export default function TaskView({}: Props) {
  const [sortBy, setSortBy] = useState<SortBy>("status");

  return (
    <>
      <TaskNavigation sortBy={sortBy} setSortBy={setSortBy} />
      <TaskList sortBy={sortBy} />
    </>
  );
}
