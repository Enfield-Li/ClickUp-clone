import { Box, Button, Center, Flex, Image } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/useAuth";
import { logoDataUrl } from "../../media/imgDataUrl";
import { createTeam } from "../../networkCalls";
import { getTaskBoardURL } from "../../utils/getTaskBoardURL";
import { CreateTeamDTO } from "./CreateTeam";

type Props = {
  step: number;
  title: string;
  stageNumber: number;
  buttonTitle?: string;
  children: React.ReactNode;
  createTeamDTO?: CreateTeamDTO;
  handleNextStage?: (stage: number) => void;
};

export default function CreateTeamTemplate({
  step,
  title,
  children,
  stageNumber,
  buttonTitle,
  createTeamDTO,
  handleNextStage,
}: Props) {
  const navigate = useNavigate();
  const { updateTeamCount } = useAuth();

  function handleClickButton() {
    if (handleNextStage) {
      handleNextStage(stageNumber + 1);
      return;
    }

    if (buttonTitle === "Play with ClickUp" && createTeamDTO) {
      createTeam(createTeamDTO, (createdTeam) => {
        const teamId = createdTeam.id!;
        updateTeamCount(true, teamId);
        navigate(getTaskBoardURL({ teamId }));
      });
    }
  }

  return (
    <Box height="410px" opacity={step === stageNumber ? "" : "25%"}>
      <Flex>
        <Center
          mr="6"
          shadow="lg"
          width="58px"
          height="58px"
          rounded="full"
          boxShadow="lg"
          bgColor="white"
        >
          <Image height="36px" src={logoDataUrl} />
        </Center>

        <Box flexGrow="1">
          <Box mt="2" fontSize="25px">
            {title}
          </Box>

          <Box mt="40px">{children}</Box>

          {buttonTitle && (
            <Button
              mt="50px"
              size="lg"
              _focus={{}}
              _active={{}}
              rounded="md"
              color="white"
              bgColor="customBlue.200"
              onClick={handleClickButton}
              _hover={{ bgColor: "customBlue.100" }}
            >
              {buttonTitle}
            </Button>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
