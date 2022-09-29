import { useState } from "react";
import { getWeekDays } from "../../utils/getWeekDays";
import { Columns, SortBy, sortingOptions } from "./Data";
import TaskList from "./TaskList";
import TaskNavigation from "./TaskNavigation";

type Props = {};

export default function TaskView({}: Props) {
  const [sortBy, setSortBy] = useState<SortBy>("priority");

  // let columns: Columns = [];

  // if (sortBy === "dueDate") {
  //   const { currentWeekDay, nextWeekDay } = getWeekDays();
  //   const previousColumns = sortingOptions[sortBy];

  //   previousColumns.find(item => item.title === currentWeekDay)
  // }
  const columns = sortingOptions[sortBy];
  // console.log(columns);

  return (
    <>
      <TaskNavigation sortBy={sortBy} setSortBy={setSortBy} />
      <TaskList columns={columns} sortBy={sortBy} />
    </>
  );
}
