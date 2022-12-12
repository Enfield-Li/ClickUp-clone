import {
  ColumnOptions,
  CurrentWeek,
  DueDateRange,
  FolderCategory,
  ListCategory,
  PanelActivity,
  Priority,
  SpaceType,
  StatusColumns,
  TaskList,
  Team,
  User,
  UserInfo,
} from "../types";
import { getDaysBefore, getNextNWeekDay } from "../utils/getWeekDays";
import { defaultStatusColumnCategories } from "./defaultStatuses";

export const statusColumns1: StatusColumns = [
  { id: 1, title: "TO_DO", color: "blue.300", orderIndex: 1, teamId: 1 },
  { id: 3, title: "DONE", color: "green.400", orderIndex: 3, teamId: 1 },
];

export const statusColumns2: StatusColumns = [
  { id: 1, title: "TO_DO", color: "blue.300", orderIndex: 1, teamId: 1 },
  { id: 3, title: "DONE", color: "green.400", orderIndex: 3, teamId: 1 },
  {
    id: 2,
    title: "IN_PROGRESS",
    color: "purple.400",
    orderIndex: 2,
    teamId: 1,
  },
];

const userInfo: UserInfo = { userId: 1, username: "mockUser", email: "" };
const guestUserInfo: UserInfo = { userId: 2, username: "guestUser", email: "" };

const allFolder1ListForTeam1: ListCategory[] = [
  {
    id: 5,
    statusColumnsCategoryId: 1,
    createdAt: new Date(),
    color: "green",
    isPrivate: false,
    members: [userInfo, guestUserInfo],
    name: "sub list 1",
    owner: userInfo,
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
    color: "",
    isPrivate: false,
    members: [userInfo, guestUserInfo],
    name: "sub list 2",
    owner: userInfo,
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
      color: "",
      isOpen: null,
      isPrivate: true,
      members: [userInfo, guestUserInfo],
      name: "folder1-team1",
      owner: userInfo,
      spaceId: 2,
      allLists: allFolder1ListForTeam1,
    },
    {
      id: 2,
      createdAt: new Date(),
      color: "green",
      isOpen: null,
      isPrivate: false,
      members: [userInfo, guestUserInfo],
      name: "folder-team1",
      owner: userInfo,
      spaceId: 2,
      allLists: allFolder2ListForTeam1,
    },
    {
      id: 3,
      statusColumnsCategoryId: 3,
      createdAt: new Date(),
      color: "",
      isPrivate: true,
      members: [userInfo, guestUserInfo],
      name: "list1-team1",
      owner: userInfo,
      parentFolderId: null,
      spaceId: 1,
      taskAmount: 5,
    },
    {
      id: 4,
      statusColumnsCategoryId: 4,
      createdAt: new Date(),
      color: "",
      isPrivate: false,
      members: [userInfo, guestUserInfo],
      name: "list2-team1",
      owner: userInfo,
      parentFolderId: null,
      spaceId: 1,
      taskAmount: 5,
    },
  ];

const allSpace2ListOrFolderForTeam1: (FolderCategory | ListCategory)[] = [
  {
    id: 5,
    statusColumnsCategoryId: 1,
    color: "",
    isPrivate: true,
    createdAt: new Date(),
    members: [userInfo, guestUserInfo],
    name: "list3",
    owner: userInfo,
    parentFolderId: null,
    spaceId: 3,
    taskAmount: 0,
  },
];

const allSpace2ListOrFolderForTeam2: (FolderCategory | ListCategory)[] = [
  {
    id: 50,
    createdAt: new Date(),
    color: "",
    isOpen: null,
    isPrivate: true,
    members: [userInfo, guestUserInfo],
    name: "folder1-team2",
    owner: userInfo,
    spaceId: 2,
    allLists: [],
  },
  {
    id: 60,
    statusColumnsCategoryId: 1,
    color: "",
    isPrivate: true,
    createdAt: new Date(),
    members: [userInfo, guestUserInfo],
    name: "list1-team2",
    owner: userInfo,
    parentFolderId: null,
    spaceId: 100,
    taskAmount: 0,
  },
];

export const initialSpaceListForTeam1: SpaceType[] = [
  {
    id: 1,
    teamId: 1,
    name: "space1-team1",
    orderIndex: 1,
    color: "green",
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
    color: "yellow",
    isPrivate: true,
    allListOrFolder: allSpace2ListOrFolderForTeam1,
  },
];

const initialSpaceList2ForTeam2: SpaceType[] = [
  {
    id: 100,
    teamId: 1,
    name: "space2",
    isOpen: null,
    orderIndex: 2,
    color: "yellow",
    isPrivate: true,
    allListOrFolder: allSpace2ListOrFolderForTeam2,
  },
];

export const mockUser: User = {
  id: 1,
  username: "mockUser",
  email: "",
  joinedTeamIds: [1, 2],
};
const guestUser: User = {
  id: 2,
  username: "guestUser",
  email: "",
  joinedTeamIds: [1, 2],
};

export const initPanelActivity: PanelActivity = {
  id: 1,
  userId: 1,
  defaultTeamId: 3,
  teamActivities: [
    {
      id: 11,
      teamId: 1,
      spaceIds: [1, 2],
      folderIds: [1, 2],
      listId: 3,
    },
    {
      id: 22,
      teamId: 2,
      spaceIds: [100],
      folderIds: [50],
      listId: 60,
    },
    {
      id: 33,
      teamId: 3,
      spaceIds: [],
      folderIds: [],
      listId: null,
    },
  ],
};

export const teams: Team[] = [
  {
    id: 1,
    spaceList: initialSpaceListForTeam1,
    defaultStatusColumnCategories,
    color: "blue",
    owner: mockUser,
    isPrivate: false,
    name: "1",
    member: [mockUser, guestUser],
  },
  {
    id: 2,
    spaceList: initialSpaceList2ForTeam2,
    color: "yellow",
    owner: mockUser,
    defaultStatusColumnCategories,
    isPrivate: false,
    name: "2workspace",
    member: [mockUser, guestUser],
  },
  {
    id: 3,
    spaceList: [],
    color: "purple",
    owner: guestUser,
    defaultStatusColumnCategories,
    isPrivate: false,
    name: "3workspace",
    member: [mockUser, guestUser],
  },
];

export const staticColumnOptions: ColumnOptions = {
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
