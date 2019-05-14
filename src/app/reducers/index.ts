import * as fromQuote from './quote.reducer';

import { ActionReducer, StoreModule, combineReducers } from '@ngrx/store';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterStoreModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { compose } from '@ngrx/core';
import { environment } from '../../environments/environment';
import { storeFreeze } from 'ngrx-store-freeze';

export interface State {
  quote: fromQuote.State;
}

const initialState: State = {
  quote: fromQuote.initialState
};

const reducers = {
  quote: fromQuote.reducer,
};

const productionReducers: ActionReducer<State> = combineReducers(reducers);
const developmentReducers: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers);

export function reducer(state = initialState, action: any): State {
  return environment.production ? productionReducers(state, action) : developmentReducers(state, action);
}


@NgModule({
  imports: [
    BrowserModule,
    StoreModule.provideStore(reducer),
    RouterStoreModule.connectRouter(),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
  ]
})
export class AppStoreModule {}
