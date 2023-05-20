import memoizee from "memoizee"
import _dfclass from "../data/dfclass.json"

export const dfclass = Object.freeze(_dfclass as DFClass[])
export const dfclassNames = dfclass.map(dfc => dfc.name)

export const whois = memoizee(
  (name: DFClassName) => {
    const find =  dfclass.find(dfc => dfc.name === name)
    if (!find) throw new Error(name+" 직업이 없어요!")
    return find
  },
{ primitive: true })
