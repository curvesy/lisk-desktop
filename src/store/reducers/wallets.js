import actionTypes from '../../constants/actions';

// eslint-disable-next-line max-statements
const wallets = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.setWalletsLastBalance:
      return {
        ...state,
        ...action.data,
      };
    case actionTypes.walletUpdated:
      return {
        ...state,
        ...action.data,
      };
    default:
      return state;
  }
};

export default wallets;
