import { StyleSheet, View } from "react-native";
import { FolderCategory, ListCategory } from "../../../../types";
import { determineFolderType } from "../../../../utils/determineList";
import Folder from "./Folder";
import List from "./List";
import { Fragment } from "react";

type Props = { allListOrFolder: (FolderCategory | ListCategory)[] };

function SpaceContent({ allListOrFolder }: Props) {
  return (
    <View>
      {allListOrFolder.map((listOrFolder) => (
        <Fragment
          key={
            (determineFolderType(listOrFolder) ? "folder" : "list") +
            listOrFolder.id
          }
        >
          {determineFolderType(listOrFolder) ? (
            <Folder folder={listOrFolder} />
          ) : (
            <List isUnderSpace list={listOrFolder} />
          )}
        </Fragment>
      ))}
    </View>
  );
}

export default SpaceContent;

const styles = StyleSheet.create({});
