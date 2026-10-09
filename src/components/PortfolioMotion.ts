import { createContext, useContext } from 'react';

/** Homepage visitors can control ambient motion explicitly. */
export const PortfolioMotionContext = createContext(true);
export function usePortfolioMotion(){return useContext(PortfolioMotionContext);}
