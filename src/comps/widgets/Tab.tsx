import { useContext, useCallback } from "react"
import { FallbackProps, ErrorBoundary } from "react-error-boundary"
import { TabContext } from "../../feats/contexts"
import styled from "styled-components"

const NavLinkStyle = styled.span<{ active: boolean }>`
  color: white;
  cursor: pointer;
  font-weight: 800;
  text-align: center;
  height: 36px;
  line-height: 36px;
  flex-grow: 1;
  padding-inline: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 0px solid transparent;
  border-bottom: 0px solid transparent;
  transition-property: color, padding, border;
  transition-duration: 0.1s;
  transition-timing-function: linear;
  box-sizing: border-box;
  white-space: nowrap;

  ${props => props.active? `
    color: var(--color-epic);
    border-top: 4px solid transparent;
    border-bottom: 4px solid var(--color-epic);
  `: `
  &:hover {
    color: var(--color-uncommon);
    border-top: 2px solid transparent;
    border-bottom: 2px solid var(--color-uncommon);
  }
  `}
  
`

export function NavLink({ name, children }: React.PropsWithChildren<{ name: string }> ) {
  const { activeTab, setActiveTab } = useContext(TabContext)
  const onClick = useCallback(() => {
    setActiveTab(name)
  }, [name])
  return (
    <NavLinkStyle onClick={onClick} active={name === activeTab} children={children} />
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

export function Tab({ name, children }: React.PropsWithChildren<{ name: string }> ) {
  const { activeTab } = useContext(TabContext)
  if (name === activeTab) return (
    <ErrorBoundary children={children} fallbackRender={
      ({ error, resetErrorBoundary }) => 
      <TabIsBroken name={name} error={error} resetErrorBoundary={resetErrorBoundary} />
    } />
  )
  return null
}
