import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Divider,
  ModalCloseButton,
  useColorModeValue,
} from "@chakra-ui/react";
import produce from "immer";
import React, { memo } from "react";
import { CreateSpaceStep, CreateSpace } from "../../../../types";

type Props = {
  sectionName: string;
  createSpace: CreateSpace;
  children: React.ReactNode;
  previousSection: CreateSpaceStep;
  nextSection: CreateSpaceStep | null;
  setCreateSpace: React.Dispatch<React.SetStateAction<CreateSpace>>;
};

export default memo(CreateSpaceModalTemplate);
function CreateSpaceModalTemplate({
  children,
  nextSection,
  sectionName,
  createSpace,
  setCreateSpace,
  previousSection,
}: Props) {
  const bottomBgColor = useColorModeValue("lightMain.50", "darkMain.200");

  function handleNext() {
    setCreateSpace(
      produce(createSpace, (draftState) => {
        draftState.step = nextSection ? nextSection : CreateSpaceStep.NAME;
        if (nextSection === CreateSpaceStep.CONFIRM) {
          draftState.isAllSet = true;
        }
      })
    );
  }

  function handleCreateSpace() {}

  return (
    <>
      {/* Top title area */}
      <Center height="120px">
        <ChevronLeftIcon
          top="37px"
          left="37px"
          fontSize="35px"
          cursor="pointer"
          fontWeight="bold"
          position="absolute"
          _hover={{ color: "purple.500" }}
          onClick={() => {
            setCreateSpace(
              produce(createSpace, (draftState) => {
                draftState.step = previousSection;
              })
            );
          }}
        />

        <Center fontSize="25px" fontWeight="semibold">
          {sectionName}
        </Center>

        <ModalCloseButton
          top="37px"
          right="37px"
          fontSize="lg"
          position="absolute"
          _hover={{ color: "purple.500" }}
        />
      </Center>

      <Divider borderColor="blackAlpha.300" />

      {/* Bottom area */}
      <Box bgColor={bottomBgColor} height="100%" px="55px">
        <Box height="299.5px">{children}</Box>

        <Button
          mt="6"
          width="100%"
          rounded="sm"
          height="50px"
          onClick={handleNext}
          color="lightMain.100"
          bgColor="customBlue.200"
          _hover={{ bgColor: "customBlue.100" }}
        >
          {!nextSection
            ? "Create space"
            : createSpace.isAllSet
            ? "Review changes"
            : "Next"}
        </Button>
      </Box>
    </>
  );
}
