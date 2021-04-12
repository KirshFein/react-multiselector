import './MultiSelector.scss';

import React, { useState } from 'react';

const fakeApi = [
  {
    id: 1,
    text: 'Test',
  },
  {
    id: 2,
    text: 'Test',
  },
  {
    id: 3,
    text: 'Test',
  },
  {
    id: 4,
    text: 'Test',
  },
  {
    id: 5,
    text: 'Test',
  },
  {
    id: 6,
    text: 'Test',
  },
  {
    id: 7,
    text: 'Test',
  },
  {
    id: 8,
    text: 'Test',
  },
  {
    id: 9,
    text: 'Test',
  },
  {
    id: 10,
    text: 'Test',
  },
];

type PropsType = {
  id: number;
  title: string;
};

export const MultiSelector: React.FC<PropsType> = () => {
  const [hide, setHide] = useState(false);

  const selectVariant = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setHide(!hide);
  };

  return (
    <form>
      <button onClick={selectVariant} className="multiSelector__selector">
        <span className={hide ? 'multiSelector__selector__text--hide' : 'multiSelector__selector__text'}>
          Choose variant
        </span>
        <span className={hide ? 'multiSelector__selector__dropdown--close ' : 'multiSelector__selector__dropdown'} />
        <span className="multiSelector__selector__del" />
        <div className="multiSelector__selector__chosen">
          <p className="multiSelector__selector__chosen__text">Test</p>
          <span className="multiSelector__selector__chosen__del" />
        </div>
      </button>
      <div className={hide ? 'multiSelector__selector__boxOutputs' : 'multiSelector__selector__boxOutputs--hide'}>
        {fakeApi.map((el) => (
          <div key={el.id}>
            <input type="checkbox" name="custom-checkbox" className="multiSelector__selector__checkbox" />
            <label htmlFor="custom-checkbox">{el.text}</label>
          </div>
        ))}
      </div>
    </form>
  );
};
