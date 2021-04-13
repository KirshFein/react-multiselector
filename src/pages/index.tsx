import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { ResourceType } from 'src/types/resource';

import MultiSelector, { ItemType } from '../components/MultiSelector';
import { getLabel, getValue } from '../scripts/utils';

const Page: React.FC = () => {
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

  const titles = useMemo(() => resources.map((el) => el.link), [resources]);

  return (
    <div>
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
    </div>
  );
};

export default Page;
