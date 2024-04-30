import { useCallback, useState } from 'react'

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
