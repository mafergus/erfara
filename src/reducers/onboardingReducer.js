
export function onboardingReducer(state = { showModal: false }, action) {
  switch (action.type) {
    case "SHOW_ONBOARDING_MODAL": return { showModal: true };
    case "HIDE_ONBOARDING_MODAL": return { showModal: false };
    default:
      return state;
  }
}