import React, { useState, useRef, useMemo, useCallback } from "react"
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet'
import L from "leaflet"
import 'leaflet/dist/leaflet.css';
import { setCookie } from "cookies-next";

const center = {
  lat: 51.505,
  lng: -0.09,
}

var greenIcon = L.icon({
  iconUrl: '/marker.png',
  iconSize: [50, 50], // size of the icon
  iconAnchor: [20, 42], // point of the icon which will correspond to marker's location
  popupAnchor: [2, -50] // point from which the popup should open relative to the iconAnchor
});

function DraggableMarker() {
  const [draggable, setDraggable] = useState(false)
  const [position, setPosition] = useState(null)

  const map = useMapEvents({
    click() {
      map.locate()
    },
    locationfound(e) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })


  const markerRef = useRef(null)
  const eventHandlers = useMemo(
    () => ({
      dragend(e) {
        const marker = markerRef.current
        const point = e.target._latlng
        setCookie("lng",point.lng)
        setCookie("lat",point.lat)
        if (marker != null) {
          setPosition(marker.getLatLng())
        }
      },
    }),
    [],
  )
  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d)
  }, [])

  return position === null ? null : (
    <Marker
      icon={greenIcon}
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}>
      <Popup minWidth={90}>
        <span onClick={toggleDraggable}>
          {draggable
            ? 'Marker is draggable'
            : 'Click here to make marker draggable'}
        </span>
      </Popup>
    </Marker>
  )
}

const Map2 = () => {
  return (
    <MapContainer style={{minHeight:"300px" , minWidth:"300px"}} center={center} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <DraggableMarker />
    </MapContainer>
  )
}

export default Map2