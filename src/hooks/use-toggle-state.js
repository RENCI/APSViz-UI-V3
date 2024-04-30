import { useCallback, useState } from 'react'
import { useLocalStorage } from '@hooks'

export const useToggleState = (initialValue = false) => {
  const [value, setValue] = useState(initialValue)
  const toggleValue = useCallback(() => setValue(!value), [value])
  const setTrue = useCallback(() => setValue(true), [value])
  const setFalse = useCallback(() => setValue(false), [value])

  return {
    enabled: value,
    toggle: toggleValue,
    set: setTrue,
    unset: setFalse,
  }
}

export const useToggleLocalStorage = (key, initialValue = false) => {
  const [value, setValue] = useLocalStorage(key, initialValue)
  const toggleValue = useCallback(() => setValue(!value), [value])
  const setTrue = useCallback(() => setValue(true), [value])
  const setFalse = useCallback(() => setValue(false), [value])

  return {
    enabled: value,
    toggle: toggleValue,
    set: setTrue,
    unset: setFalse,
  }
}
