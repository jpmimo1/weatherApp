import { Result } from "@/types";

export interface IState {
  openCB: boolean,
  textSearch: string,
  loadingSeach: boolean,
  loadingAdd: boolean,
  placesList: Result[],
  placeSelect: Result | undefined
}

export type actions =
  { type: 'openCB - set', payload: boolean } |
  { type: 'textSearch - set', payload: string } |
  { type: 'loadingSearch - set', payload: boolean } |
  { type: 'loadingAdd - set', payload: boolean } |
  { type: 'placesList - set', payload: Result[] } |
  { type: 'placeSelect - set', payload: Result | undefined };


export const initialState: IState = {
  openCB: false,
  textSearch: '',
  loadingSeach: false,
  loadingAdd: false,
  placesList: [],
  placeSelect: undefined
};


export const reducer = (state: IState, action: actions): IState => {
  const { type, payload } = action;
  switch (type) {
    case 'openCB - set': {
      return { ...state, openCB: payload };
    }
    case 'textSearch - set': {
      return { ...state, textSearch: payload };
    }
    case 'loadingSearch - set': {
      return { ...state, loadingSeach: payload };
    }
    case 'loadingAdd - set': {
      return { ...state, loadingAdd: payload };
    }
    case 'placesList - set': {
      return { ...state, placesList: payload };
    }
    case 'placeSelect - set': {
      return { ...state, placeSelect: payload };
    }
    default: {
      return state;
    }
  }
}
