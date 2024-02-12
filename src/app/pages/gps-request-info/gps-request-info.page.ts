import { Component, OnInit } from '@angular/core';
import {
  ToastController,
  ModalController,
  AlertController,
  IonRouterOutlet,
	NavController,
	LoadingController,
  MenuController
} from "@ionic/angular";
import { Geolocation } from "@ionic-native/geolocation/ngx";

@Component({
  selector: 'app-gps-request-info',
  templateUrl: './gps-request-info.page.html',
  styleUrls: ['./gps-request-info.page.scss'],
})
export class GpsRequestInfoPage implements OnInit {

  constructor(
    private geolocation: Geolocation,
    private _NavController: NavController,
		private _LoadingController: LoadingController,
    private _MenuController: MenuController,
    private _ToastController: ToastController,
  ) { }

  ngOnInit() {
  }

  validar() {
    this.geolocation.getCurrentPosition().then(async (gps) => {
      this.presentToast(`Solicitud aceptada con exito`, 2000, "success"); 
      this._NavController.navigateRoot('home')
    }).catch((e) => {
      // console.log('gps error:'+ e);     
      this.presentToast(`Solicitud de Gps rechazado`, 2000, "danger"); 
      // this._NavController.navigateRoot('gps-request-info')
    })
  }

  async presentToast(message: string, duration: number, color: string) {
    const toast = await this._ToastController.create({
      message,
      duration,
      color,
    });
    toast.present();
  }

}
