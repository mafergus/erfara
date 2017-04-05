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
	if (conversation && conversation.hasOwnProperty("lastReadMessage")) {
    const messages = Object.keys(conversation.messages)
    const messageIdx = messages.indexOf(conversation.lastReadMessage);
    const trimmed = messages.slice(messageIdx+1);
    return trimmed.reduce((acc, item) => item.from !== authedUserUid ? acc+1 : acc, 0);
	}
	return 0;
}