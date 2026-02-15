
export interface LocalStorageData {
  cacheLastCleared: Date;
}

export function set(key: keyof LocalStorageData, value: any) {
  if(value instanceof Date) {
    localStorage.setItem(key, value.toISOString())
  }
  else if(typeof value === 'object') {
    localStorage.setItem(key, JSON.stringify(value))
  }
  else {
    localStorage.setItem(key, value)
  }
}

export function get(key: keyof LocalStorageData): string | null {
  return localStorage.getItem(key)
}
