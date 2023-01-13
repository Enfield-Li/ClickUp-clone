import {
  Modal,
  ModalContent,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import produce from "immer";
import { memo, useEffect, useState } from "react";
import useTeamStateContext from "../../../context/team/useTeamContext";
import { fetchTeamStatusCategories } from "../../../networkCalls";
import { CreateFolderState, CreateFolderStep } from "../../../types";
import CreateFolderEntry from "./CreateFolderEntry";
import { initCreateFolderState } from "./createfolderInitialState";
import CreateFolderSelectList from "./CreateFolderSelectList";
import CreateFolderSetPrivacy from "./CreateFolderSetPrivacy";
import CreateFolderStatusColumns from "./CreateFolderStatusColumns";

type Props = {};

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
      const space = team?.spaces.find((space) => space.isOpen);
      if (!team || !space) {
        throw new Error("Can not find team when create folder");
      }

      const teamId = team.id;
      const lastOrderIndex = team.spaces[team.spaces.length - 1].orderIndex;

      fetchTeamStatusCategories(Number(teamId), (StatusCategories) => {
        setCreateFolder(
          produce(createFolder, (draftState) => {
            draftState.teamStatusCategories = StatusCategories;
            draftState.selectedStatusColumns =
              StatusCategories[0].statusColumns;

            draftState.createFolderDTO.spaceId = space.id;
            draftState.createFolderDTO.orderIndex = lastOrderIndex + 1;
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
