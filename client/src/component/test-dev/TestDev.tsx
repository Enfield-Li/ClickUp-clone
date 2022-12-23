import {
  Box,
  Center,
  Divider,
  Flex,
  Modal,
  ModalContent,
  ModalOverlay,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { FileUploader } from "react-drag-drop-files";

export default function TestDev() {
  const [scale, setScale] = useState(1);

  return (
    <Box>
      <Slider minH="32" defaultValue={30} orientation="vertical">
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </Box>
  );
}
