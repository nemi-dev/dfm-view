declare interface ModalRequestForItem {
  name: "item"
  part: WholePart
  target?: "MainItem" | "Card" | "Emblem"
  index?: number | "Red" | "Green" | "Blue"
}

declare interface ModalRequestForDFClass {
  name: "dfclass"
}

declare type ModalRequest =
ModalRequestForItem
| ModalRequestForDFClass
