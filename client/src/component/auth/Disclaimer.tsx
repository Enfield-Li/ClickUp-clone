import { Center, Box } from "@chakra-ui/react";

type Props = {};

export default function Disclaimer({}: Props) {
  return (
    <Center
      bottom="20px"
      color="white"
      fontSize="11px"
      fontWeight="light"
      position="absolute"
    >
      This site is
      <span>&nbsp;</span>
      <Box fontWeight="semibold" as="span">
        not
      </Box>
      <span>&nbsp;</span>
      protected by
      <span>&nbsp;</span>
      <Box
        as="a"
        target="_blank"
        cursor="pointer"
        borderBottomWidth="1px"
        rel="noopener noreferrer"
        borderBottomColor="whiteAlpha.600"
        _hover={{ borderBottomColor: "white" }}
        href="https://en.wikipedia.org/wiki/ReCAPTCHA"
      >
        reCAPTCHA.
      </Box>
      <span>&nbsp;</span>
      <Box>That's right, unprotected : )</Box>
    </Center>
  );
}
