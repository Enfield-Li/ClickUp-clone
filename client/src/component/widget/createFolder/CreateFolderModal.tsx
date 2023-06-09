import {
  Modal,
  ModalContent,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import produce from "immer";
import { memo, useEffect, useState } from "react";
import { useModalControl } from "../../../context/modalControl/useModalControl";
import { useTeam } from "../../../context/team/useTeam";
import { fetchTeamStatusCategories } from "../../../networkCalls";
import { CreateFolderState, CreateFolderStep } from "../../../types";
import { determineFolderType } from "../../layout/subNavbar/folderAndList/determineList";
import CreateFolderEntry from "./CreateFolderEntry";
import { initCreateFolderState } from "./createFolderInitialState";
import CreateFolderSelectList from "./CreateFolderSelectList";
import CreateFolderSetPrivacy from "./CreateFolderSetPrivacy";
import CreateFolderStatusColumns from "./CreateFolderStatusColumns";

type Props = {};

export default memo(CreateFolderModal);
function CreateFolderModal({}: Props) {
  const { teamsForRender, createFolderInfo } = useTeam();
  const bgColor = useColorModeValue("white", "darkMain.100");
  const { isCreateFolderModalOpen, onCreateFolderModalClose } =
    useModalControl();
  const [createFolderState, setCreateFolderState] = useState<CreateFolderState>(
    initCreateFolderState
  );

  useEffect(() => {
    if (isCreateFolderModalOpen) {
      const team = teamsForRender.find((team) => team.isSelected);
      const space = team?.spaces.find(
        (space) => space.id === createFolderInfo?.spaceId
      );
      if (!team || !space) {
        throw new Error("Can not find team when create folder");
      }

      const teamId = team.id;
      const lastFolder = space.allListOrFolder.findLast((listOrFolder) =>
        determineFolderType(listOrFolder)
      );
      const lastOrderIndex = lastFolder ? lastFolder.orderIndex + 1 : 1;

      fetchTeamStatusCategories(Number(teamId), (StatusCategories) => {
        setCreateFolderState(
          produce(createFolderState, (draftState) => {
            draftState.teamStatusCategories = StatusCategories;
            draftState.selectedStatusColumns =
              StatusCategories[0].statusColumns;

            draftState.createFolderDTO.spaceId = space.id;
            draftState.createFolderDTO.orderIndex = lastOrderIndex + 1;
            draftState.createFolderDTO.defaultStatusCategoryId =
              StatusCategories[0].id!;
          })
        );
      });
    }
  }, [isCreateFolderModalOpen, createFolderInfo, teamsForRender]);

  function handleCloseModal() {
    onCreateFolderModalClose();
    setCreateFolderState(initCreateFolderState);
  }

  function renderStepComponent() {
    switch (createFolderState.step) {
      case CreateFolderStep.ENTRY: {
        return (
          <CreateFolderEntry
            createFolderState={createFolderState}
            setCreateFolderState={setCreateFolderState}
          />
        );
      }

      case CreateFolderStep.LISTS: {
        return (
          <CreateFolderSelectList
            createFolderState={createFolderState}
            setCreateFolderState={setCreateFolderState}
          />
        );
      }

      case CreateFolderStep.SHARE: {
        return (
          <CreateFolderSetPrivacy
            createFolderState={createFolderState}
            setCreateFolderState={setCreateFolderState}
          />
        );
      }

      case CreateFolderStep.STATUS: {
        return (
          <CreateFolderStatusColumns
            createFolderState={createFolderState}
            setCreateFolderState={setCreateFolderState}
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
