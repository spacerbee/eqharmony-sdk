import { Client } from '@eqharmony/core-aws'
import { Config } from '@eqharmony/core-config'
import { Client as OpenSearchClient } from '@opensearch-project/opensearch'

export class ClientOpenSearch extends Client {
    protected client: OpenSearchClient

    constructor(
        config: Config
    ) {
        super(config)
        this.client = this.createClient()
    }

    protected createClient(): OpenSearchClient {
        return new OpenSearchClient({
            node: this.config.getField('OPENSEARCH_NODE'),
            cloud: {
                id: this.config.getField('OPENSEARCH_CLOUD_ID'),
                username: this.config.getField('OPENSEARCH_USERNAME'),
                password: this.config.getField('OPENSEARCH_PASSWORD')
            }
        }) as OpenSearchClient
    }

    public execute(data: any): Promise<any> {
        return this.client.search(data)
    }
}