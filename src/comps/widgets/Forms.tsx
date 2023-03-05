import React, { useCallback, useEffect, useId, useState } from 'react';
import styled from 'styled-components';
import { prevent } from '../CommonUI';

interface NumberInputProps extends Omit<React.HTMLProps<HTMLInputElement>, "onChange" | "value"> {
  value: number;
  onChange: (val: number) => void;
}
export function NumberInput({ onWheel, value, type, onChange, ...props }: NumberInputProps) {
  const ref = React.useRef<HTMLInputElement>();
  React.useEffect(() => {
    ref.current.addEventListener("wheel", prevent, { passive: false });
  }, []);

  const [innerValue, setInnerValue] = useState<NumberZ>(value);
  useEffect(() => {
    if (value != 0)
      setInnerValue(value);

  }, [value]);

  const _onChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(ev.target.value);
    setInnerValue(ev.target.value as NumberZ);
    if (Number.isNaN(newValue))
      onChange(0);
    else
      onChange(newValue);

  }, []);

  return <input type="number" value={innerValue} onChange={_onChange} ref={ref} {...props} />;
}
interface LabeledInputProps extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "className" | "label" | "value" | "onChange"> {
  className?: string;
  label: string;
  value: number;
  onChange: (val: number) => void;
}
export function LabeledInput({ className = "", label, value, onChange, placeholder, ...props }: LabeledInputProps) {
  const id = useId();
  if (Number.isNaN(value))
    value = 0;
  return (
    <div className={("InputGroup FormDF " + className).trim()}>
      <label className="FormDFName" htmlFor={id}>{label}</label>
      <NumberInput className="FormDFValue Hovergraph FormDFDeepArea" id={id} value={value} onChange={onChange} placeholder={label} {...props} />
    </div>
  );
}
interface DisposableInputProps {
  index: number;
  value: number;
  update: (a: number, b: number) => void;
  del: (a: number) => void;
}
export function DisposableInput({ index, value, update, del }: DisposableInputProps) {
  return (
    <div className="DisposableInput">
      <NumberInput className="FormDFValue" value={value} onChange={v => update(v, index)} />
      <button onClick={() => del(index)}>⨯</button>
    </div>
  );
}
interface CheckieProps extends React.PropsWithChildren {
  checked?: boolean;
  className?: string;
  onChange?: (b: boolean) => any;
  label?: React.ReactNode;
}
const CustomCheckboxView = styled.label`
  cursor: pointer;
  width: 32px;
  height: 20px;
  margin-right: 3px;
  border-radius: 20px;
  background-color: rgb(71, 59, 56);
  transition: background-color 0.1s linear;
  position: relative;

  display: flex;
  align-items: center;

  input[type=checkbox]:checked + & {
    background-color: rgb(255, 217, 92);
  }

  &::before {
    display: block;
    position: relative;
    transition: 0.1s linear;
    transition-property: left;
    left: 1px;
    width: 18px;
    height: 18px;
    border-radius: 23px;
    background-color: white;
    border: 1px solid rgba(130, 74, 14, 0.5);
    box-sizing: border-box;
    content: "";
  }

  input[type=checkbox]:checked + &::before {
    left: 13px;
  }
`;
const CheckieLabel = styled.label`
  border-radius: 20px;
  cursor: pointer!important;
  font-weight: 600!important;
  font-size: 0.9rem!important;
  line-height: 22px!important;
  transition: color 0.1s linear;
  input[type=checkbox]:checked ~ & {
    color: rgb(255, 217, 92);
  }
  .AttrOne {
    padding-block: 0;
  }
`;
export function Checkie({ className = "", checked = false, label = "", onChange }: CheckieProps) {
  const id = useId();
  return (
    <span className={"FormDF Hovergraph " + className}>
      <input type="checkbox" checked={checked} id={id} onChange={ev => onChange(ev.target.checked)} />
      <CustomCheckboxView htmlFor={id}></CustomCheckboxView>
      <CheckieLabel className="FormDFName FormDFValue" htmlFor={id}>{label}</CheckieLabel>
    </span>
  );
}
interface RadioGroupProps<T extends number | string> {
  name: string;
  groupName?: string;
  className?: string;
  values: T[];
  labels?: (string | number)[];
  value: T;
  dispatcher: (value: T) => any;
}

export function RadioGroup<T extends string | number>({ name, groupName = name, className = "", values, labels = values, value, dispatcher }: RadioGroupProps<T>) {
  const onChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    dispatcher(ev.target.value as T);
  }, []);
  const id = useId();
  return (
    <span className={("RadioGroup FormDF " + className).trim()}>
      <span className="FormDFName">{groupName}</span>
      {values.map((v, i) => (
        <span key={v} className="RadioOne FormDFValue">
          <input type="radio" name={name} value={v} id={`Radio-${name}-${v}`} checked={v === value} onChange={onChange} />
          <label className="Hovergraph" htmlFor={`Radio-${name}-${v}`}>{labels[i]}</label>
        </span>
      ))}
    </span>
  );
}
interface CheckboxGroupProps<T extends number | string> {
  name: string;
  className?: string;
  values: T[];
  value: T[];
  labels?: (string | number)[];
  dispatcher: (value: T, checked: boolean) => any;
}
export function CheckboxGroup<T extends string | number>({ name, className = "", values, labels = values, value, dispatcher }: CheckboxGroupProps<T>) {
  const onChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    dispatcher(ev.target.value as T, ev.target.checked);
  }, []);

  return (
    <span className={("RadioGroup FormDF" + className).trim()}>
      <span className="FormDFName">{name}</span>
      {values.map((v, i) => (
        <span key={v} className="RadioOne FormDFValue">
          <input type="checkbox" name={name} value={v} id={`Radio-${name}-${v}`} checked={value.includes(v)} onChange={onChange} />
          <label className="Hovergraph" htmlFor={`Radio-${name}-${v}`}>{labels[i]}</label>
        </span>
      ))}
    </span>
  );
}
type ButtonGroupProps<T extends string | number> = Omit<RadioGroupProps<T>, "value">;

export function OneClickButtonGroup<T extends string | number>({ name, className = "", values, labels = values, dispatcher }: ButtonGroupProps<T>) {
  return (
    <span className={("OneClickGroup FormDF " + className).trim()}>
      <span className="FormDFName">{name}</span>
      {values.map((v, i) => (
        <button key={v.toString()} onClick={() => dispatcher(v)}>{labels[i]}</button>
      ))}
    </span>
  );
}
