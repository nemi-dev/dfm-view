import { cardableParts, itemIdToName, itemNameToId, wholeParts } from "../items"

function flattenItems(s: ItemsState) {
  return wholeParts.flatMap(part => {
    if (part === "정수") return s[part].map(itemNameToId)
    if (part === "아티팩트") return [
      itemNameToId(s[part].Red),
      itemNameToId(s[part].Green),
      itemNameToId(s[part].Blue)
    ]
    return itemNameToId(s[part])
  })
}

export function packItem(s: ItemsState) {
  if (!s) return null
  const prefix = 'I'.charCodeAt(0)
  const bin = Uint32Array.from([prefix, ...flattenItems(s)])
  return bin
}

export function unpackItem(bin: Uint32Array) {
  const s: Partial<ItemsState> = {}
  let uint32offset = 1
  wholeParts.forEach(part => {
    if (part === "정수") {
      const spellIDs = bin.slice(uint32offset, uint32offset + 5)
      s["정수"] = Array.from(spellIDs).map(itemIdToName)
      uint32offset += 5
    } else if (part === "아티팩트") {
      const [redId, greenId, blueId] = bin.slice(uint32offset, uint32offset + 3)
      s["아티팩트"] = {
        Red: itemIdToName(redId),
        Green: itemIdToName(greenId),
        Blue: itemIdToName(blueId)
      }
      uint32offset += 3
    } else {
      s[part] = itemIdToName(bin[uint32offset])
      uint32offset += 1
    }
  })
  return s as ItemsState
}

export function packCards(s: CardState) {
  if (!s) return null
  const prefix = 'C'.charCodeAt(0)
  const bin = Uint32Array.from([
    prefix, ...cardableParts.map(part => itemNameToId(s[part]))
  ])
  return bin
}

export function unpackCards(bin: Uint32Array) {
  const s: Partial<CardState> = {}
  for (const [index, part] of cardableParts.entries()) {
    s[part] = itemIdToName(bin[index])
  }
  return s as CardState
}
