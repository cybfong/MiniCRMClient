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

  // Show Loader for manual operations OR route loading.
  const showLoader = manualLoading || navigation.state !== 'idle';

  // console.log({ manualLoading, navigationState: navigation.state, showLoader });
  // console.log('AppLayout is re-rendered');

  return (
    <div className="grid h-screen grid-rows-[auto_1fr_auto]">
      <Loader isLoading={showLoader} />

      <Header onLoadingStart={startLoader} onLoadingEnd={stopLoader} />

      <div>
        <main>
          <Outlet context={{ setFooterText, startLoader, stopLoader }} />
        </main>
      </div>

      <Footer message={footerText} />
    </div>
  );
}

export default AppLayout;
