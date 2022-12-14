import { IconButton, useColorModeValue } from "@chakra-ui/react";
import { memo } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

type Props = {};

// https://stackoverflow.com/questions/64558533/changing-the-dark-mode-color-in-chakra-ui
export default memo(ColorModeSwitcher);
function ColorModeSwitcher({}: Props) {
  const text = useColorModeValue("dark", "light");
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  return (
    <IconButton
      mr="-2"
      size="sm"
      _hover={{}}
      _active={{}}
      fontSize="md"
      variant="ghost"
      color="current"
      overflow="hidden"
      width="fit-content"
      height="fit-content"
      icon={<SwitchIcon />}
      aria-label={`Switch to ${text} mode`}
    />
  );
}
