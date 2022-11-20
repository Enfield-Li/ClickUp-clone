import { AssignmentEvent, CommentEvent, TaskEvent } from "../types";

// https://stackoverflow.com/q/69936190/16648127
export function isCommentEvent(
  taskEvent: TaskEvent
): taskEvent is CommentEvent {
  //   return "comment" in event;
  return "comment" in taskEvent;
}

export function isAssignmentEvent(
  taskEvent: TaskEvent
): taskEvent is AssignmentEvent {
  return "assignedUser" in taskEvent || "assignmentAction" in taskEvent;
}
