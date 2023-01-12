import {
  Modal,
  ModalContent,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import produce from "immer";
import { memo, useEffect, useState } from "react";
import useTeamStateContext from "../../../context/team/useTeamContext";
import {
  CreateFolderDTO,
  CreateFolderState,
  CreateFolderStep,
} from "../../../types";
import CreateFolderEntry from "./CreateFolderEntry";
import CreateFolderSelectList from "./CreateFolderSelectList";
import CreateFolderStatusColumns from "./CreateFolderStatusColumns";
import CreateFolderSetPrivacy from "./CreateFolderSetPrivacy";
import { fetchTeamStatusCategories } from "../../../networkCalls";
import { useParams } from "react-router-dom";

type Props = {};

const iniCreateFolderDTO: CreateFolderDTO = {
  name: "",
  orderIndex: 0,
  isPrivate: false,
  allListNames: ["list"],
  statusColumnsCategoryId: 0,
};

const initCreateFolderState: CreateFolderState = {
  teamStatusCategories: [],
  selectedStatusColumns: [],
  step: CreateFolderStep.ENTRY,
  createFolderDTO: iniCreateFolderDTO,
};

export default memo(CreateFolderModal);
function CreateFolderModal({}: Props) {
  const bgColor = useColorModeValue("white", "darkMain.100");

  const {
    teamState,
    modalControls: { isCreateFolderModalOpen, onCreateFolderModalClose },
  } = useTeamStateContext();

  const [createFolder, setCreateFolder] = useState<CreateFolderState>(
    initCreateFolderState
  );

  useEffect(() => {
    if (isCreateFolderModalOpen) {
      const team = teamState.teams.find((team) => team.isSelected);
      if (!team) throw new Error("Can not find team when create folder");

      const teamId = team.id;
      const lastOrderIndex = team.spaces[team.spaces.length - 1].orderIndex;

      fetchTeamStatusCategories(Number(teamId), (StatusCategories) => {
        setCreateFolder(
          produce(createFolder, (draftState) => {
            draftState.createFolderDTO.orderIndex = lastOrderIndex + 1;
            draftState.teamStatusCategories = StatusCategories;
            draftState.selectedStatusColumns =
              StatusCategories[0].statusColumns;
            draftState.createFolderDTO.statusColumnsCategoryId =
              StatusCategories[0].id!;
          })
        );
      });
    }
  }, [isCreateFolderModalOpen, teamState]);

  function handleCloseModal() {
    onCreateFolderModalClose();
    setCreateFolder(initCreateFolderState);
  }

  function renderStepComponent() {
    switch (createFolder.step) {
      case CreateFolderStep.ENTRY: {
        return (
          <CreateFolderEntry
            createFolder={createFolder}
            setCreateFolder={setCreateFolder}
          />
        );
      }

      case CreateFolderStep.LISTS: {
        return (
          <CreateFolderSelectList
            createFolder={createFolder}
            setCreateFolder={setCreateFolder}
          />
        );
      }

      case CreateFolderStep.SHARE: {
        return (
          <CreateFolderSetPrivacy
            createFolder={createFolder}
            setCreateFolder={setCreateFolder}
          />
        );
      }

      case CreateFolderStep.STATUS: {
        return (
          <CreateFolderStatusColumns
            createFolder={createFolder}
            setCreateFolder={setCreateFolder}
          />
        );
      }

      default: {
        throw new Error("CreateSpaceModal step failed");
      }
    }
  }

  return (
    <Modal
      size="4xl"
      onClose={handleCloseModal}
      closeOnOverlayClick={true}
      isOpen={isCreateFolderModalOpen}
    >
      <ModalOverlay />

      <ModalContent bgColor={bgColor} height="fit-content" rounded="md">
        {renderStepComponent()}
      </ModalContent>
    </Modal>
  );
}
