import '../style/Common.scss'
import '../style/App.scss'
import '../style/Misc.scss'

import { useCallback, useContext, useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from '../feats/hooks'
import { InitChar, SyncID } from '../feats/slices/slicev5'
import store from '../feats/store'
import { PortraitMode, TabContext } from '../responsiveContext'
import { Cracks } from './Cracks'
import { CustomSkillScreen } from './CustomSkill'
import { Detail } from './Detail'
import { EnemyTarget } from './EnemyTarget'
import { Equips } from './Equips'
import { Forge } from './Forge'
import { MiscScreen } from './Misc'
import AppModal from './modals/index'
import { ModalContext, ModalContextType } from './modals/modalContext'
import { MyStat } from './MyStat'
import { StickyNav } from './StickyNav'
import { NavLink, Tab } from './widgets/Tab'
import { Skill } from './Skill'
import { ErrorBoundary } from 'react-error-boundary'
import { CommonFallbackComponent } from './CommonFallbackComponent'


function Navigator() {
  const portrait = useContext(PortraitMode)
  if (!portrait)
  return (
    <nav className="Navigator">
      <NavLink name="아이템">아이템</NavLink>
      <NavLink name="봉인석">봉인석</NavLink>
      <NavLink name="기타">기타</NavLink>
      <NavLink name="자세히">자세히</NavLink>
    </nav>
  )
  else return (
    <nav className="Navigator">
      <NavLink name="아이템">아이템</NavLink>
      <NavLink name="강화">강화</NavLink>
      <NavLink name="봉인석">봉인석</NavLink>
      <NavLink name="기타">기타</NavLink>
      <NavLink name="자세히">자세히</NavLink>
      <NavLink name="스탯 조정">스탯 조정</NavLink>
    </nav>
  )
}

function Content() {
  return (
    <>
      <Tab name="아이템"><Equips /></Tab>
      <Tab name="강화"><Forge /></Tab>
      <Tab name="봉인석"><Cracks /></Tab>
      <Tab name="기타"><MiscScreen /></Tab>
      <Tab name="자세히"><Detail /></Tab>
      <Tab name="스탯 조정"><MyStat /></Tab>
    </>
  )
}

function App() {

  const dispatch = useAppDispatch()
  const [portrait, setPortrait] = useState(window.innerWidth < 1000)
  const [activeTab, setActiveTab] = useState("아이템")
  const [isModalOpen, setOpen] = useState(false)
  const [modalFrag, setModalFrag] = useState<JSX.Element>()
  const lastIDs = useAppSelector(state => state.SavedChars.IDs)
  const rehydrated = store.getState()._persist?.rehydrated ?? true
  // const rehydrated = true

  const closeModal = useCallback(() => {
    setOpen(false)
  }, [])

  const openModal = useCallback((children: JSX.Element) => {
    setModalFrag(children)
    setOpen(true)
  }, [])

  const modalContextValue: ModalContextType = { fragment: modalFrag, closeModal, openModal, }
  
  useEffect(() => {
    function onResize(ev: UIEvent) {
      if (window.innerWidth >= 1000) setPortrait(false)
      else setPortrait(true)
    }

    if (lastIDs.length === 0) {
      dispatch(InitChar())
    }
    dispatch(SyncID())
    
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
    <ModalContext.Provider value={modalContextValue}>
    <PortraitMode.Provider value={portrait}>
      <AppModal isOpen={isModalOpen}/>
      <ErrorBoundary FallbackComponent={CommonFallbackComponent}>
      {lastIDs.length > 0 && rehydrated? <div className="App">
        <StickyNav />
        <div className="MainWrapper">
          <div className="LeftSide">
            <Navigator />
            <Content />
          </div>
          <div className="RightSide">
            {!portrait && <MyStat />}
          </div>
        </div>
        <EnemyTarget />
        <Skill />
        <CustomSkillScreen />
      </div>: null}
      </ErrorBoundary>
    </PortraitMode.Provider>
    </ModalContext.Provider>
    </TabContext.Provider>
  )
}

export default App
