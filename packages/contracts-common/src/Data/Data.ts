import { Config } from '@eqharmony/core-config'

export abstract class Data<Type, RawType> {
    protected config: Config
    protected dataInput: RawType
    protected data: Type

    constructor(
        config: Config,
        dataInput: RawType
    ) {
        this.config = config
        this.dataInput = dataInput

        this.data = this.setData()
    }

    protected abstract setData(): Type
}