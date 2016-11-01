const initialState = 3;

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_IMMERSION':
      return action.immersion;
    default:
      return state;
  }
};
