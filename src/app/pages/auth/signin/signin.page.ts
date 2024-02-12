import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { NavController, LoadingController,MenuController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast.service';
import { UsersService } from 'src/app/services/firebase/users.service';
import { map } from 'rxjs/operators';
import { StorageService } from 'src/app/services/storage/storage.service';
import { AndroidPermissions }  from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  loginForm: FormGroup;
  loading = false;
  error_messages={
		'email':[
      {type: 'required', message: 'Correo requerido'},
      {type: 'minlength', message: 'Minimo 3 caracteres'},
			{type: 'maxlength', message: 'Maximo 35 caracteres'},
    ],
    'password':[
      {type: 'required', message: 'Contraseña requerida'},
      {type: 'minlength', message: 'Minimo 4 caracteres'},
			{type: 'maxlength', message: 'Maximo 35 caracteres'}
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
		private _AndroidPermissions: AndroidPermissions
  ) {
    this._MenuController.enable(false);
    this.loginForm = fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email, Validators.minLength(3),Validators.maxLength(35)])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(35)])]
		});
   }

  async ngOnInit() {
		const accessCoarseLocation = await this._AndroidPermissions.checkPermission(this._AndroidPermissions.PERMISSION.ACCESS_COARSE_LOCATION);
		if (!accessCoarseLocation.hasPermission) {
			await this._AndroidPermissions.requestPermissions([this._AndroidPermissions.PERMISSION.ACCESS_COARSE_LOCATION, this._AndroidPermissions.PERMISSION.ACCESS_FINE_LOCATION]);
		}

		/*const accessPermission = await this._AndroidPermissions.checkPermission(this._AndroidPermissions.PERMISSION.POST_NOTIFICATIONS);
		console.log('leyenda')
		console.log(accessPermission)
		if (!accessPermission.hasPermission) {
			this._AndroidPermissions.requestPermission(this._AndroidPermissions.PERMISSION.POST_NOTIFICATIONS).then((resp) => {
				console.log('yas')
				console.log(resp)
			}).catch((error) => {
				console.log(error);
				console.log('el error')
			})
			
		}*/
		var permissions = this._AndroidPermissions.PERMISSION;
		console.log(permissions)
		const accessPermission = await this._AndroidPermissions.checkPermission(this._AndroidPermissions.PERMISSION.POST_NOTIFICATIONS);
		console.log('leyenda')
		console.log(accessPermission)
		if (!accessPermission.hasPermission) {
			this._AndroidPermissions.requestPermission(this._AndroidPermissions.PERMISSION.POST_NOTIFICATIONS).then((resp) => {
				console.log('yas')
				console.log(resp)
			}).catch((error) => {
				console.log(error);
				console.log('el error')
			})
			
		}
   
  }

  async signin() {
    if(this.loginForm.valid) {
			const loading = await this._LoadingController.create({
				message: 'Cargando...',
			});
			await loading.present();
      this.authService.signin(this.loginForm.value).then((response:any) => {
        // if (response.user) {
          const user = response.user;
          if (!user.emailVerified) {
						this.toastService.presentToast('Su cuenta requeire ser verificada', 3000, 'warning')
						loading.dismiss();
            this.navController.navigateForward('auth/verify');
          } else {
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
                this.storageService.getItem('isLoggedIn').then(isLoggedIn => {
                  if(!isLoggedIn) {
                    this.storageService.setItem('isLoggedIn', true)
                  } 
                  this.navController.navigateRoot('home');
                }).catch((err) => {
									this.toastService.presentToast(err, 3000, 'danger')
								})
              } else {
                console.log('is not a user');
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
}
