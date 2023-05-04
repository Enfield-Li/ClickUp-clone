import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ListCategory } from "../../../../types";
import { useTeam } from "../../../../stores/useTeam";
import useNavigate from "../../../../hooks/useNavigate";

type Props = { list: ListCategory; isUnderSpace?: boolean };

function List({ list, isUnderSpace }: Props) {
  const navigate = useNavigate();
  const { selectList } = useTeam();

  function onSelectList() {
    selectList(list);
    navigate("list", { listId: String(1), statusCategoryId: String(2) });
  }

  return (
    <TouchableOpacity
      onPress={onSelectList}
      className={`
        flex-row items-center py-3 border-l-4 
        ${isUnderSpace ? "pl-9" : "pl-16"}
        ${list.isSelected && "bg-blue-100"} 
        ${list.isSelected ? "border-blue-300" : "border-white"} 
      `}
    >
      {/* circle */}
      <View
        style={{ backgroundColor: list.color || "gray" }}
        className="rounded-full border-2 border-gray-500 w-2 h-2 mr-4 ml-3"
      />

      {/* list name */}
      <Text>{list.name}</Text>
    </TouchableOpacity>
  );
}

export default List;

const styles = StyleSheet.create({});
