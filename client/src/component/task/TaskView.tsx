import { memo, useState } from "react";
import { SortBy } from "../../types";
import TaskBoardView from "./TaskBoardView";
import TaskSortingOptions from "./TaskSortingOptions";

type Props = {};

export default memo(TaskView);
function TaskView({}: Props) {
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.STATUS);

  return (
    <>
      <TaskSortingOptions sortBy={sortBy} setSortBy={setSortBy} />
      <TaskBoardView sortBy={sortBy} />
    </>
  );
}
