export interface CurrencyInterface {
    success?: boolean;
    currencyData?: CurrencyDataInterface | [];
    settingData?: settingDataInterface | [];
    taxidoSettingData?: taxidoSettingDataInterface | [];
    languageData?: languageDataInterface;
    translateData?: translateInterface;
    loading?: boolean;
    serverStatus?: null
}


export interface taxidoSettingDataInterface {

}

export interface translateInterface {

}


export interface CurrencyDataInterface {
    id: number,
    code: string,
    symbol: string,
    no_of_decimal: number,
    exchange_rate: string,
    symbol_position: string,
    thousands_separator: string,
    decimal_separator: string,
    system_reserve: number,
    status: number,
    created_by_id: string,
    created_at: string,
    updated_at: string,
    deleted_at: string
}

export interface addressInterface {
    success?: boolean;
    addressData?: AddressDataInterface;
    loading?: boolean
}

export interface AddressDataInterface {
    message: string,
    address: AddressValueInterface
}

export interface AddressValueInterface {
    user_id: number,
    latitude: string,
    longitude: string,
    postal_code: string,
    country_id: number,
    status: number,
    state_id: number,
    address: string,
    city: string,
    is_primary: string,
    updated_at: string,
    created_at: string,
    id: number
}


export interface settingDataInterface {
    id: number
}



export interface languageDataInterface {

}