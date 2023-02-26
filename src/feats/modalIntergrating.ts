import { getCardsForPart } from "../items"
import { SetDFTitleCard, SetOtherAvatar } from "./slices/avatarSlice"
import { SetCard, SetEquip } from "./slices/equipSlice"


export const _get_card_itemarray__by_part_ = getCardsForPart

export function _action_equip_(part: WholePart, name: string) {
  switch (part) {
    case "무기아바타": case "오라": case "칭호":
      return SetOtherAvatar([part, name])
    default:
      return SetEquip([part as EquipPart, name])
  }
}

export function _action_card_(part: WholePart, name: string) {
  switch (part) {
    case "무기아바타": case "오라":
      throw new Error("어케했노 이놈아")
    case "칭호":
      return SetDFTitleCard(name)
    default:
      return SetCard([part as EquipPart, name])
  }
}