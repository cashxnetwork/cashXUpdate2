import { ColorModeScript } from '@chakra-ui/react';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { RoutesConfig } from './navigation/Routes';
import ProviderChakra from './providers/ProviderChakra';
import { ProviderDapp } from './providers/ProviderDApp';
import { ProviderWeb3Modal } from './providers/ProviderWeb3Modal';
import * as serviceWorker from './serviceWorker';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <ColorModeScript />
    <ProviderChakra>
      <ProviderDapp>
        <ProviderWeb3Modal>
          <RouterProvider router={RoutesConfig}></RouterProvider>
        </ProviderWeb3Modal>
      </ProviderDapp>
    </ProviderChakra>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.register();
