import { createContext, useContext, useReducer } from "react";
import { Reducer } from "./reducer";

export const MainContext = createContext({
  user: {},
  showNoBusinessModal: false,
});

export const MainProvider = ({ children }) => {
  const initialState = useContext(MainContext);
  const [state, dispatch] = useReducer(Reducer, initialState);

  return (
    <MainContext.Provider value={{ state, dispatch }}>
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => {
  const context = useContext(MainContext);
  if (context === undefined) {
    throw new Error("useMainContext must be used within a MainProvider");
  }
  return context;
};
