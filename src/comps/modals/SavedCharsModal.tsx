import { useCallback, useContext, useEffect } from "react"
import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../../feats/hooks"
import { CloneDF, CreateDF, LoadDF, SaveDF } from "../../feats/saveReducers"
import { RootState } from "../../feats/store"
import { equipParts, getItem } from "../../items"
import { ModalContext } from "../../modalContext"
import { DFClassIcon, ItemIcon } from "../widgets/Icons"
import { Num } from "../widgets/NumberView"
import { PlusCircle, Copy } from "react-feather"

function selectSavedChars(state: RootState) {
  return state.SavedChars.IDs.map(id => state.SavedChars.byID[id])
}


const CharSelectStyle = styled.div`
  --item-size: calc(10cqw - 10px);
  cursor: pointer;
  padding-block: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  img.DFClassIcon {
    width: 48px;
  }
  .DFCharDescribe {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .DFCharDescribeHeader {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    align-self: stretch;
  }
  .DFCharName {
    color: white;
    font-size: 1.1rem;
    font-weight: bold;
  }
  
  .SavedCharEquips {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
`
const Smaller = styled.span`
  font-size: 0.6rem;
  opacity: 0.8;
`


interface CharSelectProps {
  saved: SavedChar
  onClick: React.MouseEventHandler<HTMLDivElement>
}

function CharSelect({ saved, onClick }: CharSelectProps) {
  return (
    <CharSelectStyle className="Hovering" onClick={onClick}>
      <DFClassIcon dfclassName={saved.DFChar.Self.dfclass} />
      <div className="DFCharDescribe">
        <div className="DFCharDescribeHeader">
          <div className="DFCharName">{saved.DFChar.Self.myName}</div>
          <div>
            <Smaller>데미지=</Smaller>
            <Num className="DamageGrab" value={saved.DamageGrab} />
          </div>
        </div>
        <div className="SavedCharEquips">
          {equipParts.map(part => <ItemIcon key={part} item={getItem(saved.DFChar.Item[part])} />)}
        </div>
      </div>
    </CharSelectStyle>
  )
}

const SavedCharList = styled.div`
  overflow-y: scroll;
  height: 80cqh;
`


const SavedCharsFragmentLayout = styled.div`
  container-type: size;
  width: min(420px, calc(90vw - 20px));
  height: min(600px, calc(90vh - 60px));
`

const CreatingSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;

  > div {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 2px;
  }
`

export function SavedCharsFragment () {
  const { closeModal } = useContext(ModalContext)
  const dispatch = useAppDispatch()
  const savedChars = useAppSelector(selectSavedChars)
  
  const selectClick = useCallback((id: string) => {
    dispatch(LoadDF(id))
    closeModal()
  }, [])
  const newCharClick = useCallback(() => {
    dispatch(CreateDF())
    closeModal()
  }, [])
  const dupCharClick = useCallback(() => {
    dispatch(CloneDF())
    closeModal()
  }, [])
  useEffect(() => {
    dispatch(SaveDF())
  }, [])
  return (
    <SavedCharsFragmentLayout>
      <header>
        <h3>캐릭터 선택</h3>
      </header>
      <SavedCharList>
        {savedChars.map(saved => <CharSelect key={saved.id} saved={saved} onClick={() => selectClick(saved.id)} />)}
      </SavedCharList>
      <CreatingSection>
      <div onClick={newCharClick}><PlusCircle />캐릭터 생성하기</div>
      <div onClick={dupCharClick}><Copy />현재 캐릭터 복제</div>
      </CreatingSection>
    </SavedCharsFragmentLayout>
  )
}
