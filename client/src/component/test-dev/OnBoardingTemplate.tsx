import { Flex, Center, Box } from "@chakra-ui/react";
import React from "react";
import LogoSVG from "../../media/LogoSVG";

type Props = {
  title: string;
  stageNumber: number;
  step: number;
  children: React.ReactNode;
};

export default function OnBoardingTemplate({
  step,
  title,
  children,
  stageNumber,
}: Props) {
  return (
    <Box height="410px" opacity={step === stageNumber ? "" : "25%"}>
      <Flex alignItems="center">
        <Center
          mr="6"
          shadow="lg"
          width="55px"
          height="55px"
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

        <Box fontSize="25px">{title}</Box>
      </Flex>

      <Flex>
        <Center
          opacity="0"
          mr="6"
          shadow="lg"
          width="55px"
          height="55px"
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

        <Box flexGrow="1">{children}</Box>
      </Flex>
    </Box>
  );
}
