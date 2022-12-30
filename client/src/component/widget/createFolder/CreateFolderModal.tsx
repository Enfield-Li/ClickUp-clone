import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import { memo, useState } from "react";
import useTeamStateContext from "../../../context/team/useTeamContext";

type Props = {};

export default memo(CreateFolderModal);
function CreateFolderModal({}: Props) {
  const [value, setValue] = useState("");
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
      closeOnOverlayClick={false}
      isOpen={isCreateFolderModalOpen}
      onClose={onCreateFolderModalClose}
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

          <Box mt="55px">
            <Flex
              p="5"
              px="4"
              fontSize="small"
              borderWidth="1px"
              fontWeight="semibold"
              borderBottomWidth="0px"
              borderColor="blackAlpha.500"
              justifyContent="space-between"
            >
              <Box>Lists</Box>
              <Box>List </Box>
            </Flex>
            <Flex
              p="5"
              px="4"
              fontSize="small"
              borderWidth="1px"
              fontWeight="semibold"
              borderBottomWidth="0px"
              borderColor="blackAlpha.500"
              justifyContent="space-between"
            >
              <Box>Share Folder with</Box>
              <Box>people</Box>
            </Flex>
            <Flex
              p="5"
              px="4"
              fontSize="small"
              borderWidth="1px"
              fontWeight="semibold"
              borderColor="blackAlpha.500"
              justifyContent="space-between"
            >
              <Box>Task statuses</Box>
              <Box>User Space statuses</Box>
            </Flex>
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
            _hover={{ bgColor: "customBlue.100" }}
          >
            Create Folder
          </Button>
        </Box>
      </ModalContent>
    </Modal>
  );
}
