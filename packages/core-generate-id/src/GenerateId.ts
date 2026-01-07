import { Config } from '@eqharmony/core-config'

import { v5 as uuidv5 } from 'uuid'

export class GenerateId {
    config: Config
    namespace: string = uuidv5.DNS

    constructor(
        config: Config
    ) {
        this.config = config
        this.namespace = this.setNamespace()
    }

    protected setNamespace(): string {
        try {
            const namespace = this.config.getField('EQH_NAMESPACE')
            return uuidv5('eqharmony.com', uuidv5.DNS);
        } catch (error) {
            console.error('Error setting namespace >>> ', error)
            throw error
        }
    }

    /**
     * Generate an immutable, namespaced UUIDv5 for a given entity type.
     *
     * @param entityType - e.g. 'user', 'horse', 'barn'
     * @param seed - optional unique string. If not provided, a random timestamp-based seed is used
     */
    public generateId(
        type: string,
        email: string
    ): string {
        if (!type || !email) {
            throw new Error('Type and email are required')
        }

        if (type !== 'user' && type !== 'trainer' && type !== 'barn' && type !== 'business') {
            throw new Error('Invalid type')
        }

        return uuidv5(`${type}:${email}`, this.namespace)
    }
}