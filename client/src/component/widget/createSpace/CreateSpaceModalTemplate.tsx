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
import { useNavigate } from "react-router-dom";
import { useModalControl } from "../../../context/modalControl/useModalControl";
import { useTeam } from "../../../context/team/useTeam";
import { createSpaceForTeam } from "../../../networkCalls";
import {
  CreateSpaceDTO,
  CreateSpaceState,
  CreateSpaceStep,
} from "../../../types";
import { getTaskBoardURL } from "../../../utils/getTaskBoardURL";
import { initialCreateSpace } from "./createSpaceInitialState";

type Props = {
  sectionName: string;
  children: React.ReactNode;
  previousSection: CreateSpaceStep;
  createSpaceState: CreateSpaceState;
  nextSection: CreateSpaceStep | null;
  setCreateSpace: React.Dispatch<React.SetStateAction<CreateSpaceState>>;
};

export default memo(CreateSpaceModalTemplate);
function CreateSpaceModalTemplate({
  children,
  nextSection,
  sectionName,
  createSpaceState,
  setCreateSpace,
  previousSection,
}: Props) {
  const navigate = useNavigate();
  const { teamActiveStatus, addSpace: createSpace } = useTeam();
  const { onCreateSpaceModalClose } = useModalControl();

  const bottomBgColor = useColorModeValue("lightMain.50", "darkMain.200");

  function handleNext() {
    setCreateSpace(
      produce(createSpaceState, (draftState) => {
        draftState.step = nextSection ? nextSection : CreateSpaceStep.NAME;
        if (nextSection === CreateSpaceStep.CONFIRM) {
          draftState.isAllSet = true;
        }
      })
    );
  }

  function handleCreateSpace() {
    const teamId = teamActiveStatus.teamId;

    const createSpaceDTO: CreateSpaceDTO = {
      ...createSpaceState.createSpaceDTO,
      teamId: Number(teamId),
    };
    createSpaceForTeam(createSpaceDTO, (space) => {
      onCreateSpaceModalClose();
      setCreateSpace(initialCreateSpace);
      navigate(
        getTaskBoardURL({
          teamId: teamActiveStatus.teamId,
          spaceId: space.id,
          listId: space.listCategories[0].id,
        }),
        {
          state: { defaultStatusCategoryId: space.defaultStatusCategoryId },
        }
      );

      createSpace(space);
    });
  }

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
              produce(createSpaceState, (draftState) => {
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
          color="lightMain.100"
          bgColor="customBlue.200"
          _hover={{ bgColor: "customBlue.100" }}
          onClick={
            createSpaceState.step === CreateSpaceStep.CONFIRM
              ? handleCreateSpace
              : handleNext
          }
        >
          {!nextSection
            ? "Create space"
            : createSpaceState.isAllSet
            ? "Review changes"
            : "Next"}
        </Button>
      </Box>
    </>
  );
}
