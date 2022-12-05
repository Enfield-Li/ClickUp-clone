import {
  Modal,
  ModalContent,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import {
  CreateSpace,
  CreateSpaceDTO,
  CreateSpaceStep,
} from "../../../../types";
import CreateSpaceModalTemplate from "./CreateSpaceModalTemplate";
import EnterSpaceName from "./EnterSpaceName";
import ReviewCreateSpace from "./ReviewCreateSpace";
import SpaceColorSetting from "./SpaceColorSetting";
import SpaceColumnsSetting from "./SpaceColumnsSetting";
import SpacePrivateSetting from "./SpacePrivateSetting";

type Props = { isOpen: boolean; onClose: () => void };

const createSpaceDTO: CreateSpaceDTO = {
  name: "",
  color: "gray",
  orderIndex: null,
  isPrivate: false,
};

const initialCreateSpace: CreateSpace = {
  step: CreateSpaceStep.NAME,
  isAllSet: false,
  createSpaceDTO,
};

export default memo(CreateSpaceModal);
function CreateSpaceModal({ isOpen, onClose }: Props) {
  const contentBgColor = useColorModeValue("white", "darkMain.100");
  const [createSpace, setCreateSpace] =
    useState<CreateSpace>(initialCreateSpace);
  const spaceName = createSpace.createSpaceDTO.name;

  useEffect(() => {
    if (!isOpen) {
      onClose();
      setCreateSpace(initialCreateSpace);
    }
  }, [isOpen]);

  function renderStepComponent() {
    switch (createSpace.step) {
      case CreateSpaceStep.NAME: {
        return (
          <EnterSpaceName
            createSpace={createSpace}
            setCreateSpace={setCreateSpace}
          />
        );
      }
      case CreateSpaceStep.COLOR: {
        return (
          <CreateSpaceModalTemplate
            sectionName="Space color"
            createSpace={createSpace}
            setCreateSpace={setCreateSpace}
            previousSection={CreateSpaceStep.NAME}
            nextSection={CreateSpaceStep.IS_PRIVATE}
          >
            <SpaceColorSetting
              createSpace={createSpace}
              setCreateSpace={setCreateSpace}
            />
          </CreateSpaceModalTemplate>
        );
      }
      case CreateSpaceStep.IS_PRIVATE: {
        return (
          <CreateSpaceModalTemplate
            createSpace={createSpace}
            setCreateSpace={setCreateSpace}
            previousSection={CreateSpaceStep.COLOR}
            sectionName={`Share Space "${spaceName}"`}
            nextSection={CreateSpaceStep.STATUS_COLUMNS}
          >
            <SpacePrivateSetting
              createSpace={createSpace}
              setCreateSpace={setCreateSpace}
            />
          </CreateSpaceModalTemplate>
        );
      }
      case CreateSpaceStep.STATUS_COLUMNS: {
        return (
          <CreateSpaceModalTemplate
            createSpace={createSpace}
            nextSection={CreateSpaceStep.CONFIRM}
            setCreateSpace={setCreateSpace}
            previousSection={CreateSpaceStep.IS_PRIVATE}
            sectionName="What task statuses do you want?"
          >
            <SpaceColumnsSetting />
          </CreateSpaceModalTemplate>
        );
      }
      case CreateSpaceStep.CONFIRM: {
        return (
          <CreateSpaceModalTemplate
            nextSection={null}
            sectionName="All good?"
            createSpace={createSpace}
            setCreateSpace={setCreateSpace}
            previousSection={CreateSpaceStep.STATUS_COLUMNS}
          >
            <ReviewCreateSpace
              createSpace={createSpace}
              setCreateSpace={setCreateSpace}
            />
          </CreateSpaceModalTemplate>
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
      isOpen={isOpen}
      onClose={onClose}
      blockScrollOnMount={false}
    >
      <ModalOverlay />
      <ModalContent bgColor={contentBgColor} height="530px">
        {/* <>{renderStepComponent()}</> */}
        <CreateSpaceModalTemplate
          nextSection={null}
          sectionName="All good?"
          createSpace={createSpace}
          setCreateSpace={setCreateSpace}
          previousSection={CreateSpaceStep.STATUS_COLUMNS}
        >
          <ReviewCreateSpace
            createSpace={createSpace}
            setCreateSpace={setCreateSpace}
          />
        </CreateSpaceModalTemplate>
      </ModalContent>
    </Modal>
  );
}
