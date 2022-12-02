import {
  StatusColumnCategories,
  StatusColumnCategory,
  StatusColumns,
} from "../types";

export const custom: StatusColumns = [
  { id: 1, title: "TO_DO", color: "blue.300", orderIndex: 1, listId: 1 },
  {
    id: 2,
    title: "DONE",
    color: "green.400",
    orderIndex: 2,
    listId: 1,
    markAsClosed: true,
  },
];

export const kanban: StatusColumns = [
  { id: 1, title: "OPEN", color: "blue.300", orderIndex: 1, listId: 1 },
  {
    id: 2,
    title: "IN_PROGRESS",
    color: "purple.400",
    orderIndex: 2,
    listId: 1,
  },
  { id: 3, title: "REVIEW", color: "purple.400", orderIndex: 3, listId: 1 },
  {
    id: 4,
    title: "CLOSED",
    color: "green.400",
    orderIndex: 4,
    listId: 1,
    markAsClosed: true,
  },
];

export const marketing: StatusColumns = [
  { id: 1, title: "OPEN", color: "blue.300", orderIndex: 1, listId: 1 },
  { id: 2, title: "CONCEPT", color: "purple.400", orderIndex: 2, listId: 1 },
  { id: 3, title: "IN_PROGRESS", color: "green.400", orderIndex: 3, listId: 1 },
  { id: 4, title: "RUNNING", color: "green.400", orderIndex: 4, listId: 1 },
  { id: 5, title: "REVIEW", color: "green.400", orderIndex: 5, listId: 1 },
  {
    id: 6,
    title: "CLOSED",
    color: "green.400",
    orderIndex: 6,
    listId: 1,
    markAsClosed: true,
  },
];

export const normal: StatusColumns = [
  { id: 1, title: "TO_DO", color: "blue.300", orderIndex: 1, listId: 1 },
  {
    id: 2,
    title: "IN_PROGRESS",
    color: "purple.400",
    orderIndex: 2,
    listId: 1,
  },
  {
    id: 3,
    title: "DONE",
    color: "green.400",
    orderIndex: 3,
    listId: 1,
    markAsClosed: true,
  },
];

export const scrum: StatusColumns = [
  { id: 1, title: "OPEN", color: "blue.300", orderIndex: 1, listId: 1 },
  { id: 2, title: "PENDING", color: "purple.400", orderIndex: 2, listId: 1 },
  { id: 3, title: "IN_PROGRESS", color: "green.400", orderIndex: 3, listId: 1 },
  { id: 4, title: "RUNNING", color: "green.400", orderIndex: 4, listId: 1 },
  { id: 5, title: "IN_REVIEW", color: "green.400", orderIndex: 5, listId: 1 },
  { id: 6, title: "ACCEPTED", color: "green.400", orderIndex: 6, listId: 1 },
  { id: 7, title: "REJECTED", color: "green.400", orderIndex: 7, listId: 1 },
  { id: 8, title: "BLOCKED", color: "green.400", orderIndex: 8, listId: 1 },
  {
    id: 9,
    title: "CLOSED",
    color: "green.400",
    orderIndex: 9,
    listId: 1,
    markAsClosed: true,
  },
  { id: 11, title: "OPEN", color: "blue.300", orderIndex: 1, listId: 1 },
  { id: 21, title: "PENDING", color: "purple.400", orderIndex: 2, listId: 1 },
  { id: 41, title: "RUNNING", color: "green.400", orderIndex: 4, listId: 1 },
  { id: 51, title: "IN_REVIEW", color: "green.400", orderIndex: 5, listId: 1 },
  { id: 61, title: "ACCEPTED", color: "green.400", orderIndex: 6, listId: 1 },
  { id: 71, title: "REJECTED", color: "green.400", orderIndex: 7, listId: 1 },
  { id: 81, title: "BLOCKED", color: "green.400", orderIndex: 8, listId: 1 },
];

export const defaultStatusColumnCategories: StatusColumnCategories = [
  { statusCategoryName: "Custom", statusColumns: custom },
  { statusCategoryName: "Normal", statusColumns: normal },
  { statusCategoryName: "Kanban", statusColumns: kanban },
  { statusCategoryName: "Marketing", statusColumns: marketing },
  { statusCategoryName: "Scrum", statusColumns: scrum },
];

//     {
//   Custom: custom,
//   Normal: normal,
//   Kanban: kanban,
//   Marketing: marketing,
//   Scrum: scrum,
// } as const;
