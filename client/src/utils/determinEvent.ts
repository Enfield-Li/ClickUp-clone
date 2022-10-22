import {
  ASSIGNEE,
  AssignmentEvent,
  COMMENT,
  CommentEvent,
  UpdateEvent,
  WATCHER,
} from "../component/task/taskTypes";

// https://stackoverflow.com/q/69936190/16648127
export function isCommentEvent(
  event: UpdateEvent | CommentEvent | AssignmentEvent
): event is CommentEvent {
  //   return "comment" in event;
  return event.field === COMMENT;
}

export function isAssignmentEvent(
  event: UpdateEvent | CommentEvent | AssignmentEvent
): event is AssignmentEvent {
  return event.field === ASSIGNEE || event.field === WATCHER;
}
