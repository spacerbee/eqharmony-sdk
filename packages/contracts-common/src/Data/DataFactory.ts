import { Config } from '@eqharmony/core-config'

import { Event } from './Event'
import { Transformed } from './Transformed'

export class DataFactory {

    public static async createEvent(
        config: Config,
        rawEvent: any
    ): Promise<Event> {
        return new Event(config, rawEvent)
    }

    public static async createTransformed(
        config: Config,
        rawData: any
    ): Promise<Transformed> {
        return new Transformed(config, rawData)
    }
}
