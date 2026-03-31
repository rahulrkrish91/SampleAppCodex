import { createContext } from 'react';

const AuthContext = createContext({
  session: null,
  setSession: () => {},
  hydrateSession: async () => false,
  logout: async () => {},
});

export default AuthContext;
