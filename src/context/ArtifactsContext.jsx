import { createContext, useContext } from 'react';
import { useArtifacts } from '../hooks/useArtifacts';

const ArtifactsContext = createContext(null);

export function ArtifactsProvider({ children }) {
  const artifactsState = useArtifacts();
  return (
    <ArtifactsContext.Provider value={artifactsState}>{children}</ArtifactsContext.Provider>
  );
}

export function useArtifactsContext() {
  const context = useContext(ArtifactsContext);
  if (!context) throw new Error('useArtifactsContext must be used within ArtifactsProvider');
  return context;
}
