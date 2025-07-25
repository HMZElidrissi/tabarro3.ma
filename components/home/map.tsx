'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { bloodCenters } from '@/config/blood-centers';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import moroccoGeoJSON from '@/config/maroc.geo.json';
import { useTheme } from 'next-themes';

const BloodCentersMap = ({ dict }: { dict: any }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const { theme } = useTheme();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const L = require('leaflet');
            require('leaflet.markercluster');

            // Create custom icon using SVG
            const customIcon = L.divIcon({
                html: `<div style="color: #dc2626; position: relative;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                    </svg>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 12px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                        </svg>
                    </div>
                </div>`,
                className: 'custom-marker',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
            });

            const mapInstance = L.map('map', {
                center: [31.7917, -7.0926],
                zoom: 6,
                minZoom: 5,
                maxZoom: 18,
            });

            const tileLayerUrl =
                theme === 'dark'
                    ? 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png'
                    : 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';

            L.tileLayer(tileLayerUrl, {
                attribution: '©OpenStreetMap, ©CartoDB',
                subdomains: 'abcd',
            }).addTo(mapInstance);

            // Add GeoJSON layer for Morocco's boundaries
            L.geoJSON(moroccoGeoJSON, {
                style: {
                    color: theme === 'dark' ? '#b91c1c' : '#ff4444',
                    weight: 2,
                    opacity: 0.6,
                    fillColor: theme === 'dark' ? '#b91c1c' : '#ff4444',
                    fillOpacity: 0.1,
                },
            }).addTo(mapInstance);

            const markerClusterGroup = L.markerClusterGroup({
                showCoverageOnHover: false,
                maxClusterRadius: 50,
                spiderfyOnMaxZoom: true,
                iconCreateFunction: function (cluster: {
                    getChildCount: () => any;
                }) {
                    const childCount = cluster.getChildCount();
                    const clusterSize = childCount < 100 ? 'small' : 'medium';
                    return L.divIcon({
                        html: `<div class="cluster-icon">${childCount}</div>`,
                        className: `custom-cluster ${clusterSize}`,
                        iconSize: L.point(40, 40),
                    });
                },
            });

            const markersList = bloodCenters.map(center => {
                const marker = L.marker([center.latitude, center.longitude], {
                    icon: customIcon,
                }).bindPopup(
                    `
                    <div class="p-3 bg-card text-foreground">
                        <h3 class="font-bold text-lg mb-2">${center.name}</h3>
                        <div class="flex flex-col gap-2">
                            <a 
                                href="https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}"
                                target="_blank"
                                rel="noopener noreferrer"
                                style="display: inline-block; background-color: #dc2626; color: white; font-weight: 500; padding: 0.5rem 1rem; border-radius: 0.375rem; text-align: center; transition: background-color 0.2s;"
                                onmouseover="this.style.backgroundColor='#b91c1c'"
                                onmouseout="this.style.backgroundColor='#dc2626'"
                            >
                                ${dict?.map.get_directions || 'Get Directions'}
                            </a>
                            <a 
                                href="${center.googleMapsLink}"
                                target="_blank"
                                rel="noopener noreferrer"
                                style="display: inline-block; background-color: #2563eb; color: white; font-weight: 500; padding: 0.5rem 1rem; border-radius: 0.375rem; text-align: center; transition: background-color 0.2s;"
                                onmouseover="this.style.backgroundColor='#1d4ed8'"
                                onmouseout="this.style.backgroundColor='#2563eb'"
                            >
                                ${dict?.map.view_on_google_maps || 'View on Google Maps'}
                            </a>
                        </div>
                    </div>
                    `,
                    {
                        maxWidth: 300,
                        className: 'blood-center-popup',
                    },
                );

                markerClusterGroup.addLayer(marker);
                return marker;
            });

            mapInstance.addLayer(markerClusterGroup);

            const moroccoBounds = L.latLngBounds(
                L.latLng(20.7717, -17.1067),
                L.latLng(35.9223, -1.0205),
            );

            mapInstance.setMaxBounds(moroccoBounds.pad(0.1));
            mapInstance.fitBounds(moroccoBounds);

            // Prevent scrolling outside bounds
            mapInstance.on('drag', () => {
                mapInstance.panInsideBounds(moroccoBounds, { animate: false });
            });

            // Add custom CSS for markers and clusters
            const style = document.createElement('style');
            style.textContent = `
                .custom-marker {
                    filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.3));
                    transition: transform 0.2s;
                }
                .custom-marker:hover {
                    transform: scale(1.1);
                }
                .custom-cluster {
                    background: ${theme === 'dark' ? '#b91c1c' : '#dc2626'};
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    border: 2px solid ${theme === 'dark' ? '#4b5563' : 'white'};
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }
                .cluster-icon {
                    width: 40px;
                    height: 40px;
                    line-height: 40px;
                    text-align: center;
                    font-size: 14px;
                }
                .blood-center-popup .leaflet-popup-content-wrapper {
                    border-radius: 8px;
                    background-color: ${theme === 'dark' ? '#1f2937' : '#ffffff'};
                    color: ${theme === 'dark' ? '#f9fafb' : '#111827'};
                }
                .blood-center-popup .leaflet-popup-tip-container {
                    margin-top: -1px;
                }
            `;
            document.head.appendChild(style);

            setMap(mapInstance);
            setMarkers(markersList as any);

            return () => {
                mapInstance.remove();
                document.head.removeChild(style);
            };
        }
    }, [dict, theme]);

    useEffect(() => {
        if (map && markers.length > 0) {
            const filteredCenters = bloodCenters.filter(center =>
                center.name.toLowerCase().includes(searchQuery.toLowerCase()),
            );

            markers.forEach((marker: any, index) => {
                const center = bloodCenters[index];
                const isVisible = filteredCenters.some(
                    fc =>
                        fc.latitude === center.latitude &&
                        fc.longitude === center.longitude,
                );

                if (isVisible) {
                    marker.addTo(map);
                } else {
                    marker.remove();
                }
            });
        }
    }, [searchQuery, map, markers]);

    return (
        <div className="py-16 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-400 dark:from-brand-400 dark:to-brand-300 mb-8">
                    {dict?.map.title || 'Blood Donation Centers'}
                </h2>

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder={
                            dict?.map.search_placeholder ||
                            'Search for a blood donation center...'
                        }
                        className="w-full max-w-md mx-auto block px-4 py-2 border rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 bg-card text-foreground"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>

                <Card className="relative overflow-hidden border">
                    <div className="absolute -inset-1 bg-gradient-to-r from-brand-100 via-brand-200 to-brand-100 dark:from-brand-900 dark:via-brand-800 dark:to-brand-900 rounded-lg blur opacity-20" />
                    <div
                        id="map"
                        className="relative w-full h-96 md:h-[600px] rounded-lg z-10"
                    />
                </Card>

                <div className="mt-4 text-sm text-muted-foreground text-center">
                    {dict?.map.legend_text ||
                        'Click on a marker to see more information and get directions'}
                </div>
            </div>
        </div>
    );
};

export default BloodCentersMap;
