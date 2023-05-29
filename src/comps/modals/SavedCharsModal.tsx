import { useCallback, useContext } from "react"
import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../../feats/hooks"
import { CloneDF, CreateDF, DeleteDFChar, LoadDF } from "../../feats/slices/slicev5"
import { RootState } from "../../feats/store"
import { equipParts, getItem } from "../../items"
import { ModalContext } from "./modalContext"
import { DFClassIcon, ItemIcon } from "../widgets/Icons"
import { PlusCircle, Copy, Trash2, Download, ChevronUp, ChevronDown } from "react-feather"
import { MoveDFCharDown, MoveDFCharUp } from "../../feats/slices/slicev5"
import { selectExpressionDamage } from "../../feats/selector/selectors"
import { Num } from "../widgets/NumberView"

import { ErrorBoundary } from 'react-error-boundary'


function selectSavedChars(state: RootState) {
  return Object.values(state.SavedChars.byID)
}


const Smaller = styled.span`
  font-size: 0.6rem;
  opacity: 0.8;
`

const SavedCharEquips = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const CharSelectOuter = styled.div`
  --item-size: calc(9cqw - 10px);
  cursor: pointer;
  padding-block: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  
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
`

const CharSelectInner = styled.div`
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
  // saved: SavedChar
  saved: DFChar
  onClick: React.MouseEventHandler<HTMLDivElement>
}
function CharSelect({ saved, onClick }: CharSelectProps) {
  const currentID = useAppSelector(state => state.currentID)
  const dispatch = useAppDispatch()
  const expressDamage = useAppSelector(state => selectExpressionDamage(state, saved.id))

  const askDelete = useCallback(() => {
    if (currentID === saved.id) {
      window.alert("현재 셋팅중인 캐릭터는 삭제할 수 없습니다!")
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
    const blob = new Blob([content], { type: "application/json" })

    const a = document.createElement('a')
    a.setAttribute("download", fname)
    a.setAttribute("href", window.URL.createObjectURL(blob))
    a.click()
  }, [saved.id])

  const moveUp = useCallback(() => {
    dispatch(MoveDFCharUp(saved.id))
  }, [saved.id])

  const moveDown = useCallback(() => {
    dispatch(MoveDFCharDown(saved.id))
  }, [saved.id])
  return (
    <CharSelectOuter className="Hovering" onClick={onClick}>
      <CharSelectInner>
        <CharControlStyle onClick={ev => ev.stopPropagation()}>
          <ChevronUp onClick={moveUp} />
          <ChevronDown onClick={moveDown} />
        </CharControlStyle>
        <DFClassIcon dfclassName={saved.dfclass} />
        <div className="DFCharDescribe">
          <div className="DFCharDescribeHeader">
            <div className="DFCharName">{saved.name}</div>
            <div>
              <Smaller>데미지</Smaller>
              <Num className="DamageGrab" value={expressDamage} />
            </div>
          </div>
          <SavedCharEquips className="SavedCharEquips">
            {equipParts.map(part => <ItemIcon key={part} item={getItem(saved.items[part])} />)}
          </SavedCharEquips>
        </div>
      </CharSelectInner>
      <CharControlStyle onClick={ev => ev.stopPropagation()}>
        <Download onClick={askExport} />
        <Trash2 onClick={askDelete} />
      </CharControlStyle>
    </CharSelectOuter>
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

  svg {
    width: 18px;
    height: 18px;
    padding: 4px;
  }
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



function SavedCharsError() {
  const savedCharsObject = useAppSelector(state => state.SavedChars)
  return (<>
    <h1>이런! 캐릭터 선택창이 고장났어요!</h1>
    <div>지금 아이패드뿐이라 고치는데 걸림...ㅠㅠ</div>
    <pre>{JSON.stringify(savedCharsObject, null, 2)}</pre>
  </>
  )
}

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
  return (
  <ErrorBoundary FallbackComponent={SavedCharsError}>
    <SavedCharsFragmentLayout>
      <header>
        <h3>캐릭터 선택</h3>
      </header>
      <SavedCharList>
        {savedChars.map(saved => <CharSelect key={saved.id} saved={saved} onClick={() => selectClick(saved.id)} />)}
      </SavedCharList>
      <CreatingSection>
      <div onClick={newCharClick}><PlusCircle />새 캐릭터</div>
      <div onClick={dupCharClick}><Copy />현재 셋팅 복제</div>
      </CreatingSection>
    </SavedCharsFragmentLayout>
  </ErrorBoundary>
  )
}
