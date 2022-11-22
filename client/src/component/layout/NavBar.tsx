import { useDisclosure, Flex, Box, useColorModeValue } from "@chakra-ui/react";
import React, { memo, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FixedNavBar from "./navbar/FixedNavBar";
import ToggleNavBar from "./navbar/ToggleNavBar";

type Props = {};
export type Section = "home" | "tasks" | "dev";

export default memo(NavBar);
function NavBar({}: Props) {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [subNavOpenable, setSubNavOpenable] = useState(true);
  const [currentSection, setCurrentSection] = useState<Section>("home");

  const fixedNavbarWidth = "55px";
  const collapsibleBG = useColorModeValue("white", "rgb(26, 32, 44)");
  const { getDisclosureProps, isOpen, onClose, onOpen } = useDisclosure({
    defaultIsOpen: false,
  });

  // Sync up url with currentSection taskState after user refresh page
  useEffect(() => {
    if (location.pathname.includes("task")) {
      setCurrentSection("tasks");
    } else if (location.pathname.includes("test_dev")) {
      setCurrentSection("dev");
    }
  }, []);

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
            onClose={onClose}
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
