import { Region } from '@/types/city';
import rawLocationsData from '@/config/locations.json';

function processLocationData(rawData: any[]): Region[] {
    const regionMap = new Map<string, Region>();

    rawData.forEach(city => {
        const regionId = city.region.id;

        if (!regionMap.has(regionId)) {
            regionMap.set(regionId, {
                id: regionId,
                name: city.region.name,
                cities: [],
            });
        }

        regionMap.get(regionId)!.cities.push({
            id: city.id,
            name: city.name,
            regionId: regionId,
        });
    });

    return Array.from(regionMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name),
    );
}

export const REGIONS_AND_CITIES = processLocationData(rawLocationsData);
