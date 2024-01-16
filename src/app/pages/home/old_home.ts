import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Map, latLng, tileLayer, Layer, marker } from 'leaflet';
import 'leaflet-rotatedmarker';
import 'leaflet.marker.slideto';
import { OnemapService } from '../../services/data/onemap.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ToastController, ModalController, AlertController, IonRouterOutlet } from '@ionic/angular';
import * as _ from 'lodash';
import { format, setHours, setMinutes, isWithinInterval, formatDistance, formatDistanceToNow, isThisSecond } from 'date-fns';
import { BusesService } from '../../services/firebase/buses.service';
import { map, take } from 'rxjs/operators';
import { UsersService } from '../../services/firebase/users.service';
import { StorageService } from '../../services/storage/storage.service';
// import { FilterOptionsComponent } from '@app/components/filter-options/filter-options.component';
import { StationInfoPage } from './station-info/station-info.page';
// import { FCM } from '@ionic-native/fcm/ngx';
// import { FirebaseX } from "@ionic-native/firebase-x/ngx";
import { OsrmService } from '../../services/osrm/osrm.service';
import esLocale from 'date-fns/locale/es';
import { AuthService } from '../../services/firebase/auth.service';
import { IUserData, IRoles } from '../../../app/models/models';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  loading = true;
  user: IUserData;
  map: Map;
  geofences: any;
  devices: any = [];
  markers: any = [];
  routes: any;
  routeStops: any = [];
  routeStopsList: any = [];
  asyncProcess = false;
  timer = null;
  autoUpdateStatus = false;
  showDevices = false;
  cards: any;
  showToolbar = false;
  stationsMarkers: L.LayerGroup<any>;
  busesMarkers: L.LayerGroup<any>;

  sliderConfig = {
    slidesPerView: 1.5,
    spaceBetween: 1,
    centeredSlides: true
  };
  userGeoLocation: any;
  hasUserGeoLocation = false;

  constructor(
    private apiService: OnemapService,
    private geolocation: Geolocation,
    public toastController: ToastController,
    public modalController: ModalController,
    private busesService: BusesService,
    public alertController: AlertController,
    private usersService: UsersService,
    private storageService: StorageService,
    // private fcm: FirebaseX,
    private osrmService: OsrmService,
    private routerOutlet: IonRouterOutlet
  ) {

  }

  ngOnInit() {

    this.storageService.getItem('userData').then((userData) => {
      this.user = JSON.parse(userData);
      // this.canShowDevices();
      this.getSubscriptions();
      this.validateToken();

      if (this.user && this.user.defaultRoute) {
        // this.showMapRoute();
      } else {
        this.requestDefaultRoute();
      }
    });
  }

  loadMapAfterSubscriptions() {
    this.map = new Map('mapId').setView([25.6739571, -100.3400463], 10);
    this.stationsMarkers = L.layerGroup().addTo(this.map);
    this.busesMarkers = L.layerGroup().addTo(this.map);
    this.asyncProcess = true;
    this.leafletMap();
    this.asyncProcess = false;
  }

  ionViewDidEnter() {

    console.log('ionviewdidenter');
    setTimeout(() => {
      
    }, 1000);
    // this.apiService.getGeofences().then((geofences) => {
    //   this.apiService.getDevices().then((devices) => {
    //     this.devices = devices;
    //     this.geofences = geofences;
    //     this.asyncProcess = false;
    //   });
    // });
  }

  validateToken() {
    /* 
    this.fcm.getToken().then(token => {
      console.log('getToken() from homepage');
      this.usersService.registerToken(this.user.uid, token);
    });
    this.fcm.onTokenRefresh().subscribe(token => {
      console.log('onTokenRefresh() from homepage');
      this.usersService.registerToken(this.user.uid, token);
    });
    this.fcm.getAPNSToken().then(token => {
      console.log('getAPNSToken() from homepage');
      this.usersService.registerAPNSToken(this.user.uid, token);
    });
    */
  }

  async requestDefaultRoute() {
    const alert = await this.alertController.create({
      header: '¿Qué ruta deseas ver?',
      message: 'Aún no has seleccionado la ruta que utilizarás.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Seleccionar',
          handler: () => {
            this.presentAlertRadio();
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertRadio() {
    let inputs = [];
    this.routes.forEach((route) => {
      const element = {
        name: 'radio1',
        type: 'radio',
        label: route.name,
        value: route.id
      }
      inputs.push(element);
    })

    const alert = await this.alertController.create({
      header: 'Rutas',
      inputs: inputs,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Seleccionar',
          handler: (routeId) => {
            console.log(routeId);
            this.updateUserPreference({ defaultRoute: routeId }).then(() => {
              this.stationsMarkers.eachLayer((layer) => {
                this.stationsMarkers.removeLayer(layer);
              });
              this.showMapRoute();
            })
          }
        }
      ]
    });

    await alert.present();
  }

  updateUserPreference(preference: any) {
    this.user.defaultRoute = preference.defaultRoute;
    return this.usersService.updateUserPreference(this.user.id, preference).then(() => {
      this.storageService.setItem('userData', JSON.stringify(this.user));
    })
  }

  updateUserGeolocation() {
    this.asyncProcess = true;
    console.log('update user geolocation');
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp);
      this.userGeoLocation = resp;
      this.hasUserGeoLocation = true;
      this.updateTimeTravel();
    }).catch((error) => {
      // TODO: Send alarm to user;
      this.hasUserGeoLocation = false;
      this.presentToast(`No es posible obtener tu ubicación`, 2000, 'danger');
      // // console.log('Error getting location', error);
    });

    const watch = this.geolocation.watchPosition();
    watch.subscribe((data: any) => {
      console.log(data);
      // this.updateTimeTravel();
      // const pulsingIcon = L.Icon.pulse({
      //   iconSize: [20, 20],
      //   color: 'blue',
      //   fillColor: 'blue',
      //   heartbeat: 2
      // });

      //tslint:disable-next-line: no-string-literal
      if (!this.markers['userPosition']) {
        // If there is no marker with this id yet, instantiate a new one.
        // tslint:disable-next-line: no-string-literal
        this.markers['userPosition'] = L.marker([data.coords.latitude, data.coords.longitude], {
          icon: L.icon({
            // tslint:disable-next-line: max-line-length
            iconUrl: 'assets/icon/markeruser.png',
            iconSize: [40, 40],
            iconAnchor: [40, 40],
            popupAnchor: [-20, -40],
            shadowUrl: 'assets/icon/drop_shadow_bus.png',
            shadowRetinaUrl: 'assets/icon/drop_shadow_bus.png',
            shadowSize: [25, 25],
            shadowAnchor: [25, 25]
          }),
        }).addTo(this.map).bindPopup('¡Aquí estoy!');
      } else {
        // If there is already a marker with this id, simply modify its position.
        // tslint:disable-next-line: no-string-literal
        this.markers['userPosition'].slideTo([data.coords.latitude, data.coords.longitude], {
          duration: 2000,
          keepAtCenter: false
        });
      }
      this.asyncProcess = false;
    });
  }

  getSubscriptions() {
    this.busesService.getUserActiveRoutes(this.user).pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).subscribe((routes) => {
      this.routes = routes;
      setTimeout(() => {
        this.loadMapAfterSubscriptions();
      }, 3000);
      this.loading = false;
    })
  }

  canShowDevices() {
    return this.busesService.canShowDevices(this.user).pipe(
      map(a => {
        const data = a.payload.data() as any;
        const id = a.payload.id;
        return { id, ...data };
      })
    ).subscribe((customer) => {
      const canShowBuses = customer.canShowDevices ? customer.canShowDevices : false;
      const now = new Date();
      const start = setHours(now, customer.showFromHour);
      start.setMinutes(30);
      const end = setHours(now, customer.showToHour);
      end.setMinutes(30);
      const _isWithinInterval = isWithinInterval(
        now,
        { start: start, end: end }
      )
      this.showDevices = canShowBuses && _isWithinInterval;
    })
  }

  leafletMap() {

    // In setView add latLng and zoom

    this.map.zoomControl.remove();
    tileLayer('https://mt0.google.com/vt/lyrs=m&hl=es&x={x}&y={y}&z={z}&s=Ga', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      // style: 'https://api.maptiler.com/maps/1ddaeb93-5681-4398-ac48-bba52a074fd3/?key=crAqHWwNhI6CF3sWYjMT#'
    }).addTo(this.map);

    this.map.whenReady(() => {
      console.log('map is ready');
      if(this.user && this.user.defaultRoute) {
        this.showMapRoute();
      }
      this.updateUserGeolocation();
      // setTimeout(() => {
      //   this.addStopsToMap(this.routeStops);
      // }, 100);
    });
  }

  async openModalStationInfo(stop: any) {

    const modal = await this.modalController.create({
      component: StationInfoPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        routeId: this.user.defaultRoute,
        station: stop
      }
    });

    await modal.present();


  }

  showMapRoute() {
    this.busesService.getUserRouteActiveStops(this.user).pipe(
      map(actions => actions.map((a) => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).subscribe((routeStops) => {
      this.routeStopsList = _.orderBy(routeStops, ['order'], ['asc']);
      this.addStopsToMap(this.routeStopsList);
      if (this.hasUserGeoLocation) {
        // this.updateTimeTravel();
      }
    })
  }

  updateTimeTravel() {
    this.routeStopsList.forEach((routeStop) => {
      this.getTimeTravelDistance(routeStop).then((response: any) => {
        routeStop.distance = Number((response.routes[0].distance) / 1000).toFixed(0) + ' km';
        routeStop.duration = formatDistance(0, response.routes[0].duration * 1000, { includeSeconds: true, locale: esLocale });
      });
    });
  }

  getTimeTravelDistance(station: any) {
    let userCoordinates = `${this.userGeoLocation.coords.longitude},${this.userGeoLocation.coords.latitude}`;
    let stationCoordinates = `${station.geopoint.longitude},${station.geopoint.latitude}`;
    return this.osrmService.getTimeTravelDistance('foot',stationCoordinates, userCoordinates).pipe(take(1)).toPromise().then((response) => {
      return response;
    });
  }

  addStopsToMap(stationsArray) {
    console.log(stationsArray);
    let arrayOfLatLngs = [];
    stationsArray.forEach((station) => {

      const customPopup = `
        <strong>${station.name}</strong><br/>
        ${station.description}<br/>
      `;

      arrayOfLatLngs.push([station.geopoint.latitude, station.geopoint.longitude]);
      L.marker([station.geopoint.latitude, station.geopoint.longitude], {
        icon: L.icon({
          // tslint:disable-next-line: max-line-length
          iconUrl: station.iconUrl ? station.iconUrl : 'assets/icon/pin_station.png',
          iconSize: [30, 30],
          iconAnchor: [30, 30],
          popupAnchor: [-15, -20],
          shadowUrl: 'assets/icon/drop_shadow_bus.png',
          shadowRetinaUrl: 'assets/icon/drop_shadow_bus.png',
          shadowSize: [45, 45],
          shadowAnchor: [45, 27]
        }),
        // rotationAngle: 147,
        // rotationOrigin: 'center center'
      }).addTo(this.stationsMarkers)
        .bindPopup(customPopup);
    });
    console.log(arrayOfLatLngs);
    let bounds = arrayOfLatLngs.length > 0 ? new L.LatLngBounds(arrayOfLatLngs) : [];
    const boundsExists = arrayOfLatLngs.length > 0;
    if (boundsExists) {
      this.map.fitBounds(bounds);
      this.map.invalidateSize();
    }

  }

  // oldShows() {
  //   L.marker([25.6739571, -100.3400463], {
  //     icon: L.icon({
  //       // tslint:disable-next-line: max-line-length
  //       iconUrl: 'https://firebasestorage.googleapis.com/v0/b/bus2u-834e8.appspot.com/o/assets%2Flogo_prepa.png?alt=media&token=ebc905a5-3bae-4ab3-acc8-51ac387f6ebd',
  //       iconSize: [40, 40],
  //       iconAnchor: [40, 40],
  //       popupAnchor: [-20, -40]
  //     }),
  //     // rotationAngle: 147,
  //     // rotationOrigin: 'center center'
  //   }).addTo(this.map)
  //     .bindPopup('Prepa 2');
  //   // .openPopup();

  //   this.geofences.forEach((geofence: any) => {

  //     const latitude = geofence.area.substring(8, 17);
  //     const longitude = geofence.area.substring(27, 37);
  //     // console.log(latitude, longitude);

  //     // create popup contents
  //     const customPopup = `
  //       Parada: <strong>${geofence.name}</strong><br/>
  //       Referencia: <strong>${geofence.description}</strong><br/>
  //     `;
  //     // specify popup options
  //     const customOptions = {
  //       maxWidth: '500',
  //       className: 'custom'
  //     };

  //     L.marker([latitude, longitude], {
  //       icon: L.icon({
  //         // tslint:disable-next-line: max-line-length
  //         iconUrl: geofence.attributes && geofence.attributes.imageUrl ? geofence.attributes.imageUrl : 'https://firebasestorage.googleapis.com/v0/b/bus2u-834e8.appspot.com/o/assets%2FP1.png?alt=media&token=22a7689f-3b79-4d1c-838f-2ac488491f62',
  //         iconSize: [40, 40],
  //         iconAnchor: [40, 40],
  //         popupAnchor: [-20, -40]
  //       })
  //     }).addTo(this.map)
  //       .bindPopup(customPopup); // , customOptions);

  //   });
  //   if (this.showDevices) {
  //     this.devices.forEach((device: any) => {
  //       if (device && device.positionId) {
  //         this.apiService.getPosition(device.positionId).then((positionArray: any) => {
  //           const position = positionArray[0];
  //           const motion = position.attributes && position.attributes.motion ? position.attributes.motion : false;
  //           // tslint:disable-next-line: max-line-length
  //           const assignedRoute = device.attributes && device.attributes.assignedRoute ? device.attributes.assignedRoute : 'Sin información';
  //           // const time = distanceInWordsToNow(
  //           //   new Date(position.deviceTime),
  //           //   {locale: esLocale,
  //           //   addSuffix: true}
  //           // );
  //           const time = '1233'

  //           // tslint:disable-next-line: max-line-length
  //           const iconUrl = 'https://firebasestorage.googleapis.com/v0/b/bus2u-834e8.appspot.com/o/assets%2Fbus-top-view-green.png?alt=media&token=d9262694-49bc-488f-a3b1-1d332d6c6ae0';

  //           // create popup contents
  //           const customPopup = `
  //             Unidad: <strong>${device.name}</strong><br/>
  //             Ruta: <strong>${assignedRoute}</strong><br/>
  //             Actualizado: <strong>${time}</strong><br/>
  //           `;
  //           // specify popup options
  //           const customOptions = {
  //             maxWidth: '500',
  //             className: 'custom'
  //           };

  //           this.markers[position.deviceId] = L.marker([position.latitude, position.longitude], {
  //             icon: L.icon({
  //               // tslint:disable-next-line: max-line-length
  //               iconUrl,
  //               iconSize: [20, 60],
  //               iconAnchor: [20, 60],
  //               popupAnchor: [-20, -40]
  //             }),
  //             // rotationAngle: position.course,
  //             // rotationOrigin: 'center center'
  //           }).addTo(this.map)
  //             .bindPopup(customPopup); //, customOptions);

  //         });
  //       }
  //     });
  //   }
  // }

  updateDevices() {
    if (true) { //this.canShowDevices()
      this.asyncProcess = true;
      console.log(this.user.defaultRoute);
      
      this.busesService.getLiveBusesRoute(this.user, this.user.defaultRoute).pipe(take(1),
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      ).subscribe((devices) => {
        console.log(devices);
        
        if(this.devices.length > 0) {
          const currentDevices = _.map(devices, (a) => {
            return a.id;
            });
          console.log('this.devices is greather than 0');
          console.log(this.devices);
          console.log(currentDevices);
          const difference = _.difference(this.devices, currentDevices);
          if(difference.length > 0) {
            difference.forEach( (device) => {
              console.log('difference ', device);
              this.markers[device].remove();
            })
          }
        }
        this.devices = _.map(devices, (a) => {
          return a.vehicleId;
          });
        devices.forEach((device: any) => {
          const latLng = [device.geopoint.latitude, device.geopoint.longitude];
          const iconUrl = 'assets/icon/marker_bus.png';
          const motion = device.speed == 0 ? false : true;
          const assignedRoute = device.routeName;
          const time = formatDistanceToNow(
            new Date(device.date.toDate()),
            {
              locale: esLocale,
              addSuffix: true
            }
          );
          const customPopup = `
              Unidad: <strong>${device.name}</strong><br/>
              Ruta: <strong>${assignedRoute}</strong><br/>
              Actualizado: <strong>${time}</strong><br/>
              `;
          // specify popup options
          const customOptions = {
            maxWidth: '500',
            className: 'custom'
          };

          if (!this.markers[device.vehicleId]) {
            // If there is no marker with this id yet, instantiate a new one.
            this.markers[device.vehicleId] = L.marker([device.geopoint.latitude, device.geopoint.longitude], {
              icon: L.icon({
                // tslint:disable-next-line: max-line-length
                iconUrl,
                iconSize: [40, 40],
                iconAnchor: [40, 40],
                popupAnchor: [-20, -20],
                shadowUrl: 'assets/icon/drop_shadow_bus.png',
                shadowRetinaUrl: 'assets/icon/drop_shadow_bus.png',
                shadowSize: [45, 45],
                shadowAnchor: [45, 27]
              }),
              // rotationAngle: position.course,
              // rotationOrigin: 'center center'
            }).addTo(this.busesMarkers)
              .bindPopup(customPopup); // , customOptions);
          } else {
            // If there is already a marker with this id, simply modify its position.
            this.markers[device.vehicleId].slideTo(latLng, {
              duration: 2000,
              keepAtCenter: false
            })
              // .setRotationAngle(device.orientation)
              // .setRotationOrigin('center center')
              .setPopupContent(customPopup, customOptions);
            // this.markers[position.deviceId].setLatLng(latLng).setPopupContent(customPopup, customOptions);
          }
        });
        this.asyncProcess = false;
      });
    }
  }

  updateDevicesOnemap() {

    if (this.canShowDevices()) {
      this.asyncProcess = true;
      this.apiService.getDevices().then((devices) => {
        this.devices = devices;
        this.devices.forEach((device: any) => {
          if (device && device.positionId) {
            this.apiService.getPosition(device.positionId).then((positionArray: any) => {
              const position = positionArray[0];
              // tslint:disable-next-line: no-shadowed-variable
              const latLng = [position.latitude, position.longitude];
              const motion = position.attributes && position.attributes.motion ? position.attributes.motion : false;
              // tslint:disable-next-line: max-line-length
              // const iconUrl = 'https://firebasestorage.googleapis.com/v0/b/bus2u-834e8.appspot.com/o/assets%2Fbus-top-view-green.png?alt=media&token=d9262694-49bc-488f-a3b1-1d332d6c6ae0';
              const iconUrl = 'assets/icon/marker_bus.png';
              // tslint:disable-next-line: max-line-length
              const assignedRoute = device.attributes && device.attributes.assignedRoute ? device.attributes.assignedRoute : 'Sin información';
              const time = formatDistanceToNow(
                new Date(position.deviceTime),
                {
                  locale: esLocale,
                  addSuffix: true
                }
              );
              // const time = '1231';
              // console.log(position);

              // create popup contents
              const customPopup = `
              Unidad: <strong>${device.name}</strong><br/>
              Ruta: <strong>${assignedRoute}</strong><br/>
              Actualizado: <strong>${time}</strong><br/>
              `;
              // specify popup options
              const customOptions = {
                maxWidth: '500',
                className: 'custom'
              };

              if (!this.markers[position.deviceId]) {
                // If there is no marker with this id yet, instantiate a new one.
                this.markers[position.deviceId] = L.marker([position.latitude, position.longitude], {
                  icon: L.icon({
                    // tslint:disable-next-line: max-line-length
                    iconUrl,
                    iconSize: [20, 60],
                    iconAnchor: [20, 60],
                    popupAnchor: [-20, -40]
                  }),
                  // rotationAngle: position.course,
                  // rotationOrigin: 'center center'
                }).addTo(this.map)
                  .bindPopup(customPopup); // , customOptions);
              } else {
                // If there is already a marker with this id, simply modify its position.
                this.markers[position.deviceId].slideTo(latLng, {
                  duration: 2000,
                  keepAtCenter: false
                })
                  .setRotationAngle(position.course)
                  .setRotationOrigin('center center')
                  .setPopupContent(customPopup, customOptions);
                // this.markers[position.deviceId].setLatLng(latLng).setPopupContent(customPopup, customOptions);
              }
            });
          }
        });
        this.asyncProcess = false;
      });
    }
  }

  startAutoUpdate() {
    if (this.canShowDevices()) {
      if (this.timer != null) { return; }
      this.autoUpdateStatus = true;
      this.timer = setInterval(() => {
        this.updateDevices();
      }, 5000);
      this.presentToast('Actualización automática encendida', 2000, 'primary');
    }
  }

  stopAutoUpdate() {
    clearInterval(this.timer);
    this.autoUpdateStatus = false;
    this.timer = null;
    this.presentToast('Actualización automática apagada', 2000, 'light');
  }

  async filterOptions() {
    // const modal = await this.modalCtrl.create({
    //   component: FilterOptionsComponent
    // });
    // return await modal.present();
  }

  /** Remove map when we have multiple map object */
  ionViewWillLeave() {
    clearInterval(this.timer);
    this.timer = null;
    this.autoUpdateStatus = false;
    this.map.remove();
  }

  async presentToast(message: string, duration: number, color: string) {
    const toast = await this.toastController.create({
      message, duration, color
    });
    toast.present();
  }

}
