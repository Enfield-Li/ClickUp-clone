import { getRandomSpaceColor, getRandomTeamColor } from "../media/colors";
import {
  ColumnOptions,
  CurrentWeek,
  DueDateRange,
  FolderCategory,
  ListCategory,
  Priority,
  Space,
  StatusColumns,
  TaskList,
  Team,
  User,
  UserInfo,
} from "../types";
import { getDaysBefore, getNextNWeekDay } from "../utils/getWeekDays";

import { StatusCategories } from "../types";

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

export const defaultStatusCategories: StatusCategories = [
  { id: 1, teamId: 1, name: "Custom", statusColumns: custom, isSelected: true },
  { id: 2, teamId: 1, name: "Normal", statusColumns: normal },
  { id: 3, teamId: 1, name: "Kanban", statusColumns: kanban },
  { id: 4, teamId: 1, name: "Marketing", statusColumns: marketing },
  { id: 5, teamId: 1, name: "Scrum", statusColumns: scrum },
];

const userInfo: UserInfo = { userId: 1, username: "mockUser", email: "" };
const guestUserInfo: UserInfo = { userId: 2, username: "guestUser", email: "" };

const allFolder1ListForTeam1: ListCategory[] = [
  {
    id: 5,
    createdAt: new Date(),
    color: getRandomSpaceColor(),
    isPrivate: false,
    members: [userInfo, guestUserInfo],
    name: "sub list 1",
    creator: userInfo,
    parentFolderId: 2,
    spaceId: 1,
    taskAmount: 5,
    defaultStatusCategoryId: 2,
    isSelected: false,
    orderIndex: 1,
  },
];

export const allSpace1ListOrFolderForTeam1: (FolderCategory | ListCategory)[] =
  [];

const initialSpaceList2ForTeam2: Space[] = [];

export const mockUser: User = {
  id: 1,
  color: getRandomSpaceColor(),
  username: "mockUser",
  email: "",
  defaultTeamId: 1,
  joinedTeamCount: 1,
};
const guestUser: User = {
  id: 2,
  color: getRandomSpaceColor(),
  username: "guestUser",
  email: "",
  defaultTeamId: 1,
  joinedTeamCount: 1,
};

export const teams: Team[] = [];

export const space1TaskList: TaskList = [
  {
    id: 111,
    listId: 1,
    creator: userInfo,
    title: "11111",
    description: "desc here",
    expectedDueDate: null,
    createdAt: getDaysBefore(11),
    watchers: [],
    assignees: [],
    subTasks: [],
    taskEvents: [],
    status: { name: "TO_DO", columnId: 1, orderIndex: 1 },
    priority: { name: Priority.HIGH, columnId: 3, orderIndex: 3 },
    dueDate: { name: DueDateRange.TODAY, columnId: 0, orderIndex: 1 },
  },
  {
    id: 222,
    listId: 1,
    title: "22222",
    creator: userInfo,
    expectedDueDate: getNextNWeekDay(2),
    createdAt: getDaysBefore(4),
    watchers: [],
    assignees: [],
    taskEvents: [],
    subTasks: [],
    status: { name: "TO_DO", columnId: 1, orderIndex: 2 },
    priority: { name: Priority.HIGH, columnId: 3, orderIndex: 2 },
    dueDate: { name: DueDateRange.TODAY, columnId: 0, orderIndex: 3 },
  },
  {
    id: 333,
    listId: 1,
    title: "33333",
    creator: userInfo,
    expectedDueDate: new Date(),
    createdAt: getDaysBefore(4),
    watchers: [],
    assignees: [],
    taskEvents: [],
    subTasks: [],
    status: { name: "TO_DO", columnId: 1, orderIndex: 3 },
    priority: { name: Priority.NO_PRIORITY, columnId: 1, orderIndex: 2 },
    dueDate: { name: DueDateRange.TODAY, columnId: 0, orderIndex: 2 },
  },
  {
    id: 444,
    listId: 1,
    title: "44444",
    creator: userInfo,
    expectedDueDate: new Date(),
    createdAt: getDaysBefore(4),
    watchers: [],
    assignees: [],
    taskEvents: [],
    subTasks: [],
    status: { name: "TO_DO", columnId: 1, orderIndex: 4 },
    priority: { name: Priority.NO_PRIORITY, columnId: 1, orderIndex: 4 },
    dueDate: { name: DueDateRange.TODAY, columnId: 0, orderIndex: 4 },
  },
  {
    id: 555,
    listId: 1,
    title: "55555",
    creator: userInfo,
    expectedDueDate: new Date(),
    createdAt: getDaysBefore(4),
    watchers: [],
    assignees: [],
    taskEvents: [],
    subTasks: [],
    status: { name: "IN PROGRESS", columnId: 2, orderIndex: 1 },
    priority: { name: Priority.NO_PRIORITY, columnId: 1, orderIndex: 5 },
    dueDate: { name: DueDateRange.TODAY, columnId: 0, orderIndex: 5 },
  },
];

export const space2TaskList: TaskList = [
  {
    id: 1111,
    listId: 1,
    creator: userInfo,
    title: "1",
    description: "desc here",
    expectedDueDate: null,
    createdAt: getDaysBefore(11),
    watchers: [],
    assignees: [],
    subTasks: [],
    taskEvents: [],
    status: { name: "TO_DO", columnId: 1, orderIndex: 1 },
    priority: { name: Priority.HIGH, columnId: 3, orderIndex: 3 },
    dueDate: { name: DueDateRange.TODAY, columnId: 0, orderIndex: 1 },
  },
  {
    id: 2222,
    listId: 1,
    title: "2",
    creator: userInfo,
    expectedDueDate: getNextNWeekDay(2),
    createdAt: getDaysBefore(4),
    watchers: [],
    assignees: [],
    taskEvents: [],
    subTasks: [],
    status: { name: "TO_DO", columnId: 1, orderIndex: 2 },
    priority: { name: Priority.HIGH, columnId: 3, orderIndex: 2 },
    dueDate: { name: DueDateRange.TODAY, columnId: 0, orderIndex: 3 },
  },
  {
    id: 3333,
    listId: 1,
    title: "3",
    creator: userInfo,
    expectedDueDate: new Date(),
    createdAt: getDaysBefore(4),
    watchers: [],
    assignees: [],
    taskEvents: [],
    subTasks: [],
    status: { name: "TO_DO", columnId: 1, orderIndex: 3 },
    priority: { name: Priority.NO_PRIORITY, columnId: 1, orderIndex: 2 },
    dueDate: { name: DueDateRange.TODAY, columnId: 0, orderIndex: 2 },
  },
  {
    id: 4444,
    listId: 1,
    title: "4",
    creator: userInfo,
    expectedDueDate: new Date(),
    createdAt: getDaysBefore(4),
    watchers: [],
    assignees: [],
    taskEvents: [],
    subTasks: [],
    status: { name: "TO_DO", columnId: 1, orderIndex: 4 },
    priority: { name: Priority.NO_PRIORITY, columnId: 1, orderIndex: 4 },
    dueDate: { name: DueDateRange.TODAY, columnId: 0, orderIndex: 4 },
  },
  {
    id: 5555,
    listId: 1,
    title: "5",
    creator: userInfo,
    expectedDueDate: new Date(),
    createdAt: getDaysBefore(4),
    watchers: [],
    assignees: [],
    taskEvents: [],
    subTasks: [],
    status: { name: "IN PROGRESS", columnId: 2, orderIndex: 1 },
    priority: { name: Priority.NO_PRIORITY, columnId: 1, orderIndex: 5 },
    dueDate: { name: DueDateRange.TODAY, columnId: 0, orderIndex: 5 },
  },
];
