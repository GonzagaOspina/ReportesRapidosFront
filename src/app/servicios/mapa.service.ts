import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import mapboxgl, { LngLatLike } from 'mapbox-gl';

@Injectable({ providedIn: 'root' })
export class MapaService {
  mapa: any;
  marcadores: any[] = [];
  posicionActual: LngLatLike = [-75.67270, 4.53252];

  constructor() {}

  public crearMapa() {
    this.mapa = new mapboxgl.Map({
      accessToken: 'pk.eyJ1IjoiZ29uemFnYW9zcGluYSIsImEiOiJjbWF5eHEyNm0wZjVoMm1wcHp4eGc2d2tjIn0.l9vBCMD0L8TQgXierLSwlA',
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.posicionActual,
      zoom: 15,
    });

    this.mapa.addControl(new mapboxgl.NavigationControl());
    this.mapa.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
      })
    );
  }

  public agregarMarcador(): Observable<any> {
    const mapaGlobal = this.mapa;
    const marcadores = this.marcadores;

    return new Observable<any>(observer => {
      mapaGlobal.on('click', (e: any) => {
        marcadores.forEach(m => m.remove());

        const marcador = new mapboxgl.Marker({ color: 'red' })
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .addTo(mapaGlobal);

        marcadores.push(marcador);
        observer.next(marcador.getLngLat());
      });
    });
  }
}
