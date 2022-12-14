import { Box, Button, Center, Flex } from "@chakra-ui/react";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { CLIENT_ROUTE } from "../../constant";
import logo from "../../media/clickup_logo.png";

type Props = {
  isLogin: boolean;
};

export default memo(HeadInfo);
function HeadInfo({ isLogin }: Props) {
  const navigate = useNavigate();

  function handleOnCLick() {
    navigate(isLogin ? CLIENT_ROUTE.REGISTER : CLIENT_ROUTE.LOGIN);
  }

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
          onClick={handleOnCLick}
          bgColor="customBlue.200"
          _hover={{ bgColor: "customBlue.100" }}
          _active={{}}
          _focus={{}}
        >
          {isLogin ? "Sign up" : "Login"}
        </Button>
      </Flex>
    </Flex>
  );
}
