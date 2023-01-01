import { Box, Center, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import produce from "immer";
import { memo } from "react";
import { CreateSpaceState, CreateSpaceStep } from "../../../types";
import CreateSpaceModalTemplate from "./CreateSpaceModalTemplate";

type Props = {
  createSpace: CreateSpaceState;
  redirectToReview(createSpaceStep: CreateSpaceStep): CreateSpaceStep;
  setCreateSpace: React.Dispatch<React.SetStateAction<CreateSpaceState>>;
};

export default memo(CreateSpaceSetPrivacy);
function CreateSpaceSetPrivacy({
  createSpace,
  setCreateSpace,
  redirectToReview,
}: Props) {
  const borderColor = useColorModeValue("lightMain.200", "lightMain.300");
  const textColor = useColorModeValue("blackAlpha.600", "lightMain.400");
  const isPrivate = createSpace.createSpaceDTO.isPrivate;
  const spaceName = createSpace.createSpaceDTO.name;

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
      setCreateSpace={setCreateSpace}
      previousSection={CreateSpaceStep.COLOR}
      sectionName={`Share Space "${spaceName}"`}
      nextSection={redirectToReview(CreateSpaceStep.STATUS_COLUMNS)}
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
              <Center color={!isPrivate ? "purple.500" : textColor}>
                Open Workspace
              </Center>
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
              <Center color={isPrivate ? "purple.500" : textColor}>
                Private
              </Center>
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
