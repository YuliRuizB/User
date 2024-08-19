import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { NavController, LoadingController,MenuController,Platform, ModalController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast.service';
import { UsersService } from 'src/app/services/firebase/users.service';
import { map } from 'rxjs/operators';
import { StorageService } from 'src/app/services/storage/storage.service';
import { AndroidPermissions }  from '@ionic-native/android-permissions/ngx';
import { Device } from '@ionic-native/device/ngx';
import * as moment from 'moment';
import { ReportIssueModalPage } from '../../../modals/report-issue-modal/report-issue-modal.page';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
	remember: any;
	showEye: boolean = true;
  loginForm: FormGroup;
  loading = false;
  error_messages={
		'email':[
      {type: 'required', message: 'Correo requerido'},
      {type: 'minlength', message: 'Minimo 3 caracteres'},
			{type: 'maxlength', message: 'Maximo 50 caracteres'},
    ],
    'password':[
      {type: 'required', message: 'Contraseña requerida'},
      {type: 'minlength', message: 'Minimo 4 caracteres'},
			{type: 'maxlength', message: 'Maximo 50 caracteres'}
    ],
  }
  constructor(
    private fb: FormBuilder,
    private _MenuController: MenuController,
    private authService: AuthService,
    public navController: NavController,
    private toastService: ToastService,
    private usersService: UsersService,
    private storageService: StorageService,
		private _LoadingController:LoadingController,
		private _AndroidPermissions: AndroidPermissions,
		private _Platform: Platform,
		private _Device: Device,
		private _ModalController: ModalController
  ) {
    this._MenuController.enable(false);
    this.loginForm = fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email, Validators.minLength(3),Validators.maxLength(50)])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(50)])]
		});
		this._MenuController.enable(false)
   }

  async ngOnInit() {
		let flag =  await this.usersService.getRememberFlagStorage();
		console.log('cafeee')
		console.log(flag)
		this.remember = flag !== null && flag !== false ? true : false;
		if (flag !== null && flag !== false) {
		
			let data =  await this.usersService.getRememberDataFlagStorage();
			console.log('omega')
			console.log(data)
			this.loginForm.patchValue({ email: data.email });
			this.loginForm.patchValue({ password: data.password });
		}

		const accessCoarseLocation = await this._AndroidPermissions.checkPermission(this._AndroidPermissions.PERMISSION.ACCESS_COARSE_LOCATION);
		if (!accessCoarseLocation.hasPermission) {
			await this._AndroidPermissions.requestPermissions([this._AndroidPermissions.PERMISSION.ACCESS_COARSE_LOCATION, this._AndroidPermissions.PERMISSION.ACCESS_FINE_LOCATION]);
		}

		var permissions = this._AndroidPermissions.PERMISSION;
		const accessPermission = await this._AndroidPermissions.checkPermission(this._AndroidPermissions.PERMISSION.POST_NOTIFICATIONS);
		if (!accessPermission.hasPermission) {
			this._AndroidPermissions.requestPermission(this._AndroidPermissions.PERMISSION.POST_NOTIFICATIONS).then((resp) => {
			}).catch((error) => {
				console.log(error);
				console.log('el error')
			})
			
		}

		
   
  }

	eye() {
		this.showEye =  !this.showEye;
	}

  async signin() {
		console.log(this.remember);
	
    if(this.loginForm.valid) {
			const loading = await this._LoadingController.create({
				message: 'Cargando...',
			});
			await loading.present();
      this.authService.signin(this.loginForm.value).then((response:any) => {
        // if (response.user) {
				const user = response.user;
				if (!user.emailVerified) {
					// this.authService.sendVerificationMail();
					this.toastService.presentToast('Su cuenta requeire ser verificada', 3000, 'warning')
					loading.dismiss();
					this.navController.navigateForward('auth/verify');
				} else {
					let flag: any = false;
					this.usersService.getUser(user.uid).pipe(
						map(a => {
							const data = a.payload.data() as any;
							const id = a.payload.id;
							return { id, ...data };
						})
					).subscribe((userR) => {
						const roles: any[] = userR.roles;
						const isUser = roles.includes('user');
						const disabled = userR.disabled || false;
						if(isUser && !disabled) {
							this.storageService.setItem('userData', JSON.stringify(userR));
							this.storageService.getItem('isLoggedIn').then(async isLoggedIn => {
								if(!isLoggedIn) {
									this.storageService.setItem('isLoggedIn', true)
								} 

								if (flag === false) {
									flag = true;
									this.getDataDevice(userR)
									// flag = check;
								}
								if (this.remember) {
									this.usersService.setRememberFlagStorage(true);
									let data = {
										email: this.loginForm.value.email,
										password: this.loginForm.value.password 
									}
									this.usersService.setRememberDataFlagStorage(data)
								}else{
									this.usersService.clearRememberFlagStorage()
									this.usersService.clearRememberDataFlagStorage();
								}

								this.navController.navigateRoot('home');
							}).catch((err) => {
								this.toastService.presentToast(err, 3000, 'danger')
							})
						} else {
							this.toastService.presentToast('Esta aplicación es exclusiva para usuarios activos de la comunidad Bus2U. Para conductores, padres de familia y colaboradores hay otras aplicaciones.',5000,'danger').then( () => {
								this.authService.signout().then( () => {
									this.navController.navigateRoot('');
								})
							})
						}
						loading.dismiss();
					},(error) => {
						loading.dismiss();
						this.toastService.presentToast(error, 3000, 'danger')
					})
				}
        /*} else {
					this.toastService.presentToast('Opss! Error al iniciar sesion', 3000, 'danger')
        }*/
      }).catch( err => {
				loading.dismiss();
				this.toastService.presentToast(err, 3000, 'danger')
			})
    }
  }

	async getDataDevice(user: any) {


		let ss =this._Platform.platforms();
	return new Promise(async (resolve) => {
		let dataDevice = {
			lastDateConnectFull: '',
			lastDateConnect: '',
			lastDataConnectWithHour: '',
			platform: '',
			manufacturer: '',
			model: '',
			versionPlatformDevice: ''
		}
		let plat = 0
		if (this._Platform.is('android')) {
			plat = 1;
			dataDevice.platform = this._Device.platform;
			dataDevice.manufacturer = this._Device.manufacturer;
			dataDevice.model = this._Device.model;
			dataDevice.versionPlatformDevice = this._Device.version
			dataDevice.lastDateConnect = moment().format('l');
			dataDevice.lastDateConnectFull = moment().format();
			dataDevice.lastDataConnectWithHour = moment().format('DD/MM/YYYY h:mm a')
			
		}else
		if (this._Platform.is('ios')) {
			plat = 2
			dataDevice.platform = this._Device.platform;
			dataDevice.manufacturer = this._Device.manufacturer;
			dataDevice.model = this._Device.model;
			dataDevice.versionPlatformDevice = this._Device.version
			dataDevice.lastDateConnect = moment().format('l');
			dataDevice.lastDateConnectFull = moment().format();
			dataDevice.lastDataConnectWithHour = moment().format('DD/MM/YYYY h:mm a')
		}else{
			plat = 1;
			dataDevice.platform = 'browser';
			dataDevice.lastDateConnect = moment().format('l');
			dataDevice.lastDateConnectFull = moment().format();
			dataDevice.lastDataConnectWithHour = moment().format('DD/MM/YYYY h:mm a')
		}

		const auc1 = await this.usersService.updateAccesAppDevice(user.uid, dataDevice, user, plat);
		const auc2 = await this.usersService.loginHistoryUser(user.uid, dataDevice, user, plat);
		resolve(true);
	})
}

async report() {
	const modal = await this._ModalController.create({
		component: ReportIssueModalPage,
		showBackdrop:true,
		backdropDismiss:false,
	});
	modal.onDidDismiss().then((result)=>{
		if (result.data === 1) {
			// this._NavController.navigateForward('check-request-pre-register');
		} else {
	
		}
	});
	await modal.present();
}

}
