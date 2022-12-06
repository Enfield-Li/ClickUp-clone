import {
  Box,
  Button,
  Center,
  Divider,
  FormLabel,
  Input,
  ModalCloseButton,
  useColorModeValue,
} from "@chakra-ui/react";
import produce from "immer";
import { ChangeEvent, memo } from "react";
import { CreateSpace, CreateSpaceStep } from "../../../../types";
import NewSpaceSVG from "./utils/NewSpaceSVG";

type Props = {
  createSpace: CreateSpace;
  setCreateSpace: React.Dispatch<React.SetStateAction<CreateSpace>>;
};

export default memo(EnterSpaceName);
function EnterSpaceName({ createSpace, setCreateSpace }: Props) {
  const inputBgColor = useColorModeValue("lightMain.50", "darkMain.200");

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    setCreateSpace(
      produce(createSpace, (draftState) => {
        draftState.createSpaceDTO.name = e.target.value;
      })
    );
  }

  function handleNextStep() {
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
        <Box width="100%">
          <FormLabel fontSize="small" fontWeight="semibold" opacity="90%">
            Space name
          </FormLabel>

          <Input
            mb="5"
            autoFocus
            variant="flushed"
            onChange={handleInput}
            value={createSpace.createSpaceDTO.name}
            placeholder="Enter Space Name"
          />
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
