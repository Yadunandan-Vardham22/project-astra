import {
  createContext,
  useContext,
  useState,
} from "react";

type CosmicContextType = {
  buttonHovered: boolean;
  setButtonHovered: (value:boolean)=>void;
};

const CosmicContext =
  createContext<CosmicContextType | null>(null);


export function CosmicProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [buttonHovered, setButtonHovered] =
    useState(false);

  return (
    <CosmicContext.Provider
      value={{
        buttonHovered,
        setButtonHovered,
      }}
    >
      {children}
    </CosmicContext.Provider>
  );
}


export function useCosmic(){
  const context =
    useContext(CosmicContext);

  if(!context){
    throw new Error(
      "useCosmic must be inside CosmicProvider"
    );
  }

  return context;
}