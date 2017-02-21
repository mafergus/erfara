export function getUnreadMessageCount(state) {
  const { authedUser } = state;
  if (authedUser.hasOwnProperty("conversations")) {
    return Object.entries(authedUser.conversations).reduce((acc, conversationItem) => acc + getUnreadMessageCountForConversation(conversationItem[1]), 0);
  }
}

export function getUnreadMessageCountForConversation(conversation) {
	if (conversation.hasOwnProperty("lastReadMessage")) {
	  const messages = Object.keys(conversation.messages)
	  const messageIdx = messages.indexOf(conversation.lastReadMessage);
	  return messages.length - messageIdx - 1;
	}
	return Object.keys(conversation.messages).length;
}