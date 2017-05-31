import { Map } from "immutable";

export function getUnreadMessageCount(state) {
  const { authedUser } = state;
  if (authedUser.hasOwnProperty("uid")) {
    const convos = state.conversations.get("map");
    const count = convos.reduce((acc, conversationItem) => { 
      return acc + getUnreadMessageCountForConversation(authedUser.uid, conversationItem); 
    }, 0);
    return count;
  }
  return 0;
}

export function getUnreadMessageCountForConversation(authedUserUid, conversation) {
  if (conversation) {
    const messages = Object.keys(conversation.messages);
    const messageIdx = conversation.hasOwnProperty("lastReadMessage") ? messages.indexOf(conversation.lastReadMessage) : -1;
    const trimmed = messages.slice(messageIdx+1);
    return trimmed.reduce((acc, item) => item.from !== authedUserUid ? acc+1 : acc, 0);
  }
  return 0;
}

/*
 * This function takes an object of the type returned from firebase, and
 * flattens it into an array with an id for each entry
 */
export function flattenObject(toFlatten) {
  if (Object.keys(toFlatten).length === 0) { return []; }
  const flattened = Object.entries(toFlatten).map(entry => {
    return { id: entry[0], ...entry[1] };
  });
  return flattened;
}

export function flattenImmutableMap(toFlatten) {
  if (!Map.isMap(toFlatten) || toFlatten.size === 0) { return []; }
  const flattened = toFlatten.entrySeq().toArray().map(entry => {
    return { id: entry[0], ...entry[1] };
  });
  return flattened;
}

export function orderByDate(arr) {
  return arr.slice().sort((a, b) => a[1]["date"] < b[1]["date"] ? -1 : 1);
}