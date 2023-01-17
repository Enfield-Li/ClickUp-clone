import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormLabel,
  Input,
  ModalCloseButton,
  useColorModeValue,
} from "@chakra-ui/react";
import produce from "immer";
import { ChangeEvent, memo, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useTeamStateContext from "../../../context/team/useTeamContext";
import NewSpaceSVG from "../../../media/NewSpaceSVG";
import { CreateSpaceState, CreateSpaceStep } from "../../../types";

type Props = {
  createSpace: CreateSpaceState;
  setCreateSpace: React.Dispatch<React.SetStateAction<CreateSpaceState>>;
};

export default memo(CreateSpaceName);
function CreateSpaceName({ createSpace, setCreateSpace }: Props) {
  const [error, setError] = useState(false);
  const { teamState } = useTeamStateContext();
  const inputBgColor = useColorModeValue("lightMain.50", "darkMain.200");

  useEffect(() => {
    if (error) setTimeout(() => setError(false), 3000);
  }, [error]);

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    setCreateSpace(
      produce(createSpace, (draftState) => {
        draftState.createSpaceDTO.name = e.target.value;
      })
    );
  }

  function handleNextStep() {
    const isTeamNameExist = teamState.teamsForRender.some(
      (team) =>
        team.id === teamState.teamActiveStatus.teamId &&
        team.spaces.some(
          (space) => space.name === createSpace.createSpaceDTO.name
        )
    );
    if (isTeamNameExist) {
      setError(true);
      return;
    }

    setCreateSpace(
      produce(createSpace, (draftState) => {
        draftState.step = createSpace.isAllSet
          ? CreateSpaceStep.CONFIRM
          : CreateSpaceStep.COLOR;
      })
    );
  }

  return (
    <Box position="relative">
      <ModalCloseButton
        top="37px"
        right="37px"
        fontSize="lg"
        position="absolute"
        _hover={{ color: "purple.500" }}
      />

      <Center height="280px" flexDir="column">
        <Box alignSelf="center">
          <NewSpaceSVG />
        </Box>

        <Box fontSize="25px" fontWeight="semibold">
          Create new Space
        </Box>
      </Center>

      <Divider borderColor="blackAlpha.300" />

      <Box
        pt="30px"
        px="55px"
        height="250px"
        flexDir="column"
        bgColor={inputBgColor}
      >
        <Box width="100%" mb="5">
          <FormLabel fontSize="small" fontWeight="semibold" opacity="90%">
            Space name
          </FormLabel>

          <Input
            autoFocus
            variant="flushed"
            onChange={handleInput}
            value={createSpace.createSpaceDTO.name}
            placeholder="Enter Space Name"
          />

          {error && (
            <Flex mt="2" fontSize="12px" color="red.500">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <Box ml="2">Space name already exists!</Box>
            </Flex>
          )}
        </Box>

        <Button
          mt="6"
          width="100%"
          rounded="sm"
          height="50px"
          color="lightMain.100"
          bgColor="customBlue.200"
          onClick={handleNextStep}
          _hover={{ bgColor: "customBlue.100" }}
          disabled={createSpace.createSpaceDTO.name ? false : true}
        >
          {createSpace.isAllSet ? "Review changes" : "Next"}
        </Button>
      </Box>
    </Box>
  );
}
