import { ColumnOptions, DUE_DATE, PRIORITY, STATUS, TaskList } from "../types";
import { getDaysBefore, getNextNWeekDay } from "../utils/getWeekDays";

export const mockColumnOptions: ColumnOptions = {
  status: [
    { id: 1, title: "TO DO", color: "blue.300" },
    { id: 3, title: "DONE", color: "green.400", previousColumnId: 2 },
    { id: 2, title: "IN PROGRESS", color: "purple.400", previousColumnId: 1 },
  ],
  priority: [
    { id: 1, title: "NO PRIORITY", color: "gray.400" },
    { id: 2, title: "URGENT", color: "red.400" },
    { id: 3, title: "HIGH", color: "yellow.400" },
    { id: 4, title: "NORMAL", color: "blue.200" },
    { id: 5, title: "LOW", color: "gray.400" },
    { id: 0, title: "FINISHED", color: "null" },
  ],
  dueDate: [
    { id: 1, title: "NO DUE DATE", color: "gray.400" },
    { id: 2, title: "OVER DUE", color: "gray.400" },
    { id: 3, title: "MONDAY", color: "gray.400" },
    { id: 4, title: "TUESDAY", color: "gray.400" },
    { id: 5, title: "WEDNESDAY", color: "gray.400" },
    { id: 6, title: "THURSDAY", color: "gray.400" },
    { id: 7, title: "FRIDAY", color: "gray.400" },
    { id: 8, title: "SATURDAY", color: "gray.400" },
    { id: 9, title: "SUNDAY", color: "gray.400" },
    { id: 10, title: "FUTURE", color: "gray.400" },
    { id: 0, title: "FINISHED", color: "null" },
  ],
};

export const mockTaskList: TaskList = [
  {
    id: 111,
    status: 1,
    priority: 2,
    creatorId: 1,
    // dueDate: 1,
    description: "desc here",
    title: "11111",
    previousTaskIds: {},
    creatorName: "abc",
    expectedDueDate: undefined,
    createdAt: getDaysBefore(11),
    previousTaskIdsBeforeFinish: {},
    watchers: [],
    assignees: [],
    subTasks: [
      {
        id: 111222,
        status: 1,
        priority: 2,
        creatorId: 1,
        description: "desc here",
        title: "sub 1",
        previousTaskIds: {},
        creatorName: "abc",
        expectedDueDate: new Date(),
        // expectedDueDate: undefined,
        createdAt: getDaysBefore(11),
        previousTaskIdsBeforeFinish: {},
        watchers: [],
        assignees: [],
        subTasks: [],
        taskEvents: [],
      },
      {
        id: 111333,
        status: 2,
        priority: 3,
        creatorId: 1,
        description: "desc here",
        title: "sub 2",
        previousTaskIds: {},
        creatorName: "abc",
        expectedDueDate: undefined,
        createdAt: getDaysBefore(11),
        previousTaskIdsBeforeFinish: {},
        watchers: [],
        assignees: [],
        subTasks: [],
        taskEvents: [],
      },
      {
        id: 111444,
        status: 1,
        priority: 2,
        creatorId: 1,
        description: "desc here",
        title: "sub 3",
        previousTaskIds: {},
        creatorName: "abc",
        expectedDueDate: new Date(),
        // expectedDueDate: undefined,
        createdAt: getDaysBefore(11),
        previousTaskIdsBeforeFinish: {},
        watchers: [],
        assignees: [],
        subTasks: [],
        taskEvents: [],
      },
    ],
    taskEvents: [
      {
        id: 1,
        field: "comment",
        comment:
          "nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",
        reactions: [],
        taskId: 111,
        userId: 3,
        username: "user",
        createdAt: getDaysBefore(10),
        updatedAt: getDaysBefore(3),
      },
      {
        id: 9,
        field: "comment",
        comment:
          "sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
        reactions: [],
        taskId: 111,
        userId: 31,
        username: "user31",
        createdAt: getDaysBefore(10),
        updatedAt: getDaysBefore(3),
      },
      {
        id: 2,
        field: "title",
        beforeUpdate: "11112",
        afterUpdate: "11111",
        taskId: 111,
        userId: 3,
        username: "user",
        createdAt: getDaysBefore(9),
        updatedAt: getDaysBefore(1),
      },
      {
        id: 4,
        field: STATUS,
        beforeUpdate: "1",
        afterUpdate: "2",
        taskId: 111,
        userId: 2,
        username: "user2",
        createdAt: getDaysBefore(9),
        updatedAt: getDaysBefore(1),
      },
      {
        id: 3,
        field: STATUS,
        afterUpdate: "1",
        taskId: 111,
        userId: 3,
        username: "user",
        createdAt: getDaysBefore(9),
        updatedAt: getDaysBefore(1),
      },
      {
        id: 5,
        field: PRIORITY,
        beforeUpdate: "2",
        afterUpdate: "3",
        taskId: 111,
        userId: 3,
        username: "user",
        createdAt: getDaysBefore(9),
        updatedAt: getDaysBefore(1),
      },
      {
        id: 6,
        field: DUE_DATE,
        beforeUpdate: "3",
        afterUpdate: "2",
        taskId: 111,
        userId: 3,
        username: "user",
        createdAt: getDaysBefore(9),
        updatedAt: getDaysBefore(1),
      },
      {
        id: 7,
        field: "assignee",
        taskId: 111,
        userId: 3,
        username: "user",
        createdAt: getDaysBefore(9),
        updatedAt: getDaysBefore(1),
        assignmentAction: "added",
        assignedUser: { userId: 3, username: "user" },
      },
      {
        id: 8,
        field: "watcher",
        taskId: 111,
        userId: 3,
        username: "user",
        createdAt: getDaysBefore(3),
        updatedAt: getDaysBefore(1),
        assignmentAction: "removed",
        assignedUser: { userId: 4, username: "abc" },
      },
    ],
  },
  {
    id: 222,
    status: 1,
    priority: 1,
    creatorId: 1,
    // dueDate: 1,
    title: "22222",
    creatorName: "abc",
    expectedDueDate: undefined,
    createdAt: getDaysBefore(4),
    previousTaskIdsBeforeFinish: {},
    previousTaskIds: { inStatus: 111, inDueDate: 111 },

    watchers: [],
    assignees: [],
    taskEvents: [],
    subTasks: [],
  },
  {
    id: 333,
    status: 1,
    priority: 1,
    creatorId: 1,
    // dueDate: 1,
    title: "33333",
    creatorName: "abc",
    expectedDueDate: undefined,
    createdAt: getDaysBefore(4),
    previousTaskIdsBeforeFinish: {},
    previousTaskIds: { inStatus: 222, inPriority: 222, inDueDate: 222 },

    watchers: [],
    assignees: [],
    taskEvents: [],
    subTasks: [],
  },
  {
    id: 444,
    status: 1,
    priority: 1,
    creatorId: 1,
    // dueDate: 2,
    title: "44444",
    creatorName: "abc",
    createdAt: getDaysBefore(4),
    previousTaskIdsBeforeFinish: {},
    expectedDueDate: getNextNWeekDay(-5),
    previousTaskIds: { inStatus: 333, inPriority: 333 },

    watchers: [],
    assignees: [],
    taskEvents: [],
    subTasks: [],
  },
  {
    id: 555,
    status: 1,
    priority: 1,
    creatorId: 1,
    // dueDate: 2,
    title: "55555",
    creatorName: "abc",
    createdAt: getDaysBefore(4),
    previousTaskIdsBeforeFinish: {},
    expectedDueDate: getNextNWeekDay(-6),
    previousTaskIds: { inStatus: 444, inPriority: 444, inDueDate: 444 },

    watchers: [],
    assignees: [],
    taskEvents: [],
    subTasks: [],
  },
  {
    id: 666,
    status: 1,
    priority: 3,
    creatorId: 1,
    // dueDate: 1,
    title: "66666",
    creatorName: "abc",
    expectedDueDate: undefined,
    createdAt: getDaysBefore(4),
    previousTaskIdsBeforeFinish: {},
    previousTaskIds: { inStatus: 555, inPriority: 777, inDueDate: 333 },

    watchers: [],
    assignees: [],
    taskEvents: [],
    subTasks: [],
  },
  {
    id: 777,
    status: 1,
    priority: 3,
    creatorId: 1,
    // dueDate: 1,
    title: "77777",
    creatorName: "abc",
    expectedDueDate: undefined,
    createdAt: getDaysBefore(4),
    previousTaskIdsBeforeFinish: {},
    previousTaskIds: { inStatus: 666, inDueDate: 666 },

    watchers: [],
    assignees: [],
    taskEvents: [],
    subTasks: [],
  },
];
