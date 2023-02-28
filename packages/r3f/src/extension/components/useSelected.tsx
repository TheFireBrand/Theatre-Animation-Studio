import {useLayoutEffect, useRef, useState} from 'react'
import {
  __private_allRegisteredObjects as allRegisteredObjects,
  __private_makeStoreKey as makeStoreKey,
} from '@theatre/r3f'
import studio from '@theatre/studio'
import type {ISheetObject} from '@theatre/core'
import type {$IntentionalAny} from '../../types'

export function useSelected(): undefined | string {
  const [state, set] = useState<string | undefined>(undefined)
  const stateRef = useRef(state)
  stateRef.current = state

  useLayoutEffect(() => {
    const setFromStudio = (selection: typeof studio.selection) => {
      const item = selection.find(
        (s): s is ISheetObject =>
          s.type === 'Theatre_SheetObject_PublicAPI' &&
          allRegisteredObjects.has(s as $IntentionalAny),
      )
      if (!item) {
        set(undefined)
      } else {
        set(makeStoreKey(item.address))
      }
    }
    setFromStudio(studio.selection)
    return studio.onSelectionChange(setFromStudio)
  }, [])

  return state
}

export function getSelected(): undefined | string {
  const item = studio.selection.find(
    (s): s is ISheetObject =>
      s.type === 'Theatre_SheetObject_PublicAPI' &&
      allRegisteredObjects.has(s as $IntentionalAny),
  )
  if (!item) {
    return undefined
  } else {
    return makeStoreKey(item.address)
  }
}
