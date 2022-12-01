import { Flex } from "@chakra-ui/react";
import React from "react";
import { CreateSpace, Step } from "./CreateSpaceModal";
import CreateSpaceModalTemplate from "./CreateSpaceModalTemplate";

type Props = {
  createSpace: CreateSpace;
  setCreateSpace: React.Dispatch<React.SetStateAction<CreateSpace>>;
};

export default function SpaceColumnsSetting({
  createSpace,
  setCreateSpace,
}: Props) {
  return (
    <CreateSpaceModalTemplate
      createSpace={createSpace}
      nextSection={Step.CONFIRM}
      setCreateSpace={setCreateSpace}
      previousSection={Step.IS_PRIVATE}
      sectionName="What task statuses do you want?"
    >
      <Flex alignItems="center" height="100%">
        SpaceColumnsSetting
      </Flex>
    </CreateSpaceModalTemplate>
  );
}
