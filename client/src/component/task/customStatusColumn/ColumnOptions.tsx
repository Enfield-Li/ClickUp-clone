import {
  Center,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { memo } from "react";
import OptionWrapper from "../optionWrapper/SelectOption";
import { SortBy, STATUS } from "../../../types";

type Props = {
  sortBy: SortBy;
  showColumnOption: boolean;
  setEditTitle: React.Dispatch<React.SetStateAction<boolean>>;
};

function ColumnOptions({ sortBy, setEditTitle, showColumnOption }: Props) {
  const popoverContentBg = useColorModeValue("white", "darkMain.100");
  const iconHoverBg = useColorModeValue("lightMain.100", "darkMain.300");
  const hoverBgColor = useColorModeValue("lightMain.100", "darkMain.200");
  const popoverContentColor = useColorModeValue(
    "darkMain.400",
    "lightMain.200"
  );

  return (
    <>
      <Popover>
        {({ isOpen, onClose }) => {
          return (
            <>
              {showColumnOption && (
                <PopoverTrigger>
                  <Center
                    width="25px"
                    height="25px"
                    rounded="3px"
                    cursor="pointer"
                    _hover={{
                      bgColor: iconHoverBg,
                    }}
                  >
                    <Center>
                      <i className="bi bi-three-dots"></i>
                    </Center>
                  </Center>
                </PopoverTrigger>
              )}

              <PopoverContent
                width="220px"
                bgColor={popoverContentBg}
                color={popoverContentColor}
              >
                <PopoverBody shadow="2xl">
                  {sortBy === STATUS && (
                    <OptionWrapper
                      onClose={onClose}
                      optionName="Rename status"
                      hoverBgColor={hoverBgColor}
                      setEditTitle={setEditTitle}
                    >
                      <i className="bi bi-pencil"></i>
                    </OptionWrapper>
                  )}
                </PopoverBody>
              </PopoverContent>
            </>
          );
        }}
      </Popover>
    </>
  );
}
export default memo(ColumnOptions);
