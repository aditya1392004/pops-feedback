export const reducers = {
  setMerchant(state, action) {
    const { merchant } = action.payload;
    state.merchant = merchant;
  },
  setFeedback(state, action) {
    const { feedback } = action.payload;
    state.feedback = feedback;
  }
};
