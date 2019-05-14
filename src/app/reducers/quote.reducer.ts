import * as quoteAction from '../actions/quote.action';

import { Quote } from '../domain/quote.model';

export interface State {
  quote: Quote;
}

export const initialState: State = {
  quote: {
    cn: '满足感在于不断的努力，而不是现有的成就。全新努力定会胜利满满。',
    en: 'Satisfaction lies in the effort, not in the attainment. Full effort is full',
    pic: 'assets/img/quote_fallback.jpg'
  }
};

export function reducer(state = initialState, action: {type: string, payload: any}): State {
  switch (action.type) {
    case quoteAction.QUOTE_SUCCESS: {
      return {...state, quote: action.payload};
    }
    case quoteAction.QUOTE_FAIL:
    default: {
      return state;
    }
  }
}
