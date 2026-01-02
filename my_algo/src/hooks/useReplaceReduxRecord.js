import { useSelector } from 'react-redux'
import { get } from 'lodash'

const useReplaceReduxRecord = ({ despatchFun, action = 'update' }) => {
  const fullState = useSelector(state => state)

  return ({ pathArray = [], uniqueKey = 'id', uniqueValue, newRecord, recordListKey, directPush = false }) => {
    const list = get(fullState, pathArray)

    if (!Array.isArray(list)) {
      console.error('Target path is not an array:', pathArray.join('.'))
      return
    }
    let newList = []

    if (action == 'update') {
      newList = list.map(item => {
        const matchKey = item[uniqueKey] == uniqueValue
        return matchKey ? { ...item, ...newRecord } : item
      })
    } else if (action == 'delete') {
      newList = list.filter(item => item[uniqueKey] != uniqueValue)
    }

    // Dispatch updated list to Redux
    // Special handling for known reducers like providersList
    const lastKey = pathArray[pathArray.length - 1]
    const parentPath = pathArray.slice(0, -1)
    const parentData = get(fullState, parentPath)

    // if (lastKey === 'data' && pathArray.includes(recordListKey)) {
    if (pathArray.includes(recordListKey)) {
      // Only update `data`, preserve rest of `providersList`
      if (directPush) {
        despatchFun(newList)
      } else {
        despatchFun({ ...parentData, data: newList })
      }
    } else {
      console.error('Reducer not defined for path:', pathArray.join('.'))
    }
  }
}

export default useReplaceReduxRecord
