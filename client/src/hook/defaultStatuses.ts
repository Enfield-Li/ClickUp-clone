import {
  StatusColumnCategories,
  StatusColumnCategory,
  StatusColumns,
} from "../types";

export const custom: StatusColumns = [
  { id: 1, title: "TO DO", color: "rgb(211, 211, 211)", orderIndex: 1 },
  {
    id: 2,
    title: "DONE",
    color: "rgb(107, 201, 80)",
    orderIndex: 2,
    markAsClosed: true,
  },
];

export const kanban: StatusColumns = [
  { id: 1, title: "OPEN", color: "rgb(211, 211, 211)", orderIndex: 1 },
  { id: 2, title: "IN PROGRESS", color: "purple.400", orderIndex: 2 },
  { id: 3, title: "REVIEW", color: "rgb(168, 117, 255)", orderIndex: 3 },
  {
    id: 4,
    title: "CLOSED",
    color: "rgb(107, 201, 80)",
    orderIndex: 4,
    markAsClosed: true,
  },
];

export const marketing: StatusColumns = [
  { id: 1, title: "OPEN", color: "rgb(211, 211, 211)", orderIndex: 1 },
  { id: 2, title: "CONCEPT", color: "rgb(255, 204, 0)", orderIndex: 2 },
  { id: 3, title: "IN PROGRESS", color: "rgb(255, 84, 13)", orderIndex: 3 },
  { id: 4, title: "RUNNING", color: "rgb(255, 0, 223)", orderIndex: 4 },
  { id: 5, title: "REVIEW", color: "rgb(168, 117, 255)", orderIndex: 5 },
  {
    id: 6,
    title: "CLOSED",
    color: "rgb(168, 117, 255)",
    orderIndex: 6,
    markAsClosed: true,
  },
];

export const normal: StatusColumns = [
  { id: 1, title: "TO DO", color: "rgb(211, 211, 211)", orderIndex: 1 },
  { id: 2, title: "IN PROGRESS", color: "rgb(168, 117, 255)", orderIndex: 2 },
  {
    id: 3,
    title: "DONE",
    color: "rgb(107, 201, 80)",
    orderIndex: 3,
    markAsClosed: true,
  },
];

export const scrum: StatusColumns = [
  { id: 1, title: "OPEN", color: "rgb(211, 211, 211)", orderIndex: 1 },
  { id: 2, title: "PENDING", color: "rgb(255, 204, 0)", orderIndex: 2 },
  { id: 3, title: "IN PROGRESS", color: "rgb(255, 84, 13)", orderIndex: 3 },
  { id: 4, title: "COMPLETED", color: "black", orderIndex: 4 },
  { id: 5, title: "IN REVIEW", color: "rgb(255, 153, 0)", orderIndex: 5 },
  { id: 6, title: "ACCEPTED", color: "rgb(248, 28, 7)", orderIndex: 6 },
  { id: 7, title: "REJECTED", color: "rgb(255, 0, 223)", orderIndex: 7 },
  { id: 8, title: "BLOCKED", color: "rgb(168, 117, 255)", orderIndex: 8 },
  {
    id: 9,
    title: "CLOSED",
    color: "rgb(107, 201, 80)",
    orderIndex: 9,
    markAsClosed: true,
  },
];

export const defaultStatusColumnCategories: StatusColumnCategories = [
  { name: "Custom", statusColumns: custom },
  { name: "Normal", statusColumns: normal },
  { name: "Kanban", statusColumns: kanban },
  { name: "Marketing", statusColumns: marketing },
  { name: "Scrum", statusColumns: scrum },
];
