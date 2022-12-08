import { Box, Center } from "@chakra-ui/react";
import React, { memo } from "react";
import * as ReactDOMServer from "react-dom/server";
import Disclaimer from "./Disclaimer";
import HeadInfo from "./HeadInfo";
import LoginSVG from "./LoginSVG";

type Props = {
  isLogin: boolean;
  children: React.ReactNode;
};

export default memo(AuthTemplate);
function AuthTemplate({ isLogin, children }: Props) {
  const svgString = encodeURIComponent(
    ReactDOMServer.renderToStaticMarkup(<LoginSVG />)
  );

  return (
    <Center
      pt="3"
      color="black"
      height="100vh"
      position="relative"
      bgColor="lightMain.50"
      backgroundPosition="bottom"
      backgroundRepeat="no-repeat"
      style={{ backgroundImage: `url("data:image/svg+xml,${svgString}")` }}
    >
      <HeadInfo isLogin={isLogin} />

      <Box>
        <Box
          p="6"
          rounded="lg"
          width="480px"
          boxShadow="2xl"
          bgColor="white"
          height="fit-content"
        >
          <Center fontWeight="bold" fontSize="33px" mt="3">
            {isLogin ? "Welcome back!" : "Let's go!"}
          </Center>
          <Box px="6" mt="6" bgColor="white">
            {children}
          </Box>
        </Box>

        <Center color="white" mt="6" fontSize="15px">
          Don't have an account?
          <span>&nbsp;</span>
          <Box
            as="span"
            cursor="pointer"
            borderBottomWidth="1px"
            borderBottomColor="whiteAlpha.600"
            _hover={{ borderBottomColor: "white" }}
          >
            Sign up
          </Box>
        </Center>
      </Box>

      <Disclaimer />
    </Center>
  );
}
