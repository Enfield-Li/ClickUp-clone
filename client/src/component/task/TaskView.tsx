import { Flex, useDisclosure } from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useTaskDetailContext from "../../context/task_detail/useTaskDetailContext";
import { GroupBy } from "../../types";
import TaskDetailsModal from "../taskModal/TaskDetailsModal";
import TaskBoardView from "./TaskBoardView";
import TaskFilterTopBar from "./filterOptions/TaskFilterTopBar";

type Props = {};

export default memo(TaskView);
function TaskView({}: Props) {
  const [groupBy, setGroupBy] = useState<GroupBy>(GroupBy.STATUS);
  const { modalState } = useTaskDetailContext();
  const { isModalOpen } = modalState;

  return (
    <Flex flexDir="column" height="100%">
      <TaskFilterTopBar groupBy={groupBy} setSortBy={setGroupBy} />
      <TaskBoardView groupBy={groupBy} />

      {isModalOpen && <TaskDetailsModal />}
    </Flex>
  );
}
