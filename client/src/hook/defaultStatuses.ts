import { DefaultStatusColumnCategories, StatusColumns } from "../types";

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
  { id: 2, title: "IN PROGRESS", color: "rgb(65, 148, 246)", orderIndex: 2 },
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

export const defaultStatusColumnCategories: DefaultStatusColumnCategories = [
  { id: 1, name: "Custom", statusColumns: custom },
  { id: 2, name: "Normal", statusColumns: normal },
  { id: 3, name: "Kanban", statusColumns: kanban },
  { id: 4, name: "Marketing", statusColumns: marketing },
  { id: 5, name: "Scrum", statusColumns: scrum },
];
