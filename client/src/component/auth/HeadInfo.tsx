import { Flex, Center, Button, Box } from "@chakra-ui/react";
import LogoSVG from "../../media/LogoSVG";
import logo from "../../media/clickup_logo.png";

type Props = {};

export default function HeadInfo({ }: Props) {
  return (
    <Flex
      px="35px"
      top="-10px"
      width="100%"
      cursor="pointer"
      alignItems="center"
      position="absolute"
      height="fit-content"
      justifyContent="space-between"
    >
      <Center>
        <Center boxSize="120px">
          {/* <LogoSVG /> */}
          <img src={logo} />
        </Center>
        <Flex ml="2" alignItems="center">
          <span>&nbsp;</span>
          <Box fontWeight="light" fontSize="small">
            (clone)
          </Box>
        </Flex>
      </Center>

      <Flex alignItems="center">
        <Box fontSize="smaller" mr="3">
          Don't have an account?
        </Box>
        <Button color="white" bgColor="submitBtn">
          Sign up
        </Button>
      </Flex>
    </Flex>
  );
}
