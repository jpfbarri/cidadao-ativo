"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import type { Solicitacao } from "@/lib/api"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix for default marker icons in Next.js
const icon = L.icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const createCustomIcon = (status: string) => {
  const colors: Record<string, string> = {
    aberta: "#ef4444",
    em_andamento: "#f59e0b",
    resolvida: "#22c55e",
  }

  const color = colors[status] || "#6b7280"

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <div style="
          transform: rotate(45deg);
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 16px;
          font-weight: bold;
        ">!</div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })
}

interface SolicitacoesMapProps {
  solicitacoes: Solicitacao[]
  center?: [number, number]
  zoom?: number
}

// Component to handle map centering
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])

  return null
}

export function SolicitacoesMap({ solicitacoes, center = [-23.5505, -46.6333], zoom = 13 }: SolicitacoesMapProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "aberta":
        return "Aberta"
      case "em_andamento":
        return "Em Andamento"
      case "resolvida":
        return "Resolvida"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aberta":
        return "bg-red-500 text-white"
      case "em_andamento":
        return "bg-amber-500 text-white"
      case "resolvida":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  // Only render map on client side
  if (!isMounted) {
    return (
      <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Carregando mapa...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <MapUpdater center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {solicitacoes.map((solicitacao) => {
          // Generate coordinates based on bairro (in real app, these would come from database)
          const lat = center[0] + (Math.random() - 0.5) * 0.02
          const lng = center[1] + (Math.random() - 0.5) * 0.02

          return (
            <Marker key={solicitacao.id} position={[lat, lng]} icon={createCustomIcon(solicitacao.status)}>
              <Popup maxWidth={300}>
                <div className="p-2">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">{solicitacao.titulo}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(solicitacao.status)}`}>
                      {getStatusLabel(solicitacao.status)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{solicitacao.descricao}</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>
                      <strong>Categoria:</strong> {solicitacao.categoria}
                    </div>
                    <div>
                      <strong>Bairro:</strong> {solicitacao.bairro}
                    </div>
                    {solicitacao.vereador_nome && (
                      <div>
                        <strong>Assumida por:</strong> {solicitacao.vereador_nome}
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
