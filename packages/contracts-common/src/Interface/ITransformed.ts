export interface ITransformed {
    id: string
    type: string
    timestamp: string
    created: string
    updated: string
}

export interface ITransformedUser extends ITransformed {
    email: string
}
