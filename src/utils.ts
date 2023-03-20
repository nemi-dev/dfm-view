/** 적어도 하나가 true인가? (`undefined`는 false로 취급한다.) */
export const anyOf = (a: boolean = false, b: boolean = false) => a || b

/** 두 수를 더한다. "==null"인 값이 들어간 쪽은 0으로 취급한다. */
export const add = (p: number | null = 0, n: number | null = 0) => (p ?? 0) + (n ?? 0)

/**
 * (A × B) ÷ 100 + A + B 의 값을 계산한다.  
 * 서로 복리 적용되는 +A%, +B%를 합성하여 그 증가치를 다시 퍼센트 단위로 표현한다. */
export const percent_inc_mul = (a: number, b: number) => (b + a + b * a / 100)

/** 두 배열을 결합한 새로운 배열을 만든다. */
export const combineArray = (p: string[], n: string[]) => p.concat(n)

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



/** 객체를 완전 복사한다. */
export function deepCopy<T>(obj: T, path: any[] = []): T {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  let copy: any = Array.isArray(obj) ? [] : {};

  path.push(obj)
  for (let key in obj) {
    if (path.includes(obj[key])) throw Error("The object may have a circular referennce.")
    copy[key] = deepCopy(obj[key], path);
  }
  console.assert(path.pop() === obj)
  return copy;
}

/** 두 수가 (거의) 같은지 판단한다. */
export function almostEqual(a: number, b: number, t: number = 1 / 4096) {
  return Math.abs(a - b) < t
}
