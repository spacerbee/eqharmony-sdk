import { Client } from '@eqharmony/core-aws'
import { Config } from '@eqharmony/core-config'
import axios, { Axios, AxiosInstance } from 'axios'

export class ClientHttp extends Client {
    protected client: AxiosInstance

    constructor(
        config: Config
    ) {
        super(config)
        this.client = this.createClient()
    }

    protected createClient(): AxiosInstance {
        return axios.create({
            baseURL: this.config.getField('HTTP_BASE_URL')
        })
    }

    public execute(data: any): Promise<any> {
        return this.client.request(data)
    }
}