import {Connection} from '@solana/web3.js';
import React, {

  useMemo,
  createContext,
  useContext,
} from 'react';

export const RPC_ENDPOINT = 'devnet';


export const ConnectionProvider = ({
  children,
  endpoint,
  config = {commitment: 'confirmed'},
}) => {
  const connection = useMemo(
    () => new Connection(endpoint, config),
    [endpoint, config],
  );

  return (
    <ConnectionContext.Provider value={{connection}}>
      {children}
    </ConnectionContext.Provider>
  );
};



export const ConnectionContext = createContext(
  {}
);

export function useConnection() {
  return useContext(ConnectionContext);
}
