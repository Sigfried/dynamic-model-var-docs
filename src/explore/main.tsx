import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import ExploreApp from './ExploreApp.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExploreApp />
  </StrictMode>,
);
