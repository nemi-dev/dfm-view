import { createSelector } from "@reduxjs/toolkit"

import { avatarParts, rareSet, UncommonSet, getAvatarAttr } from "../avatar"
import { combine } from "../attrs"
import { getEmblem } from "../emblem"
import { getItem } from "../items"
import { RootState } from "./store"
import { selectEmblemSpecs, selectItem } from "./selectors"
