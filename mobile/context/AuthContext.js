import { createContext } from 'react';

const AuthContext = createContext({
  session: null,
  setSession: () => {},
});

export default AuthContext;
