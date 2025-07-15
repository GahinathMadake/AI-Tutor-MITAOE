import { useContext } from 'react';
import { TestContext } from '../context/TestContext';
import type { TestContextType } from '../types/test';

export const useTest = (): TestContextType => {
  const context = useContext(TestContext);
  
  if (!context) {
    throw new Error('useTest must be used within a TestProvider');
  }
  
  return context;
};