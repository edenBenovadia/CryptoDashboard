export const environments = {
    mainnet: 'mainnet',
}

export interface Token {
    name: string;
    symbol: string;
    address: string;
    quantity?: string;
    priceInDollars?: number;
    totalValueInDollars?: number;
    icon?: string;
}

export interface TokenState {
    tokensList: Token[];
    tokensEntities: Map<string, Token>;
    hasError: boolean;
}

export const eth: Token = {
    name: 'Ethereum',
    symbol: 'ETH',
    address: '',
}
