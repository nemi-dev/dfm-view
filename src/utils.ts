/** 두 수를 더한다. */
export const add = (p: number, n: number) => p + n

/**
 * (A × B) ÷ 100 + A + B 의 값을 계산한다.  
 * 서로 복리 적용되는 +A%, +B%를 합성하여 그 증가치를 다시 퍼센트 단위로 표현한다. */
export const percent_inc_mul = (a: number, b: number) => (b + a + b * a / 100)

/** 두 배열을 결합한 새로운 배열을 만든다. */
export const combineArray = (p: string[], n: string[]) => p.concat(n)

/** 어떤 수의 소숫점을 버리고, 자릿수를 분리한다. */
export const beautyNumber = (n: number) => Math.floor(n).toLocaleString()

/** n을 100배한 후, 소숫점 둘째 자리에서 반올림하고 "%"를 붙인다. */
export const percentee = (n : number) => `${Math.round(n * 10000) / 100}%`

/** { 키: 숫자 } 형식으로 된 두 객체를 키가 같은 것들끼리 모두 더한다. */
export function add_object(p: Record<string, number>, b: Record<string, number>) {
  const prev: Record<string, number> = {...p}
  for (const key in b) {
    if (!(key in prev)) prev[key] = b[key]
    else prev[key] = prev[key] + b[key]
  }
  return prev
}

/** { 키: 숫자 } 형식으로 된 두 객체를 키가 같은 것들끼리 퍼센트 곱을 한다. */
export function mul_object(p: Record<string, number>, b: Record<string, number>) {
  const prev: Record<string, number> = {...p}
  for (const key in b) {
    if (!(key in prev)) prev[key] = b[key]
    else prev[key] = percent_inc_mul(prev[key], b[key])
  }
  return prev
}
