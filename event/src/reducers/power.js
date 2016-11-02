const initialState = true;

export default (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_POWER':
      return action.power;
    default:
      return state;
  }
};
