import { ErrorBoundary } from "react-error-boundary"
import { useAppDispatch, useAppSelector } from "../feats/hooks"
import { PlusCircle, Copy, ChevronDown, ChevronUp, Download, Trash2 } from "react-feather"
import styled from "styled-components"
import React, { useCallback, useContext } from "react"
import { selectExpressionDamage } from "../feats/selector/selectors"
import { DeleteDFChar, MoveDFCharUp, MoveDFCharDown, CloneDF, CreateDF, LoadDF } from "../feats/slices/slicev5"
import { RootState } from "../feats/store"
import { equipParts, getItem } from "../items"
import { download } from "../utils/download"
import { DFClassIcon, ItemIcon } from "./widgets/Icons"
import { Num } from "./widgets/NumberView"
import { ModalContext } from "../feats/contexts"
import { DFClassModal } from "./modals/DFClassModal"

function selectSavedChars(state: RootState) {
  // return Object.values(state.SavedChars.byID)
  return state.SavedChars.IDs.map(id => state.SavedChars.byID[id])
}


function SavedCharsError() {
  const savedCharsObject = useAppSelector(state => state.SavedChars)
  return (<>
    <h1>이런! 캐릭터 선택창이 고장났어요!</h1>
    <div>지금 아이패드뿐이라 고치는데 걸림...ㅠㅠ</div>
    <pre>{JSON.stringify(savedCharsObject, null, 2)}</pre>
  </>
  )
}


const SavedCharList = styled.div`
  overflow-y: scroll;
  height: 80cqh;
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


const SavedCharEquips = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  @media screen and (max-width: 999px) {
    display: none;
  }
`

const CharSelectOuter = styled.div`
  --item-size: 36px;
  height: 40px;
  cursor: pointer;
  padding-block: 4px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  
  img.DFClassIcon {
    width: 35px;
  }
  .DFCharName {
    color: white;
    font-weight: bold;
    width: 100px;
    overflow-x: hidden;
    white-space: nowrap;
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
  
`

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`

const CharControlStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
`



interface CharSelectProps {
  saved: DFChar
  onClick: React.MouseEventHandler<HTMLDivElement>
}
function CharSelect({ saved, onClick }: CharSelectProps) {
  const currentID = useAppSelector(state => state.currentID)
  const dispatch = useAppDispatch()
  const expressDamage = useAppSelector(state => selectExpressionDamage(state, saved.id))
  const { openModal } = useContext(ModalContext)

  const thisIsActive = currentID === saved.id

  const askDelete = useCallback(() => {
    if (currentID === saved.id) {
      window.alert("현재 세팅중인 캐릭터는 삭제할 수 없습니다!")
      return
    }
    const answer = window.confirm("정말로 이 캐릭터를 삭제할까요? (삭제 후 취소할 수 없습니다!)")
    if (answer) {
      dispatch(DeleteDFChar(saved.id))
    }
  }, [saved.id])

  const askExport = useCallback(() => {
    const fname = `${saved.name.trim().replace(/\\\/\:\*\?"\<\>\|/g, '')} - ${saved.dfclass}.json`
    const content = JSON.stringify(saved, null, 2)
    download(fname, content, "application/json")
  }, [saved.id])

  const moveUp = useCallback(() => {
    dispatch(MoveDFCharUp(saved.id))
  }, [saved.id])

  const moveDown = useCallback(() => {
    dispatch(MoveDFCharDown(saved.id))
  }, [saved.id])

  const setupChar = useCallback((ev: React.MouseEvent) => {
    if (thisIsActive) {
      openModal(<DFClassModal id={saved.id} />)
      ev.stopPropagation()  
    }
  }, [saved.id, thisIsActive])

  const clsName = thisIsActive ? "Hovering Active" : "Hovering"

  return (
    <CharSelectOuter className={clsName} onClick={onClick}>
      <FlexRow>
        <CharControlStyle onClick={ev => ev.stopPropagation()}>
          <ChevronUp onClick={moveUp} width={20} height={20} />
          <ChevronDown onClick={moveDown} width={20} height={20}/>
        </CharControlStyle>
        <FlexRow onClick={setupChar}>
          <DFClassIcon dfclassName={saved.dfclass}/>
          <div className="DFCharName">{saved.name}</div>
        </FlexRow>
        <SavedCharEquips className="SavedCharEquips">
          {equipParts.map(part => <ItemIcon key={part} item={getItem(saved.items[part])} />)}
        </SavedCharEquips>
        <Num value={expressDamage} />
      </FlexRow>
      <FlexRow onClick={ev => ev.stopPropagation()}>
        <Download onClick={askExport} width={20} height={20} />
        <Trash2 onClick={askDelete} width={20} height={20} />
      </FlexRow>
    </CharSelectOuter>
  )
}


export function Ventures() {
  const dispatch = useAppDispatch()
  const savedChars = useAppSelector(selectSavedChars)
  
  const newCharClick = useCallback(() => {
    dispatch(CreateDF())
  }, [])
  const dupCharClick = useCallback(() => {
    dispatch(CloneDF())
  }, [])
  return (
    <div className="Ventures">
      <ErrorBoundary FallbackComponent={SavedCharsError}>
        <header>
          <h3>모험단</h3>
        </header>
        <SavedCharList>
          {savedChars.map(saved => <CharSelect key={saved.id} saved={saved} onClick={() => dispatch(LoadDF(saved.id))} />)}
        </SavedCharList>
        <CreatingSection>
        <div onClick={newCharClick}><PlusCircle />새 캐릭터</div>
        <div onClick={dupCharClick}><Copy />현재 셋팅 복제</div>
        </CreatingSection>
      </ErrorBoundary>
    </div>
  )
}