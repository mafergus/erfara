export function getUnreadMessages(state) {
  const { authedUser } = state;
  const messages = [];
  if (authedUser.hasOwnProperty("conversations")) {
    Object.entries(authedUser.conversations).map(conversationItem => {
      const values = Object.values(conversationItem[1].messages);
      messages.push(...values);
    });
  }
  return messages && messages.reduce((acc, item) => item.isRead ? acc : acc+1, 0);
}