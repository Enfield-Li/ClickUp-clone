import {
  Modal,
  ModalContent,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CreateSpace, CreateSpaceDTO, CreateSpaceStep } from "../../../../types";
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

const initCreateSpace: CreateSpace = {
  step: CreateSpaceStep.NAME,
  isAllSet: false,
  createSpaceDTO,
};

export default function CreateSpaceModal({ isOpen, onClose }: Props) {
  const contentBgColor = useColorModeValue("white", "darkMain.100");
  const [createSpace, setCreateSpace] = useState<CreateSpace>(initCreateSpace);

  useEffect(() => {
    if (!isOpen) {
      onClose();
      setCreateSpace(initCreateSpace);
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
          <SpaceColorSetting
            createSpace={createSpace}
            setCreateSpace={setCreateSpace}
          />
        );
      }
      case CreateSpaceStep.IS_PRIVATE: {
        return (
          <SpacePrivateSetting
            createSpace={createSpace}
            setCreateSpace={setCreateSpace}
          />
        );
      }
      case CreateSpaceStep.STATUS_COLUMNS: {
        return (
          <SpaceColumnsSetting
            createSpace={createSpace}
            setCreateSpace={setCreateSpace}
          />
        );
      }
      case CreateSpaceStep.CONFIRM: {
        return <ReviewCreateSpace />;
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
        <SpaceColumnsSetting
          createSpace={createSpace}
          setCreateSpace={setCreateSpace}
        />
      </ModalContent>
    </Modal>
  );
}
