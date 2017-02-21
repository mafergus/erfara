export function getUnreadMessageCount(state) {
  const { authedUser } = state;
  if (authedUser.hasOwnProperty("conversations")) {
    return Object.entries(authedUser.conversations).reduce((acc, conversationItem) => acc + getUnreadMessageCountForConversation(conversationItem[1]), 0);
  }
}

export function getUnreadMessageCountForConversation(authedUserUid, conversation) {
	if (conversation.hasOwnProperty("lastReadMessage")) {
	  const messages = Object.keys(conversation.messages)
	  const messageIdx = messages.indexOf(conversation.lastReadMessage);
    debugger;
    const trimmed = messages.splice(messageIdx, messages);
    return trimmed.reduce((acc, item) => item.from !== authedUserUid ? acc+1 : acc, 0);
	}
	return Object.keys(conversation.messages).length;
}