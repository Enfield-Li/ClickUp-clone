import { useDisclosure, Flex, Box, useColorModeValue } from "@chakra-ui/react";
import React, { useState } from "react";
import FixedNavBar from "./navbar/FixedNavBar";
import ToggleNavBar from "./navbar/ToggleNavBar";

type Props = {};
export type Section = "home" | "tasks" | "dev";

export default function NavBar({}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [subNavOpenable, setSubNavOpenable] = useState(true);
  const [currentSection, setCurrentSection] = useState<Section>("home");
  const collapsibleBG = useColorModeValue("white", "rgb(26, 32, 44)");
  const { getDisclosureProps, isOpen, onToggle, onClose, onOpen } =
    useDisclosure({
      defaultIsOpen: false,
    });
  const fixedNavbarWidth = "55px";

  return (
    <Flex as="nav" onMouseOutCapture={isExpanded ? undefined : onClose}>
      {/* Fixed navbar */}
      <FixedNavBar
        onOpen={onOpen}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        currentSection={currentSection}
        fixedNavbarWidth={fixedNavbarWidth}
        setCurrentSection={setCurrentSection}
      />

      {/* Sub navbar */}
      {currentSection === "tasks" && (
        <Box
          zIndex="2"
          opacity="100%"
          backgroundColor={collapsibleBG}
          ml={isExpanded ? undefined : fixedNavbarWidth}
          position={isExpanded ? undefined : "absolute"}
          onMouseOverCapture={subNavOpenable ? onOpen : undefined}
        >
          <ToggleNavBar
            isOpen={isOpen}
            onToggle={onToggle}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            setSelectable={setSubNavOpenable}
            getDisclosureProps={getDisclosureProps}
          />
        </Box>
      )}
    </Flex>
  );
}
