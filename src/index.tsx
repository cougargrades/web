import React from 'react';
import ReactDOM from 'react-dom';
//import Root from './components/root/root';
const Root = React.lazy(() => import('./components/root/root'));

ReactDOM.render(
  <React.StrictMode>
    <React.Suspense fallback={<div>Loading...</div>}>
      <Root />
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
