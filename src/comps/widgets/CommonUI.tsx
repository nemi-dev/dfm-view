import styled from 'styled-components'

export const Gridy = styled.div<{ columns: number, colSize?: string }>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, ${props => props.colSize ?? "auto"});
  grid-auto-rows: auto;
  gap: 2px;
`
