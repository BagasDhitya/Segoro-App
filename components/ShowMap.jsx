import React, { useEffect, useState } from "react"
import { MapContainer, useMapEvents, TileLayer, Marker, Popup } from 'react-leaflet'
import L from "leaflet"
import 'leaflet/dist/leaflet.css';

var greenIcon = L.icon({
    iconUrl: '/marker.png',
    iconSize: [50, 50], // size of the icon
    iconAnchor: [20, 42], // point of the icon which will correspond to marker's location
    popupAnchor: [2, -50] // point from which the popup should open relative to the iconAnchor
});

function LocationMarker({ center }) {
    const map = useMapEvents({
        click() {
            map.flyTo(center, map.getZoom())
        }
    })

    return center === null ? null : (
        <Marker
            icon={greenIcon}
            position={[center.lat, center.lng]}>
            <Popup>
                Your Location <br />
            </Popup>
        </Marker>
    )
}

const ShowMap = ({ marker }) => {
    const [center, setCenter] = useState({
        lat: 0,
        lng: 0
    })
    useEffect(() => {
        setCenter({ ...center, lat: marker.latitude, lng: marker.longitude })
    }, [center, marker.latitude, marker.longitude])

    return (
        <>
            {center.lat === undefined ? <p>Hello</p> :
                <MapContainer style={{ minHeight: "450px", minWidth: "300px" }} center={[-6.175392, 106.827153]} zoom={13} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker center={center} />
                </MapContainer>
            }
        </>
    )
}

export default ShowMap

