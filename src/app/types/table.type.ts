export type TableColumn = {
    header: string
    field: string, 
    type?: string,
    sortable?: boolean,
    sort?: number | null | undefined,
}

export type FilterTableEvent = {
    field: string,
    value: string | string[] | number | boolean | null | undefined,
    delay?: number
}