import { getRandomSpaceColor, getRandomTeamColor } from "../media/colors";
import {
  ColumnOptions,
  CurrentWeek,
  DueDateRange,
  FolderCategory,
  ListCategory,
  PanelActivity,
  Priority,
  Space,
  StatusColumns,
  TaskList,
  Team,
  User,
  UserInfo,
} from "../types";
import { getDaysBefore, getNextNWeekDay } from "../utils/getWeekDays";

import { TeamStatusColumns } from "../types";

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

export const defaultTeamStatusColumns: TeamStatusColumns = [
  { id: 1, teamId: 1, name: "Custom", statusColumns: custom },
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
    statusColumnsCategoryId: 1,
    createdAt: new Date(),
    color: getRandomSpaceColor(),
    isPrivate: false,
    members: [userInfo, guestUserInfo],
    name: "sub list 1",
    creator: userInfo,
    parentFolderId: 2,
    spaceId: 1,
    taskAmount: 5,
  },
];

const allFolder2ListForTeam1: ListCategory[] = [
  {
    id: 6,
    statusColumnsCategoryId: 2,
    createdAt: new Date(),
    color: getRandomSpaceColor(),
    isPrivate: false,
    members: [userInfo, guestUserInfo],
    name: "sub list 2",
    creator: userInfo,
    parentFolderId: 2,
    spaceId: 1,
    taskAmount: 5,
  },
];

export const allSpace1ListOrFolderForTeam1: (FolderCategory | ListCategory)[] =
  [
    {
      id: 1,
      createdAt: new Date(),
      color: getRandomSpaceColor(),
      isOpen: null,
      isPrivate: true,
      members: [userInfo, guestUserInfo],
      name: "folder1-team1",
      creator: userInfo,
      spaceId: 2,
      allLists: allFolder1ListForTeam1,
      statusColumnsCategoryId: 1,
    },
    {
      id: 2,
      createdAt: new Date(),
      color: getRandomSpaceColor(),
      isOpen: null,
      isPrivate: false,
      members: [userInfo, guestUserInfo],
      name: "folder-team1",
      creator: userInfo,
      spaceId: 2,
      allLists: allFolder2ListForTeam1,
      statusColumnsCategoryId: 1,
    },
    {
      id: 3,
      statusColumnsCategoryId: 3,
      createdAt: new Date(),
      color: getRandomSpaceColor(),
      isPrivate: true,
      members: [userInfo, guestUserInfo],
      name: "list1-team1",
      creator: userInfo,
      parentFolderId: null,
      spaceId: 1,
      taskAmount: 5,
    },
    {
      id: 4,
      statusColumnsCategoryId: 4,
      createdAt: new Date(),
      color: getRandomSpaceColor(),
      isPrivate: false,
      members: [userInfo, guestUserInfo],
      name: "list2-team1",
      creator: userInfo,
      parentFolderId: null,
      spaceId: 1,
      taskAmount: 5,
    },
  ];

const allSpace2ListOrFolderForTeam1: (FolderCategory | ListCategory)[] = [
  {
    id: 7,
    statusColumnsCategoryId: 1,
    color: getRandomSpaceColor(),
    isPrivate: true,
    createdAt: new Date(),
    members: [userInfo, guestUserInfo],
    name: "list3",
    creator: userInfo,
    parentFolderId: null,
    spaceId: 3,
    taskAmount: 0,
  },
];

const allSpace2ListOrFolderForTeam2: (FolderCategory | ListCategory)[] = [
  {
    id: 50,
    createdAt: new Date(),
    color: getRandomSpaceColor(),
    isOpen: null,
    isPrivate: true,
    members: [userInfo, guestUserInfo],
    name: "folder1-team2",
    creator: userInfo,
    spaceId: 2,
    allLists: [],
    statusColumnsCategoryId: 1,
  },
  {
    id: 60,
    statusColumnsCategoryId: 1,
    color: getRandomSpaceColor(),
    isPrivate: true,
    createdAt: new Date(),
    members: [userInfo, guestUserInfo],
    name: "list1-team2",
    creator: userInfo,
    parentFolderId: null,
    spaceId: 100,
    taskAmount: 0,
  },
];

export const initialSpaceListForTeam1: Space[] = [
  {
    id: 1,
    teamId: 1,
    name: "space1-team1",
    orderIndex: 1,
    color: getRandomSpaceColor(),
    isOpen: null,
    isPrivate: false,
    allListOrFolder: allSpace1ListOrFolderForTeam1,
  },
  {
    id: 2,
    teamId: 1,
    name: "space2-team1",
    orderIndex: 2,
    isOpen: null,
    color: getRandomSpaceColor(),
    isPrivate: true,
    allListOrFolder: allSpace2ListOrFolderForTeam1,
  },
];

const initialSpaceList2ForTeam2: Space[] = [
  {
    id: 100,
    teamId: 2,
    name: "space2",
    isOpen: null,
    orderIndex: 2,
    color: getRandomSpaceColor(),
    isPrivate: true,
    allListOrFolder: allSpace2ListOrFolderForTeam2,
  },
];

export const mockUser: User = {
  id: 1,
  color: getRandomSpaceColor(),
  username: "mockUser",
  email: "",
};
const guestUser: User = {
  id: 2,
  color: getRandomSpaceColor(),
  username: "guestUser",
  email: "",
};

export const initPanelActivity: PanelActivity = {
  id: 1,
  userId: 1,
  defaultTeamId: 1,
  teamActivities: [
    {
      id: 11,
      teamId: 1,
      spaceId: 1,
      folderIds: [1, 2],
      listId: 3,
    },
    {
      id: 22,
      teamId: 2,
      spaceId: 100,
      folderIds: [50],
      listId: 60,
    },
    {
      id: 33,
      teamId: 3,
      listId: null,
      folderIds: [],
      spaceId: null,
    },
  ],
};

export const teams: Team[] = [
  {
    id: 1,
    spaces: initialSpaceListForTeam1,
    teamStatusColumns: defaultTeamStatusColumns,
    color: getRandomTeamColor(),
    owner: userInfo,
    isPrivate: false,
    name: "1",
    members: [userInfo, guestUserInfo],
  },
  {
    id: 2,
    spaces: initialSpaceList2ForTeam2,
    color: getRandomTeamColor(),
    owner: userInfo,
    teamStatusColumns: defaultTeamStatusColumns,
    isPrivate: false,
    name: "2workspace",
    members: [userInfo, guestUserInfo],
  },
  {
    id: 3,
    spaces: [],
    color: getRandomSpaceColor(),
    owner: guestUserInfo,
    teamStatusColumns: defaultTeamStatusColumns,
    isPrivate: false,
    name: "3workspace",
    members: [userInfo, guestUserInfo],
  },
];

export const defaultColumnOptions: ColumnOptions = {
  statusColumns: [],
  priorityColumns: [
    { id: 1, title: Priority.NO_PRIORITY, color: "gray.400" },
    { id: 2, title: Priority.URGENT, color: "red.400" },
    { id: 3, title: Priority.HIGH, color: "yellow.400" },
    { id: 4, title: Priority.NORMAL, color: "blue.200" },
    { id: 5, title: Priority.LOW, color: "gray.400" },
  ],
  dueDateColumns: [
    { id: 1, title: DueDateRange.NO_DUE_DATE, color: "gray.400" },
    { id: 2, title: DueDateRange.OVER_DUE, color: "gray.400" },
    { id: 3, title: CurrentWeek.MONDAY, color: "gray.400" },
    { id: 4, title: CurrentWeek.TUESDAY, color: "gray.400" },
    { id: 5, title: CurrentWeek.WEDNESDAY, color: "gray.400" },
    { id: 6, title: CurrentWeek.THURSDAY, color: "gray.400" },
    { id: 7, title: CurrentWeek.FRIDAY, color: "gray.400" },
    { id: 8, title: CurrentWeek.SATURDAY, color: "gray.400" },
    { id: 9, title: CurrentWeek.SUNDAY, color: "gray.400" },
    { id: 10, title: DueDateRange.FUTURE, color: "gray.400" },
  ],
};

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
