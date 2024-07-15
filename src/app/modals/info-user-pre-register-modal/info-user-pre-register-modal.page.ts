import { Component, OnInit } from '@angular/core';
import { NavController, NavParams ,ModalController,  AlertController, LoadingController, MenuController,Platform  } from '@ionic/angular';
import { IUserData,IRoute } from '../../models/models';
import { BusesService } from '../../services/firebase/buses.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-info-user-pre-register-modal',
  templateUrl: './info-user-pre-register-modal.page.html',
  styleUrls: ['./info-user-pre-register-modal.page.scss'],
})
export class InfoUserPreRegisterModalPage implements OnInit {
	getDataUser: IUserData =  null;
	routeData: IRoute = {
		active: false,
		customerId: '',
		customerName: '',
		description: '',
		id: '',
		imageUrl: '',
		kmzUrl: '',
		name: '',
		routeId: ''
	};
  constructor(
		private _NavController: NavController, private _NavParams: NavParams, 
		private _ModalController: ModalController, private _BusesService: BusesService
	) {
		this.getDataUser = this._NavParams.get('value');
		console.log('alicarlo')
		console.log('esto llega');
		console.log(this.getDataUser);
		this.getRouteById();
	 }

  ngOnInit() {
  }

	close(){
		this._ModalController.dismiss();
	}

	goPreregister() {
		this._ModalController.dismiss(1);
	}

	async getRouteById() {
		this._BusesService
      .getUserActiveRoutesById(this.getDataUser)
      .pipe(
				map(a => {
          const data = a.payload.data() as IRoute;
          const id = a.payload.id;
          return { id, ...data };
        })
			)
      .subscribe((response) => {
				console.log('entra 333333333')
				console.log(response)
				this.routeData = response;
      });
	}

}
