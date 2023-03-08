
declare interface ItemsState {
  무기: string
  상의: string
  하의: string
  머리어깨: string
  벨트: string
  신발: string
  팔찌: string
  목걸이: string
  반지: string
  보조장비: string
  칭호: string
  오라: string
  무기아바타: string
  봉인석: string
  정수: string[]
}

declare interface CardState {
  무기: string
  상의: string
  하의: string
  머리어깨: string
  벨트: string
  신발: string
  팔찌: string
  목걸이: string
  반지: string
  보조장비: string
  칭호: string
}

declare interface EmblemState {
  무기: EmblemSpec[]
  상의: EmblemSpec[]
  하의: EmblemSpec[]
  머리어깨: EmblemSpec[]
  벨트: EmblemSpec[]
  신발: EmblemSpec[]
  팔찌: EmblemSpec[]
  목걸이: EmblemSpec[]
  반지: EmblemSpec[]
  보조장비: EmblemSpec[]
  칭호: EmblemSpec[]
}

declare interface MagicPropsState {
  무기: MagicPropsCareAbout[]
  상의: MagicPropsCareAbout[]
  하의: MagicPropsCareAbout[]
  머리어깨: MagicPropsCareAbout[]
  벨트: MagicPropsCareAbout[]
  신발: MagicPropsCareAbout[]
  팔찌: MagicPropsCareAbout[]
  목걸이: MagicPropsCareAbout[]
  반지: MagicPropsCareAbout[]
  보조장비: MagicPropsCareAbout[]
  봉인석: MagicPropsCareAbout[]
}

declare interface UpgradeOrKaledoState {
  무기: number
  상의: number
  하의: number
  머리어깨: number
  벨트: number
  신발: number
  팔찌: number
  목걸이: number
  반지: number
  보조장비: number
}



declare interface MaterialState {
  상의: ArmorMaterial
  하의: ArmorMaterial
  머리어깨: ArmorMaterial
  벨트: ArmorMaterial
  신발: ArmorMaterial
}

declare type WearAvatarRarity = "Common" | "Uncommon" | "Rare"
declare type WearAvatarState = { [k in WearAvatarPart]: WearAvatarRarity }

declare interface DFCharState {
  Item?: ItemsState
  Card?: CardState
  Emblem?: EmblemState
  MagicProps?: MagicPropsState
  Upgrade?: UpgradeOrKaledoState
  Kaledo?: UpgradeOrKaledoState
  Material?: MaterialState
  Avatar?: WearAvatarState
  Tonic?: TonicState
  Guild?: GuildState
  Creature?: CreatureState
}

