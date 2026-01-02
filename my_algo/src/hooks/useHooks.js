import { useMemo, useCallback } from 'react'

function useHooks({ hookType, input, dependencies = [] }) {
  // If input is a function, treat it as a callback
  if (hookType === 'callback') {
    return useCallback(input, dependencies)
  }
  if (hookType === 'memo') {
    return useMemo(() => input, dependencies)
  }
  // Otherwise, treat it as a value for memoization
  return null
}

export default useHooks
