import { Box, Center, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import produce from "immer";
import { CreateSpace, CreateSpaceStep } from "../../../../types";
import CreateSpaceModalTemplate from "./CreateSpaceModalTemplate";

type Props = {
  createSpace: CreateSpace;
  setCreateSpace: React.Dispatch<React.SetStateAction<CreateSpace>>;
};

export default function SpacePrivateSetting({
  createSpace,
  setCreateSpace,
}: Props) {
  const borderColor = useColorModeValue("lightMain.200", "lightMain.300");
  const spaceName = createSpace.createSpaceDTO.name;
  const isPrivate = createSpace.createSpaceDTO.isPrivate;

  function handleSetToOpen() {
    setCreateSpace(
      produce(createSpace, (draftState) => {
        draftState.createSpaceDTO.isPrivate = false;
      })
    );
  }
  function handleSetToPrivate() {
    setCreateSpace(
      produce(createSpace, (draftState) => {
        draftState.createSpaceDTO.isPrivate = true;
      })
    );
  }

  return (
    <CreateSpaceModalTemplate
      createSpace={createSpace}
      previousSection={CreateSpaceStep.COLOR}
      setCreateSpace={setCreateSpace}
      nextSection={CreateSpaceStep.STATUS_COLUMNS}
      sectionName={`Share Space "${spaceName}"`}
    >
      <Box height="100%" py="40px">
        <Flex justifyContent="space-between">
          <Box
            rounded="md"
            width="260px"
            height="150px"
            cursor="pointer"
            borderWidth="2px"
            fontWeight="semibold"
            onClick={handleSetToOpen}
            color={!isPrivate ? "purple.500" : borderColor}
            borderColor={!isPrivate ? "purple.500" : borderColor}
          >
            <Box mt="3">
              <Center fontSize="50px">
                <i className="bi bi-people"></i>
              </Center>
              <Center>Open Workspace</Center>
            </Box>
          </Box>
          <Box
            rounded="md"
            width="260px"
            height="150px"
            cursor="pointer"
            borderWidth="2px"
            fontWeight="semibold"
            onClick={handleSetToPrivate}
            color={isPrivate ? "purple.500" : borderColor}
            borderColor={isPrivate ? "purple.500" : borderColor}
          >
            <Box mt="3">
              <Center fontSize="50px">
                <i className="bi bi-lock"></i>
              </Center>
              <Center>Private</Center>
            </Box>
          </Box>
        </Flex>

        <Center mt="30px">
          {!isPrivate ? (
            <Text as="i" fontSize="sm">
              Spaces can be shared with members. You can add guests to Folders,
              Lists, and tasks after creating a Space.
            </Text>
          ) : (
            <Text>Share only with:</Text>
          )}
        </Center>
      </Box>
    </CreateSpaceModalTemplate>
  );
}
