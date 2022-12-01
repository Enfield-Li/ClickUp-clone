import { motion } from "framer-motion";
import { memo } from "react";
import { SpaceType } from "../../../types";
import FolderAndList from "./folderAndList/FolderAndList";
import Space from "./Space";

type Props = { space: SpaceType };

export default memo(SpaceList);
function SpaceList({ space }: Props) {
  return (
    <motion.div layout="position" transition={{ duration: 0.2 }}>
      <Space space={space} />

      {space.allListOrFolder.map((folder) => (
        <motion.div
          key={folder.id}
          hidden={!space.isOpen}
          animate={{ opacity: space.isOpen ? 1 : 0 }}
          transition={{ type: "keyframes", duration: 0.3 }}
        >
          <FolderAndList spaceId={space.id} folder={folder} />
        </motion.div>
      ))}
    </motion.div>
  );
}
