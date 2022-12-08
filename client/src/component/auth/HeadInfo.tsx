import { Box, Button, Center, Flex } from "@chakra-ui/react";
import logo from "../../media/clickup_logo.png";

type Props = {
  isLogin: boolean;
};

export default function HeadInfo({ isLogin }: Props) {
  return (
    <Flex
      px="35px"
      top="-10px"
      width="100%"
      alignItems="center"
      position="absolute"
      height="fit-content"
      justifyContent="space-between"
    >
      <Center cursor="pointer">
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
          {isLogin ? "Don't have an account?" : "Already playing with ClickUp?"}
        </Box>
        <Button
          color="white"
          shadow="dark-lg"
          bgColor="submitBtn.100"
          _hover={{ bgColor: "submitBtn.200" }}
        >
          {isLogin ? "Sign up" : "Login"}
        </Button>
      </Flex>
    </Flex>
  );
}