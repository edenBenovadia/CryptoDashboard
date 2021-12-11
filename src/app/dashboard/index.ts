export const environments = {
    mainnet: 'mainnet',
}

export const tokenAddresses = [
    '0xAa6E8127831c9DE45ae56bB1b0d4D4Da6e5665BD',
    '0x514910771af9ca656af840dff83e8264ecf986ca',
    '0xf418588522d5dd018b425e472991e52ebbeeeeee',
    '0xec67005c4e498ec7f55e092bd1d35cbc47c91892',
    '0x383518188c0c6d7730d91b2c03a03c837814a899',
    '0x408e41876cccdc0f92210600ef50372656052a38',
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
];

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
}

export const eth: Token = {
    name: 'Ethereum',
    symbol: 'ETH',
    address: '',
}
