import {
  Modal,
  ModalContent,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import {
  CreateSpaceState,
  CreateSpaceDTO,
  CreateSpaceStep,
} from "../../../types";
import CreateSpaceName from "./CreateSpaceName";
import CreateSpaceReview from "./CreateSpaceReview";
import CreateSpaceColor from "./CreateSpaceColor";
import CreateSpaceStatusColumns from "./CreateSpaceStatusColumns";
import CreateSpaceSetPrivacy from "./CreateSpaceSetPrivacy";
import useTeamStateContext from "../../../context/team/useTeamContext";
import { fetchTeamStatusCategories } from "../../../networkCalls";
import produce from "immer";

type Props = {};

const initCreateSpaceDTO: CreateSpaceDTO = {
  name: "",
  teamId: 0,
  avatar: "",
  color: "gray",
  orderIndex: 0,
  isPrivate: false,
};

const initialCreateSpace: CreateSpaceState = {
  isAllSet: false,
  teamStatusCategories: [],
  selectedStatusColumns: [],
  step: CreateSpaceStep.NAME,
  createSpaceDTO: initCreateSpaceDTO,
};

export default memo(CreateSpaceModal);
function CreateSpaceModal({}: Props) {
  const {
    teamState,
    modalControls: { isCreateSpaceModalOpen, onCreateSpaceModalClose },
  } = useTeamStateContext();
  const teamId = teamState.activeTeamState.selectedTeamId;
  const contentBgColor = useColorModeValue("white", "darkMain.100");
  const [createSpace, setCreateSpace] =
    useState<CreateSpaceState>(initialCreateSpace);
  const isAllSet = createSpace.isAllSet;
  //   console.log(createSpace);

  function redirectToReview(createSpaceStep: CreateSpaceStep) {
    return isAllSet ? CreateSpaceStep.CONFIRM : createSpaceStep;
  }

  useEffect(() => {
    if (isCreateSpaceModalOpen && teamId) {
      fetchTeamStatusCategories(teamId, (data) => {
        setCreateSpace(
          produce(createSpace, (draftState) => {
            draftState.teamStatusCategories = data;
          })
        );
      });
    }
  }, [isCreateSpaceModalOpen, teamId]);

  function handleCloseModal() {
    onCreateSpaceModalClose();
    setCreateSpace(initialCreateSpace);
  }

  function renderStepComponent() {
    switch (createSpace.step) {
      case CreateSpaceStep.NAME: {
        return (
          <CreateSpaceName
            createSpace={createSpace}
            setCreateSpace={setCreateSpace}
          />
        );
      }
      case CreateSpaceStep.COLOR: {
        return (
          <CreateSpaceColor
            createSpace={createSpace}
            setCreateSpace={setCreateSpace}
            redirectToReview={redirectToReview}
          />
        );
      }
      case CreateSpaceStep.IS_PRIVATE: {
        return (
          <CreateSpaceSetPrivacy
            createSpace={createSpace}
            setCreateSpace={setCreateSpace}
            redirectToReview={redirectToReview}
          />
        );
      }
      case CreateSpaceStep.STATUS_COLUMNS: {
        return (
          <CreateSpaceStatusColumns
            createSpace={createSpace}
            setCreateSpace={setCreateSpace}
            redirectToReview={redirectToReview}
          />
        );
      }
      case CreateSpaceStep.CONFIRM: {
        return (
          <CreateSpaceReview
            createSpace={createSpace}
            setCreateSpace={setCreateSpace}
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
      size="2xl"
      onClose={handleCloseModal}
      isOpen={isCreateSpaceModalOpen}
    >
      <ModalOverlay />
      <ModalContent bgColor={contentBgColor} height="530px">
        {renderStepComponent()}
      </ModalContent>
    </Modal>
  );
}
