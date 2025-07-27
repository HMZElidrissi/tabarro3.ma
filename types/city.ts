export interface Region {
    id: number;
    name: string;
    nameAr: string;
    cities: City[];
}

export interface City {
    id: number;
    name: string;
    nameAr: string;
    regionId: number;
    region?: Region;
}
