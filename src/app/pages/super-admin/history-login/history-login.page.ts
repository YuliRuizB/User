import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { UsersService } from "../../../services/firebase/users.service"; 
import { StorageService } from '../../../services/storage/storage.service';
import { IUserData,IRoute } from '../../../models/models';
import { BusesService } from '../../../services/firebase/buses.service';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-history-login',
  templateUrl: './history-login.page.html',
  styleUrls: ['./history-login.page.scss'],
})
export class HistoryLoginPage implements OnInit {
	user: any = null;
	currentDay: any = ''
	list: any = [];
	listAux: any = [];
  constructor(
		private _ToastController: ToastController,
		private _LoadingController: LoadingController,
		private _UsersService: UsersService,
		private _NavController: NavController,
		private _StorageService: StorageService
		
	) { }

  ngOnInit() {
		this._StorageService.getItem("userData").then(async (userData) => {
      this.user = JSON.parse(userData);
			this.currentDay = moment().format('l');
			this.getList();
    }).catch((error) => {
			console.log('error 777777');
			console.log(error)
		})
  }

	close() {
		this._NavController.navigateRoot('home');
	}

	async getList() {
		const loading = await this._LoadingController.create({
			message: 'Cargando su informacion...',
		});
		await loading.present();
		this._UsersService.getListLoginHistory(this.currentDay).then((response) => {
			console.log('ret');
			console.log(response)
			this.list = response;
			this.listAux = response;
			loading.dismiss();
		}).catch((error) => {
			loading.dismiss();
			this.presentToast(`Problemas para obtener la informacion`, 2000, "danger");
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

	public getItems(ev): any{

    // Reset items back to all of the items
    this.list=this.listAux;
    // set val to the value of the ev target
    var val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.list = this.list.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1 
				||  item.lastName.toLowerCase().indexOf(val.toLowerCase()) > -1 
				||  item.lastDataConnectWithHour.toLowerCase().indexOf(val.toLowerCase()) > -1)
				||  item.email.toLowerCase().indexOf(val.toLowerCase()) > -1
				||  item.platform.toLowerCase().indexOf(val.toLowerCase()) > -1
				||  item.model.toLowerCase().indexOf(val.toLowerCase()) > -1
				||  item.manufacturer.toLowerCase().indexOf(val.toLowerCase()) > -1
				||  item.versionPlatformDevice.toLowerCase().indexOf(val.toLowerCase()) > -1
				
				;
      })
    }
  }

}
