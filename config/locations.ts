import { Region } from '@/types/city';
import rawLocationsData from '@/config/locations.json';

function processLocationData(rawData: any[]): Region[] {
    const regionMap = new Map<string, Region>();

    rawData.forEach(city => {
        const regionId = city.region.id;

        if (!regionMap.has(regionId)) {
            regionMap.set(regionId, {
                id: Number(regionId),
                name: city.region.name,
                nameAr: city.region.nameAr,
                cities: [],
            });
        }

        regionMap.get(regionId)!.cities.push({
            id: Number(city.id),
            name: city.name,
            nameAr: city.nameAr,
            regionId: Number(regionId),
        });
    });

    return Array.from(regionMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name),
    );
}

function createCityLookupMap(
    regions: Region[],
): Map<number, { city: any; region: Region }> {
    const cityMap = new Map();

    regions.forEach(region => {
        region.cities.forEach(city => {
            cityMap.set(city.id, { city, region });
        });
    });

    return cityMap;
}

export const REGIONS_AND_CITIES = processLocationData(rawLocationsData);
const CITY_LOOKUP_MAP = createCityLookupMap(REGIONS_AND_CITIES);

export function getLocation(cityId: number, isRTL: boolean = false) {
    const location = CITY_LOOKUP_MAP.get(cityId);

    if (!location) {
        return null;
    }

    return {
        cityName: isRTL ? location.city.nameAr : location.city.name,
        regionName: isRTL ? location.region.nameAr : location.region.name,
    };
}
