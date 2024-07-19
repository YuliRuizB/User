import { Component, OnInit } from '@angular/core';
import { NavController, NavParams ,ModalController,  AlertController, LoadingController, MenuController,Platform,ToastController  } from '@ionic/angular';
import * as moment from 'moment';
import { UsersService } from '../../services/firebase/users.service';
import { Device } from '@ionic-native/device/ngx';

@Component({
  selector: 'app-report-issue-modal',
  templateUrl: './report-issue-modal.page.html',
  styleUrls: ['./report-issue-modal.page.scss'],
})
export class ReportIssueModalPage implements OnInit {

	name: string = '';
	description: string = '';
  constructor(private _ModalController: ModalController, private _LoadingController: LoadingController,
		private _ToastController: ToastController, private _UsersService: UsersService,
		private _Device: Device
	) { }

  ngOnInit() {
  }

	back() {
		this._ModalController.dismiss();
	}

	async send() {

		if (this.name === '') {
			this.presentToast('Nombre requerido', 3000, 'danger');
			return
		}

		if (this.description === '') {
			this.presentToast('Descripcion requerido', 3000, 'danger');
			return
		}


		const loading = await this._LoadingController.create({
			message: 'Enviando informacion...',
		});
		await loading.present();

	
		const dateTimeId = moment().format('DD-MM-YYYY-hh:mm:ss');
		const dateTime = moment().format('DD-MM-YYYY hh:mm:ss');
		const date = moment().format('DD-MM-YYYY');

		let response = await this._UsersService.insertReportIssue(this.name, this.description, this._Device, dateTime, date);
		if (response) {
			this.back();
			this.presentToast('Envio exitoso',3000, 'success')
		}else{
			this.presentToast('Problemas al hacer el envio',3000, 'danger')
		}
		loading.dismiss()
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
