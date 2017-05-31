export function getUserCategories(state) {
  let userCategories = [];
  state.users.valueSeq().toArray()
  .filter(user => user.skills).forEach(user => {
    const ucat = Object.keys(user.skills).map(skillId => {
      const categoryId = state.userCategories.get(skillId).categoryId;
      const category = state.categories.get(categoryId);
      return { user: user, category: category, id: skillId };
    });
    userCategories = userCategories.concat(ucat);
  });

  return userCategories;
}