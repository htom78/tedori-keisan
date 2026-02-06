import { useState, useCallback } from 'react'

export function useListManager(initialItems = []) {
  const [items, setItems] = useState(initialItems)

  const addItem = useCallback((newItem) => {
    setItems((prev) => [...prev, { ...newItem, id: Date.now().toString() }])
  }, [])

  const updateItem = useCallback((id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }, [])

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const toggleField = useCallback((id, field) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: !item[field] } : item
      )
    )
  }, [])

  const replaceAll = useCallback((newItems) => {
    setItems(newItems)
  }, [])

  return {
    items,
    addItem,
    updateItem,
    removeItem,
    toggleField,
    replaceAll,
  }
}
