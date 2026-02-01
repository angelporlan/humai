export const environment = {
    production: false,
    envMode: 'prod' as 'test' | 'prod',

    backendUrlTest: 'http://127.0.0.1:8000',
    backendUrlProd: 'https://api-humai.porlan.site',

    get apiUrl(): string {
        return this.envMode === 'prod' ? this.backendUrlProd : this.backendUrlTest;
    }
};
