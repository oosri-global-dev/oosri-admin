import {
  CURRENT_USER,
  DRAFT_PICKS,
  NO_BUSINESS_MODAL,
  UPDATE_USER,
} from './types';

export const Reducer = (state, { type, payload }) => {
  switch (type) {
    case CURRENT_USER:
      return {
        ...state,
        user: payload || undefined,
      };
    case UPDATE_USER:
      return { ...state, user: { ...state.user, ...payload } };

    case NO_BUSINESS_MODAL:
      return {
        ...state,
        showNoBusinessModal: payload || false,
      };

    default:
      return state;
  }
};
