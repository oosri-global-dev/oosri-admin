import {
  CURRENT_USER,
  DRAFT_PICKS,
  NO_BUSINESS_MODAL,
  UPDATE_USER,
  SET_CURRENCY,
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

    case SET_CURRENCY:
      return {
        ...state,
        currency: payload || 'NGN',
      };

    default:
      return state;
  }
};
