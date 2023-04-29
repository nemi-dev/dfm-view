import type { ReactNode, HTMLProps, ChangeEvent, ChangeEventHandler, PropsWithChildren } from 'react'
import { useCallback, useEffect, useId, useRef } from 'react'
import styled from 'styled-components'
import { X } from 'react-feather'

function prevent(ev : WheelEvent) {
  (ev.target as HTMLElement).blur()
}
interface NumberInputProps extends Omit<HTMLProps<HTMLInputElement>, "onChange" | "value"> {
  value: number
  onChange: (val: number) => void
}
export function NumberInput({ onWheel, value, type, onChange, ...props }: NumberInputProps) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    ref.current?.addEventListener("wheel", prevent, { passive: false })
  }, [])

  const _onChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(ev.target.value)
    if (Number.isNaN(newValue)) onChange(0)
    else onChange(newValue)

  }, [])

  return <input type="number" value={value} onChange={_onChange} ref={ref} {...props} />
}



interface LabeledInputProps extends Omit<HTMLProps<HTMLInputElement>, "label" | "value" | "onChange"> {
  label: ReactNode
  value: number
  onChange: (val: number) => void
}
export function LabeledNumberInput({ className = "", label, value, onChange, placeholder, ...props }: LabeledInputProps) {
  const id = useId()
  if (Number.isNaN(value)) value = 0
  return (
    <div className={("InputGroup FormDF " + className).trim()}>
      <label className="FormDFName" htmlFor={id}>{label}</label>
      <NumberInput className="FormDFValue Hovery" id={id} value={value} onChange={onChange} {...props} />
    </div>
  )
}

interface FlexibleTextInputProps extends Omit<HTMLProps<HTMLInputElement>, "onChange"> {
  value: string
  onChange: (v: string) => any
}

export function FlexibleTextInput({ value, onChange, style, ...props } : FlexibleTextInputProps) {
  const width = Math.max(value.length, 2).toString() + "ch"
  return (
    <input type="text" value={value} onChange={ev => onChange(ev.target.value)} {...props}
      style={{ width }}
    />
  )
}




interface DisposableInputProps {
  index: number
  value: number
  update: (a: number, b: number) => void
  del: (a: number) => void
}
export function DisposableInput({ index, value, update, del }: DisposableInputProps) {
  return (
    <div className="DisposableInput">
      <NumberInput value={value} onChange={v => update(v, index)} />
      <button onClick={() => del(index)}><X width={12} height={12} /></button>
    </div>
  )
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
`

interface SwitchProps {
  id: string
  checked: boolean
  onChange?: (b: boolean) => any
}

export function Switch({ id, checked, onChange }: SwitchProps) {
  return (
    <span>
      <input type="checkbox" checked={checked} id={id} onChange={ev => onChange?.(ev.target.checked)} />
      <CustomCheckboxView htmlFor={id} />
    </span>
  )
}


interface CheckieProps extends PropsWithChildren {
  checked?: boolean
  className?: string
  onChange?: (b: boolean) => any
  label?: ReactNode
}
const CheckieLabel = styled.label`
  border-radius: 20px;
  text-align: center;
  flex-grow: 2;
  cursor: pointer!important;
  font-weight: 600!important;
  font-size: 0.9rem!important;
  line-height: 22px!important;
  transition: color 0.1s linear;
  input[type=checkbox]:checked ~ & {
    color: rgb(255, 217, 92);
  }
  .AttrItem {
    padding-block: 0;
  }
`
export function LabeledSwitch({ className = "", checked = false, label = "", onChange }: CheckieProps) {
  const id = useId()
  return (
    <span className={"FormDF Hovery " + className}>
      <input type="checkbox" checked={checked} id={id} onChange={ev => onChange?.(ev.target.checked)} />
      <CustomCheckboxView htmlFor={id} />
      <CheckieLabel htmlFor={id}>{label}</CheckieLabel>
    </span>
  )
}






interface RadioOneProps<T extends number | string> {
  name: string
  type: "checkbox" | "radio"
  value: T
  checked: boolean
  label: string | number
  onChange: ChangeEventHandler<HTMLInputElement>
}

const CheckButtonLayout = styled.span`
  > input[type=radio], > input[type=checkbox] {

    + label {
      flex-grow: 1;
      color: white;
      font-size: 0.9rem;

      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      min-height: 26px;
      box-sizing: border-box;
    }

    &:checked + label {
      background-color: rgb(255, 217, 92);
      color: black;
    }
  }
`

function CheckButton<T extends number | string>({ name, label, value, checked, onChange }: RadioOneProps<T>) {
  return (
  <CheckButtonLayout className="FormDFValue">
    <input type="checkbox" name={name} value={value} id={`Radio-${name}-${value}`} checked={checked} onChange={onChange} />
    <label className="Hovery" htmlFor={`Radio-${name}-${value}`}>{label}</label>
  </CheckButtonLayout>
  )
}

interface RadioGroupProps<T extends number | string> {
  name: string
  groupName?: string
  className?: string
  values: T[]
  labels?: (string | number)[]
  value: T
  dispatcher: (value: T) => any
}


export function RadioGroup<T extends string | number>({ name, groupName = name, className = "", values, labels = values, value, dispatcher }: RadioGroupProps<T>) {
  const onChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    dispatcher(ev.target.value as T)
  }, [])
  return (
    <span className={"FormDF " + className}>
      <span className="FormDFName">{groupName}</span>
      {values.map((v, i) => (
        <CheckButton key={v} type="radio" name={name} label={labels[i]}
          value={v} checked={v === value} onChange={onChange} />
      ))}
    </span>
  )
}








interface CheckboxGroupProps<T extends number | string> {
  name: string
  className?: string
  values: T[]
  value: T[]
  labels?: (string | number)[]
  dispatcher: (value: T, checked: boolean) => any
}
export function CheckboxGroup<T extends string | number>({ name, className = "", values, labels = values, value, dispatcher }: CheckboxGroupProps<T>) {
  const onChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    dispatcher(ev.target.value as T, ev.target.checked)
  }, [])

  return (
    <span className={"FormDF" + className}>
      <span className="FormDFName">{name}</span>
      {values.map((v, i) => (
        <CheckButton key={v} type="checkbox" name={name} label={labels[i]} 
          value={v} checked={value.includes(v)} onChange={onChange}
         />
      ))}
    </span>
  )
}


type ButtonGroupProps<T extends string | number> = Omit<RadioGroupProps<T>, "value">
export function OneClickButtonGroup<T extends string | number>({ name, className = "", values, labels = values, dispatcher }: ButtonGroupProps<T>) {
  return (
    <span className={("OneClickGroup FormDF " + className).trim()}>
      <span className="FormDFName">{name}</span>
      {values.map((v, i) => (
        <button key={v.toString()} onClick={() => dispatcher(v)}>{labels[i]}</button>
      ))}
    </span>
  )
}
