import { lazy, Suspense, StrictMode } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import store, { persistor } from './store.js';
import Loader from './ui/Loader.jsx';

// Do not statically import App.jsx.
// Load it only when AppBootstrap renders.
const LazyApp = lazy(() => import('./App.jsx'));

// Exporting a component also satisfies the Fast Refresh
// rule that complained about the original main.jsx.
export function AppBootstrap() {
  return (
    <Suspense fallback={<Loader isLoading={true} />}>
      <LazyApp />
    </Suspense>
  );
}

ModuleRegistry.registerModules([AllCommunityModule]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<Loader isLoading={true} />} persistor={persistor}>
        <AppBootstrap />
      </PersistGate>
    </Provider>
  </StrictMode>,
);
