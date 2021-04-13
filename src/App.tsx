import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import ErrorBoundary from 'src/components/ErrorBoundary';
import store from 'src/store';

import Page from './pages';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <ErrorBoundary>
          <Suspense fallback={<p>Загрузка...</p>}>
            <Page />
          </Suspense>
        </ErrorBoundary>
      </Router>
    </Provider>
  );
};

export default App;
