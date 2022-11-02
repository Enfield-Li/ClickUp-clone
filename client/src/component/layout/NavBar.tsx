import { useDisclosure, Flex, Box, useColorModeValue } from "@chakra-ui/react";
import React, { useState } from "react";
import FixedNavBar from "./navbar/FixedNavBar";
import ToggleNavBar from "./navbar/ToggleNavBar";

type Props = {};

export default function NavBar({}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const collapsibleBG = useColorModeValue("white", "rgb(26, 32, 44)");
  const { getDisclosureProps, isOpen, onToggle, onClose, onOpen } =
    useDisclosure({
      defaultIsOpen: false,
    });

  return (
    <Flex
      onMouseOverCapture={onOpen}
      onMouseOutCapture={!isExpanded ? onClose : undefined}
    >
      {/* Fixed navbar */}
      <FixedNavBar
        onOpen={onOpen}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />

      {/* Collapsible navbar */}
      <Box
        zIndex="2"
        opacity="100%"
        backgroundColor={collapsibleBG}
        ml={!isExpanded ? "45px" : undefined}
        position={!isExpanded ? "absolute" : undefined}
      >
        <ToggleNavBar
          isOpen={isOpen}
          onToggle={onToggle}
          setIsExpanded={setIsExpanded}
          getDisclosureProps={getDisclosureProps}
        />
      </Box>
    </Flex>
  );
}
