import { Dispatch, ReactNode, createContext, useContext, useEffect, useReducer, useRef } from "react";
import { IState, actions, initialState, reducer } from "./state";
import { autocompletePlacesRequest } from "@/requests";
import { toast } from "react-toastify";

interface ContextProps extends IState {
  dispatch: Dispatch<actions>
}

const SearchPlacesContext = createContext<ContextProps>({} as ContextProps);


export const useSeachPlaces = () => {
  return useContext(SearchPlacesContext);
}

export const SearchPlacesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const idTimer = useRef<NodeJS.Timeout | undefined>();

  const { textSearch, openCB } = state;

  const getAutoCompletePlaces = async (text: string) => {
    try {
      dispatch({ type: 'loadingSearch - set', payload: true });
      const { results } = await autocompletePlacesRequest({ text });

      dispatch({ type: 'placesList - set', payload: results });
    } catch (ex) {
      toast.error('could not search the place');

    } finally {
      dispatch({ type: 'loadingSearch - set', payload: false });
    }

  };

  useEffect(() => {
    if (idTimer.current) {
      clearTimeout(idTimer.current);
    }
    idTimer.current = setTimeout(() => {
      if (textSearch.length > 2) {
        getAutoCompletePlaces(textSearch);
      } else {
        dispatch({ type: 'placesList - set', payload: [] });
      }
    }, 700);
  }, [textSearch]);

  useEffect(() => {
    if (!openCB) {
      dispatch({ type: 'placesList - set', payload: [] });
      dispatch({ type: 'textSearch - set', payload: '' });
    }
  }, [openCB])

  return (
    <SearchPlacesContext.Provider value={{ ...state, dispatch }}>
      {children}
    </SearchPlacesContext.Provider >
  );
}


