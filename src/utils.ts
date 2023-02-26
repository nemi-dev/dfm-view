
export const signed = (n: number)=> {
  n = Math.round(n * 100) / 100
  return (n > 0) ? `+${n}` : `${n}`
}

export const beautyNumber = (n: number) => Math.floor(n).toLocaleString()

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


export function explode(val: number, is: "stat" | "atk" | "el_all"): BaseAttrs {
  switch(is) {
    case "stat": return { strn: val, intl: val, vit: val, psi: val }
    case "atk": return { atk_ph: val, atk_mg: val }
    case "el_all": return { el_fire: val, el_ice: val, el_lght: val, el_dark: val }
  }
}