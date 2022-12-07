import { Box, Center, useToast } from "@chakra-ui/react";
import { memo, useState } from "react";
import * as ReactDOMServer from "react-dom/server";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../../context/auth/useAuthContext";
import { FieldErrors } from "../../types";
import { getRandomNumber } from "../../utils/getRandomNumber";
import Disclaimer from "./Disclaimer";
import HeadInfo from "./HeadInfo";
import LoginForm from "./LoginForm";
import LoginSVG from "./LoginSVG";

type Props = {};

export default memo(Login);
function Login({}: Props) {
  const toast = useToast({ duration: 3000, isClosable: true });
  const { authState, authDispatch } = useAuthContext();
  const [errors, setErrors] = useState<FieldErrors>();
  const navigate = useNavigate();

  const svgString = encodeURIComponent(
    ReactDOMServer.renderToStaticMarkup(<LoginSVG />)
  );

  return (
    <Center
      pt={3}
      height="100vh"
      position="relative"
      bgColor="lightMain.50"
      backgroundPosition="bottom"
      backgroundRepeat="no-repeat"
      style={{ backgroundImage: `url("data:image/svg+xml,${svgString}")` }}
    >
      <HeadInfo />

      <Box>
        <Box
          p="6"
          rounded="lg"
          width="480px"
          height="400px"
          boxShadow="2xl"
          bgColor="white"
        >
          <Center fontWeight="bold" fontSize="33px" mt="3">
            Welcome back!
          </Center>
          <Box px="6" mt="6" bgColor="white">
            <LoginForm />
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
          >
            Sign up
          </Box>
        </Center>
      </Box>

      <Disclaimer />
    </Center>
  );
}
