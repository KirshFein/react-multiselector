import axios from 'axios';
import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import ErrorBoundary from 'src/components/ErrorBoundary';
import store from 'src/store';

import MultiSelector, { ItemType } from './components/MultiSelector';

type ResourceType = {
  id: number;
  link: string;
  title: string;
};

const App: React.FC = () => {
  const [resources, setResources] = useState<ResourceType[]>([]);
  const [selectedResources, setSelectedResources] = useState<ResourceType[]>([]);
  const [selectedTitles, setSelectedTitles] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      /**
       * Такие переменные должны содержать только сам базовый url - https://xn--80adgxdjdid1ar3isb.xn--p1ai
       * А здесь переменная + конечный endpoint
       *
       * query параметры передаются вторым аргументом
       *
       * И никакого any!!!
       * Для axios тип передается generic type
       */
      const response = await axios.get<ResourceType[]>(
        `${process.env.REACT_APP_URL_ORIGIN}/resources?categories_like=education&audiences_like=children&_page=1`
      );
      setResources(response.data);
    };
    fetchData();
  }, []);

  /**
   * Нужны методы для получения выводимого текста и ключа объекта - т.к. компонент должен работать с любыми абстрактными типами
   */
  const getLabel = useCallback((item: Record<string, string | number>) => (item as ResourceType).link as string, []);
  const getValue = useCallback((item: Record<string, string | number>) => (item as ResourceType).id as number, []);

  const titles = useMemo(() => resources.map((el) => el.link), [resources]);

  return (
    <Provider store={store}>
      <Router>
        <ErrorBoundary>
          <Suspense fallback={<p>Загрузка...</p>}>
            <p>Без внешнего контроля с объектами</p>
            <MultiSelector items={resources} getLabel={getLabel} getValue={getValue} />
            <p>Без внешнего контроля со строками</p>
            <MultiSelector items={titles} />
            <p>С внешним контролем с объектами</p>
            <MultiSelector
              items={resources}
              getLabel={getLabel}
              getValue={getValue}
              onChange={setSelectedResources as (value: ItemType[]) => void}
              value={selectedResources}
            />
            <p>С внешним контролем со строками</p>
            <MultiSelector items={titles} onChange={setSelectedTitles} value={selectedTitles} />
          </Suspense>
        </ErrorBoundary>
      </Router>
    </Provider>
  );
};

export default App;
