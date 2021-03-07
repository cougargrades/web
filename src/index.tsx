import React from 'react';
import ReactDOM from 'react-dom';

import 'firebase/performance';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import { FirebaseAppProvider, SuspenseWithPerf } from 'reactfire';
import { firebaseConfig } from './components/firebase';

//import Root from './components/root/root';
const Root = React.lazy(() => import('./components/root/root'));

ReactDOM.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <SuspenseWithPerf fallback={<div>Loading...</div>} traceId="index">
        <Root />
      </SuspenseWithPerf>
    </FirebaseAppProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
