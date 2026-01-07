import { Config } from '@eqharmony/core-config'
import { Data } from '../Data/Data'

export interface IDataFactory {
    create(
        type: string,
        config: Config,
        rawData: any,
        options?: any
    ): Data<any, any>
}
