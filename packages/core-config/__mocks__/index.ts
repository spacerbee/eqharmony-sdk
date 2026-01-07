export interface IConfig {
    getField(field: string): any;
    getAllFields(): any;
    setSource(source: any): any;
}

export class Config {
    private config: any;

    constructor(config: any) {
        this.config = config;
    }

    getField(field: string): any {
        return undefined;
    }

    getAllFields(): any {
        return {};
    }

    setSource(source: any): any {
        return {};
    }
}

