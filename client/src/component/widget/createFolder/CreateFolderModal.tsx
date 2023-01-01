import {
  Modal,
  ModalContent,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import produce from "immer";
import { memo, useState } from "react";
import useTeamStateContext from "../../../context/team/useTeamContext";
import { CreateFolderState, CreateFolderStep } from "../../../types";
import CreateFolderEntry from "./CreateFolderEntry";
import CreateFolderSelectList from "./CreateFolderSelectList";
import CreateFolderStatusColumns from "./CreateFolderStatusColumns";
import CreateFolderSetPrivacy from "./CreateFolderSetPrivacy";

type Props = {};

const iniCreateFolderDTO = {
  name: "",
  members: [],
  isPrivate: false,
  allLists: ["list"],
};

const initCreateFolderState: CreateFolderState = {
  selectedStatusColumns: [],
  step: CreateFolderStep.ENTRY,
  createFolderDTO: iniCreateFolderDTO,
};

export default memo(CreateFolderModal);
function CreateFolderModal({}: Props) {
  const [createFolder, setCreateFolder] = useState<CreateFolderState>(
    initCreateFolderState
  );

  const bgColor = useColorModeValue("white", "darkMain.100");
  const {
    modalControls: { isCreateFolderModalOpen, onCreateFolderModalClose },
  } = useTeamStateContext();

  function handleCreateFolder(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    throw new Error("Function not implemented.");
  }

  function handleCancel() {
    setCreateFolder(
      produce(createFolder, (draftState) => {
        draftState.step = CreateFolderStep.ENTRY;
        draftState.createFolderDTO = iniCreateFolderDTO;
      })
    );
    onCreateFolderModalClose();
  }

  function handleInputOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCreateFolder(
      produce(createFolder, (draftState) => {
        draftState.createFolderDTO.name = e.target.value;
      })
    );
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
      onClose={handleCancel}
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
