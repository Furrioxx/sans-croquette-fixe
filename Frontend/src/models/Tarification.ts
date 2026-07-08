export interface Tarification {
  id: number
  documentId: string
  price: number
  label: string
}

export interface TarificationPostPut {
  price: number
  label: string
}
