import { useContext, useCallback, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../feats/hooks"
import { SetEmblem } from "../../feats/slices/equipSlice"
import { RootState } from "../../feats/store"
import { acceptEmblem } from "../../emblem"
import { NumberInput } from "../widgets/Forms"
import { EmblemIcon } from "../widgets/Icons"
import { ModalContext } from "../../modalContext"
import { selectDFTitleEmblemSpec } from "../../feats/avatarSelectors"
import { SetDFTitleEmblem } from "../../feats/slices/avatarSlice"

export function __emblem_part_ (part: WholePart): EmblemType[] {
  switch (part) {
    case "무기": return ["Red", "Yellow", "Green", "Blue"]
    case "상의": case "하의": return ["Red"]
    case "머리어깨": case "벨트": return ["Yellow"]
    case "신발": case "팔찌": return ["Blue"]
    case "목걸이": case "반지": return ["Green"]
    case "보조장비": case "칭호": return ["Stren", "Intel", "Fire", "Ice", "Light", "Dark"]
  }
}

export function __current_emblem_spec(part: WholePart, index: number): (state: RootState) => EmblemSpec {
  return state => {
    switch (part) {
      case "칭호": return selectDFTitleEmblemSpec(state)[index] as EmblemSpec
      case "무기아바타": case "오라": throw new Error("엠블렘 어케 끼웠노")
      default:
        return state.Equips[part].emblems[index]
    }
  }
}

function EmblemSelect({ type, level }: { type: EmblemType, level: number }) {
  const { itarget: [part, target, index], setOpen } = useContext(ModalContext)
  const accept = acceptEmblem(part as EquipPart)
  const dispatch = useAppDispatch()
  const onClick = useCallback(() => {
    if (part === "칭호") dispatch(SetDFTitleEmblem([type as any, level as EmblemLevel]))
    else dispatch(SetEmblem([part as EquipPart, index, type, level]))
    setOpen(false)
  }, [part, index, type, level])
  return (
    <div className="ModalEmblemSelect" onClick={onClick}>
      <EmblemIcon spec={[type, null]} accept={accept} />
    </div>
  )
}

export function EmblemModalFragment() {
  const { itarget: [part, target, index] } = useContext(ModalContext)
  const currentSpec = useAppSelector(__current_emblem_spec(part, index))
  const [newLevel, setNewLevel] = useState(currentSpec[1])
  const availableEmblemTypes = __emblem_part_(part as EquipPart)
  return(<>
    <div style={{ marginBlockStart: "0.5rem", fontWeight: 700}}>새로 장착할 엠블렘 레벨을 입력한 후, 아래 아이콘을 누르세요</div>
    <div style={{ marginBlockEnd: "0.5rem", fontSize: "smaller" }}>{index + 1}번째 엠블렘 소켓에 장착됩니다</div>
    <div>
      엠블렘 레벨
      <NumberInput className="EmblemLevelInput" min={1} max={10} step={1} value={newLevel} onChange={v => setNewLevel(v as EmblemLevel)} />
    </div>
    <div className="EmblemSelectArray">
      {availableEmblemTypes.map((type) => (
        <EmblemSelect key={type} type={type} level={newLevel} />
      ))}
    </div>
  </>)
}