import {
  ColumnOptions,
  CurrentWeek,
  DueDateRange,
  ListCategory,
  Priority,
  StatusColumns,
  TaskList,
  User,
  UserInfo,
  FolderCategory,
  SpaceType,
} from "../types";
import { getDaysBefore, getNextNWeekDay } from "../utils/getWeekDays";
import { kanban, marketing, normal, scrum } from "./defaultStatuses";

export const statusColumns1: StatusColumns = [
  { id: 1, title: "TO_DO", color: "blue.300", orderIndex: 1 },
  { id: 3, title: "DONE", color: "green.400", orderIndex: 3 },
];

export const statusColumns2: StatusColumns = [
  { id: 1, title: "TO_DO", color: "blue.300", orderIndex: 1 },
  { id: 3, title: "DONE", color: "green.400", orderIndex: 3 },
  { id: 2, title: "IN_PROGRESS", color: "purple.400", orderIndex: 2 },
];

const userInfo: UserInfo = { userId: 1, username: "mockUser" };
const guestUserInfo: UserInfo = { userId: 2, username: "guestUser" };

const allFolder1List: ListCategory[] = [
  {
    id: 5,
    statusColumns: kanban,
    createdAt: new Date(),
    color: "green",
    isSelected: true,
    isPrivate: false,
    members: [userInfo, guestUserInfo],
    name: "sub list 1",
    owner: userInfo,
    parentFolderId: 2,
    spaceId: 1,
    taskAmount: 5,
  },
];

const allFolder15List: ListCategory[] = [
  {
    id: 6,
    statusColumns: marketing,
    createdAt: new Date(),
    color: "",
    isSelected: false,
    isPrivate: false,
    members: [userInfo, guestUserInfo],
    name: "sub list 2",
    owner: userInfo,
    parentFolderId: 2,
    spaceId: 1,
    taskAmount: 5,
  },
];

export const allSpace1ListOrFolder: (FolderCategory | ListCategory)[] = [
  {
    id: 1,
    createdAt: new Date(),
    color: "",
    isOpen: true,
    isPrivate: true,
    isSelected: false,
    members: [userInfo, guestUserInfo],
    name: "folder1",
    owner: userInfo,
    spaceId: 2,
    allLists: allFolder1List,
  },
  {
    id: 1.5,
    createdAt: new Date(),
    color: "green",
    isOpen: true,
    isPrivate: false,
    isSelected: false,
    members: [userInfo, guestUserInfo],
    name: "folder1.5",
    owner: userInfo,
    spaceId: 2,
    allLists: allFolder15List,
  },
  {
    id: 2,
    statusColumns: normal,
    createdAt: new Date(),
    color: "",
    isSelected: false,
    isPrivate: true,
    members: [userInfo, guestUserInfo],
    name: "list1",
    owner: userInfo,
    parentFolderId: null,
    spaceId: 1,
    taskAmount: 5,
  },
  {
    id: 4,
    statusColumns: scrum,
    createdAt: new Date(),
    color: "",
    isSelected: false,
    isPrivate: false,
    members: [userInfo, guestUserInfo],
    name: "list2",
    owner: userInfo,
    parentFolderId: null,
    spaceId: 1,
    taskAmount: 5,
  },
];

const allSpace2ListOrFolder: (FolderCategory | ListCategory)[] = [
  {
    id: 3,
    statusColumns: normal,
    color: "",
    isPrivate: true,
    isSelected: false,
    createdAt: new Date(),
    members: [userInfo, guestUserInfo],
    name: "list3",
    owner: userInfo,
    parentFolderId: null,
    spaceId: 3,
    taskAmount: 0,
  },
];

export const initialSpaces: SpaceType[] = [
  {
    id: 1,
    isOpen: true,
    name: "space1",
    orderIndex: 1,
    color: "green",
    isPrivate: false,
    isSelected: false,
    allListOrFolder: allSpace1ListOrFolder,
  },
  {
    id: 2,
    isOpen: false,
    name: "space2",
    orderIndex: 2,
    color: "yellow",
    isPrivate: true,
    isSelected: false,
    allListOrFolder: allSpace2ListOrFolder,
  },
];

export const mockUser: User = {
  id: 1,
  username: "mockUser",
};

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
