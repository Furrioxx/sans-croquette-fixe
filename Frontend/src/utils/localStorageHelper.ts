export class localStorageHelper {
  static storeData(key: string, data: string | object | number | boolean | Array<any>) {
    let parsed = JSON.stringify(data)
    localStorage.setItem(key, parsed)
  }

  static getData(key: string) {
    const item = localStorage.getItem(key)
    if (item !== null) {
      try {
        const result = JSON.parse(item)
        return result
      } catch (e) {
        localStorage.removeItem(key)
        return null
      }
    }
  }

  static removeData(key: string) {
    localStorage.removeItem(key)
  }
}