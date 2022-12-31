import {
  Box,
  Button,
  Center,
  Divider,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import { memo, useState } from "react";
import useTeamStateContext from "../../../context/team/useTeamContext";
import CreateFolderItem from "./CreateFolderItem";

type Props = {};

type CreateFolderState = {
    name: string;
}

export default memo(CreateFolderModal);
function CreateFolderModal({}: Props) {
  const [value, setValue] = useState("");
  const [createFolder, setCreateFolder] = useState();

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
    setValue("");
    onCreateFolderModalClose();
  }

  return (
    <Modal
      size="2xl"
      onClose={handleCancel}
      closeOnOverlayClick={false}
      isOpen={isCreateFolderModalOpen}
    >
      <ModalOverlay />

      <ModalContent bgColor={bgColor} height="560px" rounded="md">
        <Center
          px="37px"
          height="100px"
          alignItems="center"
          borderTopRadius="md"
        >
          <Box fontSize="2xl" fontWeight="semibold">
            Create Folder
          </Box>

          <ModalCloseButton
            top="40px"
            right="37px"
            fontSize="lg"
            position="absolute"
            width="fit-content"
            height="fit-content"
            _hover={{ color: "purple.500" }}
          />
        </Center>

        <Divider borderColor="blackAlpha.500" opacity="100%" />

        <Box px="37px" py="6" mt="4">
          <Box fontWeight="semibold" fontSize="sm" mb="1">
            Folder name
          </Box>

          <Input
            autoFocus
            value={value}
            variant="unstyled"
            placeholder="Enter folder name"
            onChange={(e) => setValue(e.target.value)}
          />

          <Box
            mt="55px"
            cursor="pointer"
            borderWidth="1px"
            fontWeight="semibold"
            borderBottomWidth="0px"
            borderColor="blackAlpha.500"
          >
            <CreateFolderItem left="Lists" right="List" />

            <CreateFolderItem left="Share Folder with" right="people" />

            <CreateFolderItem
              left="Task statuses"
              right="User Space statuses"
            />
          </Box>

          <Button
            mt="38px"
            _focus={{}}
            _active={{}}
            width="100%"
            height="50px"
            color="white"
            display="block"
            bgColor="customBlue.200"
            onClick={handleCreateFolder}
            _hover={{ bgColor: "customBlue.100" }}
          >
            Create Folder
          </Button>
        </Box>
      </ModalContent>
    </Modal>
  );
}
