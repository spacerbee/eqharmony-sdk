import { Config } from '@eqharmony/core-config'

import { ITransformed } from '../Interface/ITransformed'

import { Data } from './Data'

export class Transformed extends Data<ITransformed, any> {

    constructor(
        config: Config,
        rawData: any
    ) {
        super(config, rawData)
    }

    protected setData(): ITransformed {
        return {
            id: this.dataInput.eq_id || '',
            type: this.dataInput.type || '',
            timestamp: this.dataInput.timestamp || '',
            created: this.dataInput.created || '',
            updated: this.dataInput.updated || ''
        }
    }

    protected setAction(): string {
        return 'transform-data'
    }

    public getTransformedData(): ITransformed {
        return this.data
    }

    public getData(): any {
        return this.dataInput
    }
}
