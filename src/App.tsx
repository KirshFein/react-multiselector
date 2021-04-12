import axios from 'axios';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import ErrorBoundary from 'src/components/ErrorBoundary';
import store from 'src/store';

import { MultiSelector } from './components/MultiSelector';

const Base = lazy(() => import('src/pages'));

const App: React.FC = () => {
  const [repo, setRepo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response: any = await axios.get(`${process.env.REACT_APP_URL_ORIGIN}`);
      setRepo(response.data);
    };
    fetchData();
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <ErrorBoundary>
          <Suspense fallback={<p>Загрузка...</p>}>
            <Base />
            <MultiSelector />
          </Suspense>
        </ErrorBoundary>
      </Router>
    </Provider>
  );
};

export default App;
