import { useDisclosure } from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { CLIENT_ROUTE } from "../../constant";
import useAuthContext from "../../context/auth/useAuthContext";
import useTaskDetailContext from "../../context/task_detail/useTaskDetailContext";
import { SortBy } from "../../types";
import TaskDetailsModal from "../taskModal/TaskDetailsModal";
import TaskBoardView from "./TaskBoardView";
import TaskSortingOptions from "./TaskSortingOptions";
import WorkSpaceEntryModal from "./WorkSpaceEntryModal";

type Props = {};

export default memo(TaskView);
function TaskView({}: Props) {
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.STATUS);
  const { modalState } = useTaskDetailContext();
  const { isModalOpen } = modalState;
  console.log(sortBy);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  console.log(location?.state);

  useEffect(() => {
    onOpen();
    if (location?.state?.isNewUser) {
      onOpen();
    }
  }, [location]);

  return (
    <>
      <TaskSortingOptions sortBy={sortBy} setSortBy={setSortBy} />
      <TaskBoardView sortBy={sortBy} />

      {isModalOpen && <TaskDetailsModal />}
      {isOpen && <WorkSpaceEntryModal isOpen={isOpen} onClose={onClose} />}
    </>
  );
}
