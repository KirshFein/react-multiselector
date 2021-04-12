import cn from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import style from './MultiSelector.module.scss';

export type ItemType = Record<string, string | number>;

type PropsType = (
  | {
      items: string[];
      getValue?: undefined;
      getLabel?: undefined;
      value?: string[];
      onChange?: (value: string[]) => void;
    }
  | {
      /**
       * Добавить правильную, но абстрактную типизацию
       */
      items: ItemType[];
      getValue: (v: ItemType) => string | number;
      getLabel: (v: ItemType) => string;
      value?: ItemType[];
      onChange?: (value: ItemType[]) => void;
      /**
       * А также передать различные другие пропсы
       */
    }
) &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>;

const MultiSelector: React.FC<PropsType> = ({ value, onChange, items, getLabel, getValue, className, ...props }) => {
  const [hide, setHide] = useState(true);
  const [selected, setSelected] = useState<typeof items[number][]>([]);
  const ref = useRef<HTMLDivElement>(null);

  /**
   * Где useCallback!!!!?????
   */
  const selectVariant = useCallback(() => {
    /**
     * Так надо, поэкспериментируй
     */
    setHide((prev) => !prev);
  }, []);

  /**
   * т.к. внутри могут быть и строки и объекты, нужны универсальные методы для получения ключа и текста у любой структуры данных
   */
  const getOptionalLabel = useCallback(
    (item: ItemType | string) => (typeof item === 'string' ? item : getLabel!(item)),
    [getLabel]
  );
  const getOptionalValue = useCallback(
    (item: ItemType | string) => (typeof item === 'string' ? item : getValue!(item)),
    [getValue]
  );

  /**
   * Чтобы не перерендеривать компонент постоянно при получении одних и тех же значений из вне
   */
  const checkIsChanged = useCallback(
    (prev: (ItemType | string)[], next: (ItemType | string)[]) =>
      prev
        .map((f) => getOptionalValue(f))
        .sort()
        .join('') !==
      next
        .map((f) => getOptionalValue(f))
        .sort()
        .join(''),
    []
  );

  /**
   * Нужно менять локальное значение при изменении из вне
   */
  useEffect(() => {
    if (value) setSelected((prev) => (checkIsChanged(prev, value) ? value : prev));
  }, [value]);

  /**
   * Вызывать события изменения, если оно есть
   */
  useEffect(() => {
    if (onChange) (onChange as (v: typeof selected) => void)(selected);
  }, [selected]);

  const toggleItem = useCallback((item: ItemType | string) => {
    setSelected((prev) => {
      const found = prev.find((f) => getOptionalValue(item) === getOptionalValue(f));
      if (found) return prev.filter((f) => getOptionalValue(item) !== getOptionalValue(f));
      return [...prev, item];
    });
  }, []);

  /**
   * Нужно закрывать селект, если кликнули вне него
   */
  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as HTMLDivElement)) setHide(true);
    };
    window.addEventListener('click', onClickOutside);
    return () => window.removeEventListener('click', onClickOutside);
  }, []);

  return (
    <div className={cn(style.multiSelector, className)} {...props} ref={ref}>
      <label className={style.multiSelector__selector}>
        <span
          className={`${
            selected.length ? style.multiSelector__selector__text_hide : style.multiSelector__selector__text
          }`}
        >
          Choose variant
        </span>
        <button
          type="button"
          className={`${
            hide ? style.multiSelector__selector__dropdown_close : style.multiSelector__selector__dropdown
          }`}
          onClick={selectVariant}
        >
          <span />
        </button>
        <button
          type="button"
          className={style.multiSelector__selector__del}
          onClick={() => {
            setSelected([]);
          }}
        />
        {selected.map((item) => (
          <div className={style.multiSelector__selector__chosen} key={getOptionalValue(item)}>
            <p className={style.multiSelector__selector__chosen__text}>{getOptionalLabel(item)}</p>
            <button className={style.multiSelector__selector__chosen__del} onClick={() => toggleItem(item)} />
          </div>
        ))}
      </label>
      <div
        className={cn(
          style.multiSelector__selector__boxOutputs,
          hide && style.multiSelector__selector__boxOutputs_hide
        )}
      >
        {(items as (ItemType | string)[]).map((el) => (
          <label key={getOptionalValue(el)}>
            <input
              checked={!!selected.find((f) => getOptionalValue(f) === getOptionalValue(el))}
              type="checkbox"
              name="custom-checkbox"
              className={style.multiSelector__selector__checkbox}
              onChange={() => toggleItem(el)}
            />
            <span>{getOptionalLabel(el)}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default React.memo(MultiSelector);
