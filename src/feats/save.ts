import { createTransform } from "redux-persist";
import { RootState } from "./store";

/** 현재 State에서 착용 아이템 이름을 모조리 선택한다. */
export function packMainItem({
  Equips: { 무기, 상의, 하의, 머리어깨, 벨트, 신발, 팔찌, 목걸이, 반지, 보조장비, 봉인석, 칭호 },
  Avatar: { 오라, 무기아바타 },
}: RootState) {
  const order = [무기, 상의, 하의, 머리어깨, 벨트, 신발, 팔찌, 목걸이, 반지, 보조장비, 봉인석, 칭호, 오라, 무기아바타 ]
  return order.map(part => typeof part === "object"? part.name : part)
}

/** 현재 State에서 착용 카드 이름을 모조리 선택한다. */
export function packCard({
  Equips: { 무기, 상의, 하의, 머리어깨, 벨트, 신발, 팔찌, 목걸이, 반지, 보조장비, 칭호 }
}: RootState) {
  const order = [무기, 상의, 하의, 머리어깨, 벨트, 신발, 팔찌, 목걸이, 반지, 보조장비, 칭호]
  return order.map(part => part.card)
}

/** 현재 State에서 착용 엠블렘 스펙을 모조리 선택한다. */
export function packEmblem({
  Equips: { 무기, 상의, 하의, 머리어깨, 벨트, 신발, 팔찌, 목걸이, 반지, 보조장비, 칭호 }
}: RootState) {
  const order = [무기, 상의, 하의, 머리어깨, 벨트, 신발, 팔찌, 목걸이, 반지, 보조장비, 칭호]
  return order.map(part => part.emblems.map(emblemSpec => emblemSpec.join()))
}

/** 현재 State에서 마법봉인을 모조리 선택한다. */
export function packMagicProps({
  Equips: { 무기, 상의, 하의, 머리어깨, 벨트, 신발, 팔찌, 목걸이, 반지, 보조장비, 봉인석 }
}: RootState) {
  const order = [무기, 상의, 하의, 머리어깨, 벨트, 신발, 팔찌, 목걸이, 반지, 보조장비, 봉인석]
  return order.map(part => part.magicProps)
}

/** 현재 State에서 장비 강화 보너스를 모조리 선택한다. */
export function packUpgrade({
  Equips: { 무기, 상의, 하의, 머리어깨, 벨트, 신발, 팔찌, 목걸이, 반지, 보조장비 }
}: RootState) {
  const order = [무기, 상의, 하의, 머리어깨, 벨트, 신발, 팔찌, 목걸이, 반지, 보조장비]
  return order.map(part => part.upgrade)
}

/** 현재 State에서 방어구 재질을 얻는다. */
export function packMaterial({
  Equips: { 상의, 하의, 머리어깨, 벨트, 신발 }
}: RootState) {
  const order = [상의, 하의, 머리어깨, 벨트, 신발]
  return order.map(part => part.material)
}

export function packAvatars({
  Avatar: { 모자, 얼굴, 상의, 목가슴, 신발, 머리, 하의, 허리 }
}: RootState) {
  return [모자, 얼굴, 상의, 목가슴, 신발, 머리, 하의, 허리]
}

interface PersistedState {
  name: string
  dfclass: string
  level: number
  achieveLevel: number
  MainItem: string[]
  Card: string[]
  Emblem: string[][]
  MagicProps: MagicPropsCareAbout[][]
  Upgrade: number[]
  Material: ArmorMaterial[]
  Spells: string[]
  Avatars: ("Uncommon"|"Rare")[]
  Guild: GuildState
  Creature: CreatureState
  Tonic: TonicState
  Switch: ConditionalSelectors
}
