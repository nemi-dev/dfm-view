import '../style/Common.scss'
import '../style/App.scss'
import '../style/Misc.scss'

import { useCallback, useContext, useEffect, useState } from 'react'
import { Equips } from './Equips'
import { Forge } from './Forge'
import { Creatures } from './Creature'
import { Guilds } from "./Guilds"
import { Cracks } from "./Cracks"
import { Tonic } from "./Tonic"
import { Avatars } from "./Avatar"
import { PortraitMode, TabContext } from '../responsiveContext'
import AppModal from './modals/index'
import { ModalContext, ModalContextType } from "./modals/modalContext"
import { MyStat } from './MyStat'
import { SkillTestSet } from './CustomSkill'
import { StickyNav } from './StickyNav'
import { EnemyTarget } from './EnemyTarget'
import { useAppDispatch, useAppSelector } from '../feats/hooks'
import { InitChar } from '../feats/saveReducers'
import store from '../feats/store'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { Detail } from './Detail'
import { Gridy } from './widgets/CommonUI'


function NavLink({ name, children }: React.PropsWithChildren<{ name: string }> ) {
  const { activeTab, setActiveTab } = useContext(TabContext)
  const className = name === activeTab? "NavLink Active" : "NavLink"  

  const onClick = useCallback(() => {
    setActiveTab(name)
  }, [name])
  return (
    <span className={className} onClick={onClick}>{children}</span>
  )
}

function TabIsBroken({ name, error, resetErrorBoundary }: FallbackProps & { name: string }) {
  return (
    <div>
      <header>
        <h3>아구구!</h3>
        <div>{name} 탭이 고장나버렸어요! 어서 개발자에게 알려주세요!</div>
      </header>
      <div>
        <h4>{error.name}</h4>
        <div>
          <pre>{error.message}</pre>
          <pre>{error.stack}</pre>
        </div>
      </div>
      <div>
        <button onClick={resetErrorBoundary}>다시 시도</button>
      </div>
    </div>
  )
}

function Tab({ name, children }: React.PropsWithChildren<{ name: string }> ) {
  const { activeTab } = useContext(TabContext)
  if (name === activeTab) return (
    <ErrorBoundary children={children} fallbackRender={
      ({ error, resetErrorBoundary }) => 
      <TabIsBroken name={name} error={error} resetErrorBoundary={resetErrorBoundary} />
    } />
  )
  return null
}

function Navigator() {
  const portrait = useContext(PortraitMode)
  if (!portrait)
  return (
    <nav className="Navigator">
      <NavLink name="장비">장비</NavLink>
      <NavLink name="봉인석">봉인석</NavLink>
      <NavLink name="크리쳐">크리쳐</NavLink>
      <NavLink name="기타">기타</NavLink>
      <NavLink name="자세히">자세히</NavLink>
    </nav>
  )
  else return (
    <nav className="Navigator">
      <NavLink name="장비">장비</NavLink>
      <NavLink name="대장간">대장간</NavLink>
      <NavLink name="봉인석">봉인석</NavLink>
      <NavLink name="크리쳐">크리쳐</NavLink>
      <NavLink name="기타">기타</NavLink>
      <NavLink name="자세히">자세히</NavLink>
    </nav>
  )
}

function Content() {
  const portrait = useContext(PortraitMode)
  if (!portrait)
  return (
    <>
      <Tab name="장비"><Equips /></Tab>
      <Tab name="봉인석"><Cracks /></Tab>
      <Tab name="크리쳐"><Creatures /></Tab>
      <Tab name="기타">
        <Gridy columns={2} colSize='1fr'>
          <Guilds />
          <Tonic />
          <Avatars />
        </Gridy>
      </Tab>
      <Tab name="자세히"><Detail /></Tab>
    </>
  )
  else
  return (
    <>
      <Tab name="장비"><Equips /></Tab>
      <Tab name="대장간"><Forge /></Tab>
      <Tab name="봉인석"><Cracks /></Tab>
      <Tab name="크리쳐"><Creatures /></Tab>
      <Tab name="기타">
        <Guilds />
        <Tonic />
        <Avatars />
      </Tab>
      <Tab name="자세히"><Detail /></Tab>
    </>
  )
}

function App() {

  const dispatch = useAppDispatch()
  const [portrait, setPortrait] = useState(window.innerWidth < 1000)
  const [activeTab, setActiveTab] = useState("장비")
  const [isModalOpen, setOpen] = useState(false)
  const [modalFrag, setModalFrag] = useState<JSX.Element>()
  const lastIDs = useAppSelector(state => state.SavedChars.IDs)
  const rehydrated = store.getState()._persist.rehydrated


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
    
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
    <ModalContext.Provider value={modalContextValue}>
    <PortraitMode.Provider value={portrait}>
      {lastIDs.length > 0 && rehydrated? <div className="App">
        <AppModal isOpen={isModalOpen}/>
        <StickyNav />
        <div className="MainWrapper">
          <div className="LeftSide">
            <Navigator />
            <Content />
          </div>
          <div className="RightSide">
            <MyStat />
          </div>
        </div>
        <EnemyTarget />
        <SkillTestSet />
      </div>: null}
    </PortraitMode.Provider>
    </ModalContext.Provider>
    </TabContext.Provider>
  )
}

export default App
