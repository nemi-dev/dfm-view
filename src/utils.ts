

/** 두 수를 더한다. */
export const add = (p: number, n: number) => p + n

/**
 * (A × B) ÷ 100 + A + B 의 값을 계산한다.  
 * 서로 복리 적용되는 +A%, +B%를 합성하여 그 증가치를 다시 퍼센트 단위로 표현한다. */
export const percent_inc_mul = (a: number, b: number) => (b + a + b * a / 100)

/** 두 배열을 결합한 새로운 배열을 만든다. */
export const combineArray = (p: string[], n: string[]) => p.concat(n)


export const beautyNumber = (n: number) => Math.floor(n).toLocaleString()

/** n을 100배한 후, 소숫점 둘째 자리에서 반올림하고 "%"를 붙인다. */
export const percentee = (n : number) => `${Math.round(n * 10000) / 100}%`

/** 
 * 문자열이면 파일 이름으로 불가능한 문자를 뺀다.
 * 아이템이면 아이템에서 명시적으로 지정한 이미지 이름 또는 파일 이름으로 가능하게 변환된 아이템 이름을 만든다.
 */
export function im(strings: TemplateStringsArray, attrs: string | BaseAttrs) {
  if (attrs == null) return ""
  const regex = /[\<\>\:\"\'\?\*\\\/\|]/g
  if (typeof attrs === "string") return strings[0] + attrs.replace(regex, "-") + strings[1]
  if (attrs.image) return strings[0] + attrs.image + strings[1]
  else return strings[0] + attrs.name.replace(regex, "-") + strings[1]
}

