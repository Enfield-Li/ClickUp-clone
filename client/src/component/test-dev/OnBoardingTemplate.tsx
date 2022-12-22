import { Flex, Center, Box, Button } from "@chakra-ui/react";
import React from "react";
import LogoSVG from "../../media/LogoSVG";

type Props = {
  step: number;
  title: string;
  stageNumber: number;
  buttonTitle?: string;
  children: React.ReactNode;
  handleNextStage?: (stage: number) => void;
};

export default function OnBoardingTemplate({
  step,
  title,
  children,
  stageNumber,
  buttonTitle,
  handleNextStage,
}: Props) {
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
          <Center
            width="fit-content"
            height="fit-content"
            transform="scale(0.25)"
          >
            <LogoSVG />
          </Center>
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
              _hover={{ bgColor: "customBlue.100" }}
              onClick={() =>
                handleNextStage && handleNextStage(stageNumber + 1)
              }
            >
              {buttonTitle}
            </Button>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
