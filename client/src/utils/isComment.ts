import { COMMENT, CommentEvent, UpdateEvent } from "../component/task/Data";

// https://stackoverflow.com/q/69936190/16648127
export function isCommentEvent(
  event: UpdateEvent | CommentEvent
): event is CommentEvent {
  return event.field === COMMENT;
  //   return "comment" in event;
}
