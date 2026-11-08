import { useState } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import { useDelay } from '../hooks/useDelay';
import Footer from './Footer';
import Header from './Header';
import Loader from './Loader';

function AppLayout() {
  const [footerText, setFooterText] = useState('Default Footer Text');

  const { isLoading: manualLoading, startLoader, stopLoader } = useDelay(500);

  // Automatically observe React Router navigation.
  const navigation = useNavigation();

  // const fetchers = useFetchers();

  // const fetcherLoading = fetchers.some((fetcher) => fetcher.state !== 'idle');

  // Show Loader for manual operations OR route loading.
  const showLoader = manualLoading || navigation.state !== 'idle';

  // console.log({ manualLoading, navigationState: navigation.state, showLoader });
  // console.log('AppLayout is re-rendered');

  return (
    <div className="grid h-dvh grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden">
      <Loader isLoading={showLoader} />

      <Header onLoadingStart={startLoader} onLoadingEnd={stopLoader} />

      <main className="min-h-0 overflow-hidden">
        <Outlet context={{ setFooterText, startLoader, stopLoader }} />
      </main>

      <Footer className="shrink-0" message={footerText} />
    </div>
  );
}

export default AppLayout;
