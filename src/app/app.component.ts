import { Component } from '@angular/core';
import { Platform, NavController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/firebase/auth.service';
import { StorageService } from './services/storage/storage.service';
// import { FCM } from '@ionic-native/fcm/ngx';
import { FirebaseX } from "@ionic-native/firebase-x/ngx";

import { UsersService } from './services/firebase/users.service';
import { Router } from '@angular/router';
import { IUserData, IRoles } from '../app/models/models';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent {

  user: IUserData = {
		status: '',
		address: {
			addressLine: '',
			city: '',
			postCode: '',
			state: ''
		},
		customerId: '',
		customerName: '',
		displayName: '',
		defaultRoute: '',
		defaultRound: '',
		defaultRouteName: '',
		defaultStopName: '',
		email: '',
		emailVerified: false,
		firstName: '',
		id: '',
		lastName: '',
		occupation: '',
		openpay: {
			address: '',
			clabe: '',
			creation_date: '',
			email: '',
			external_id: '',
			id: '',
			last_name: '',
			name: '',
			phone_number: ''
		},
		phone: '',
		photoURL: '',
		refreshToken: '',
		roles: [],
		socialNetworks: {
			apple: '',
			facebook: '',
			google: '',
			instagram: '',
			linkedIn: '',
			twitter: ''
		},
		studentId: '',
		uid: '',
		username: '',
		_isEditMode: false,
		_userId: '',
		dateCreateUserFormat: '',
		dateCreateUserFull: '',
		phoneNumber: '',
		roundTrip: '',
		turno: '',
		deviceInfo:  {
			lastDataConnectWithHour: '',
			lastDateConnect: '',
			lastDateConnectFull: '',
			manufacturer: '',
			model: '',
			platform: '',
			versionPlatformAppStore: '',
			versionPlatformAppStoreString: '',
			versionPlatformDevice: '',
			platformPermisionStatus: {
				businesName: '',
				id: null,
				idDoc: ''
			},
			businesPlatform: {
				businesName: '',
				businesType: '',
				currentVersion: '',
				id: null,
				idDoc: '',
			}
		}
	};

  public appPages = [
		{
			id: 1,
      title: 'Ruta en proceso',
      subtitle: 'Revisa el seguimiento de tu ruta, podras ver la cantidad de personas en la ruta.',
      url: '/check-request-pre-register',
      icon: 'checkbox',
      color: 'success'
    },
    {
			id: 2,
      title: 'Paradas Cercanas',
      subtitle: 'Ver todas las paradas cercanas',
      url: '/home',
      icon: 'navigate-circle',
      color: 'primary'
    },
    {	
			id: 3,
      title: 'Mensajes',
      subtitle: 'Centro de mensajes',
      url: '/notifications/messages',
      icon: 'notifications-circle-outline',
      color: 'primary'
    },
    {
			id: 4,
      title: 'Promociones',
      subtitle: 'Checa las promociones que tenemos para tí',
      url: '/promotions',
      icon: 'gift',
      color: 'success'
    },
    {
			id: 5,
      title: 'Compartir',
      subtitle: 'Comparte la app con tus padres y compañeros',
      url: '/share',
      icon: 'share',
      color: 'primary'
    },
    {
			id: 6,
      title: 'Mis pases',
      subtitle: 'No pierdas el bus, administra tus pagos',
      url: '/purchases',
      icon: 'qr-code-outline',
      color: 'primary'
    },
    {
			id: 7,
      title: 'Preguntas Frecuentes',
      subtitle: 'Tus dudas pueden resolverse, consulta aqui',
      url: '/faq',
      icon: 'chatbubble-ellipses',
      color: 'primary'
    },
    {
			id: 8,
      title: 'Reglamento',
      subtitle: 'Reglamento de Bus2U',
      url: '/regulation/2',
      icon: 'newspaper',  
      color: 'primary'
    },
    {
			id: 9,
      title: 'Contactémonos',
      subtitle: 'Tus comentarios son importantes',
      url: '/contact-us',
      icon: 'chatbubbles',
      color: 'warning'
    },
		{
			id: 10,
      title: 'Historial de Inicios de Sesion',
      subtitle: 'Administracion',
      url: '/history-login',
      icon: 'list',
      color: 'warning'
    }
  ];
	validUser: any = '[]';
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private navController: NavController,
    private storageService: StorageService,
    private usersService: UsersService,
    private fcm: FirebaseX,
    private router: Router,
    public toastController: ToastController
  ) {
    this.authService.getUserFromDB().subscribe( (user) => {
      this.user = user;
    console.log("1-" + this.user);
      if(this.user === undefined) {
				this.clear();
        this.signout();
      }

			if(JSON.stringify(user) === '[]') {
				console.log('limpia 1')
				this.validUser = JSON.stringify(user);
				// this.clear();
        // this.signout();
      }else{
				this.validUser = JSON.stringify(user);
				console.log('limpia 2')
			}
			/*if(JSON.stringify(user) === '[]') {
				console.log('limpia 1')
				// this.clear();
        // this.signout();
      }else{
				this.user = user;
				console.log('limpia 2')
			}*/
    })
    setTimeout(() => {
      this.initializeApp();
    }, 500);
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
			this.clear();
			// await this.storageService.forceSettings();
			// Old code cordova 9 
      /*this.fcm.onNotification().subscribe(data => {
        if (data.wasTapped) {
          console.log("Received in background", data);
        } else {
          console.log("Received in foreground", data);
          this.makeToast(data);
        };
      });*/
			// New Code cordova 12
			this.fcm.onMessageReceived().subscribe(data => {
        if (data.wasTapped) {
          console.log("Received in background", data);
        } else {
          console.log("Received in foreground", data);
          this.makeToast(data);
        };
      });
    });
  }

  signout() {
    this.authService.signout().then( () => {
			this.clear();
      this.storageService.forceSettings();
      this.navController.navigateBack('auth');
    })
  }

  async makeToast(message) {
    console.log('message on toastService: ', message);
    const buttonsString = JSON.parse(message.buttons) || [];
    let buttons = [];
    buttonsString.forEach(button => {
      buttons.push({
        text: button.text,
        handler: () => {
          if(button.handlerType && button.handlerType == 'navigation') {
            this.router.navigateByUrl(button.handler);
          } else {
            new Function(button.handler)();
          }
        }
      })
    });
    
    const toast = await this.toastController.create({
      message: message.body,
      header: message.title,
      duration: message.buttons && message.buttons.length > 0 ? 0 : 5000,
      color: message.color || 'medium',
      position: message.position || 'middle',
      buttons: buttons
    });

    toast.present();
  }

	clear() {
		this.user  = {
			status: '',
			address: {
				addressLine: '',
				city: '',
				postCode: '',
				state: ''
			},
			customerId: '',
			customerName: '',
			displayName: '',
			defaultRoute: '',
			defaultRound: '',
			defaultRouteName: '',
			defaultStopName: '',
			email: '',
			emailVerified: false,
			firstName: '',
			id: '',
			lastName: '',
			occupation: '',
			openpay: {
				address: '',
				clabe: '',
				creation_date: '',
				email: '',
				external_id: '',
				id: '',
				last_name: '',
				name: '',
				phone_number: ''
			},
			phone: '',
			photoURL: '',
			refreshToken: '',
			roles: [],
			socialNetworks: {
				apple: '',
				facebook: '',
				google: '',
				instagram: '',
				linkedIn: '',
				twitter: ''
			},
			studentId: '',
			uid: '',
			username: '',
			_isEditMode: false,
			_userId: '',
			dateCreateUserFormat: '',
			dateCreateUserFull: '',
			phoneNumber: '',
			roundTrip: '',
			turno: '',
			deviceInfo:  {
				lastDataConnectWithHour: '',
				lastDateConnect: '',
				lastDateConnectFull: '',
				manufacturer: '',
				model: '',
				platform: '',
				versionPlatformAppStore: '',
				versionPlatformAppStoreString: '',
				versionPlatformDevice: '',
				platformPermisionStatus: {
					businesName: '',
					id: 5,
					idDoc: ''
				},
				businesPlatform: {
					businesName: '',
					businesType: '',
					currentVersion: '',
					id: null,
					idDoc: '',
				}
			}
		}
	}
}
