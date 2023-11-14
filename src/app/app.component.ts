import { Component } from '@angular/core';
import { Platform, NavController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/firebase/auth.service';
import { StorageService } from './services/storage/storage.service';
import { FCM } from '@ionic-native/fcm/ngx';
import { UsersService } from './services/firebase/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent {

  user: any;

  public appPages = [
    {
      title: 'Paradas Cercanas',
      subtitle: 'Ver todas las paradas cercanas',
      url: '/home',
      icon: 'navigate-circle',
      color: 'primary'
    },
    {
      title: 'Mensajes',
      subtitle: 'Centro de mensajes',
      url: '/notifications/messages',
      icon: 'notifications-circle-outline',
      color: 'primary'
    },
    {
      title: 'Promociones',
      subtitle: 'Checa las promociones que tenemos para tí',
      url: '/promotions',
      icon: 'gift',
      color: 'success'
    },
    {
      title: 'Compartir',
      subtitle: 'Comparte la app con tus padres y compañeros',
      url: '/share',
      icon: 'share',
      color: 'primary'
    },
    {
      title: 'Mis pases',
      subtitle: 'No pierdas el bus, administra tus pagos',
      url: '/purchases',
      icon: 'qr-code-outline',
      color: 'primary'
    },
    {
      title: 'Preguntas Frecuentes',
      subtitle: 'Tus dudas pueden resolverse, consulta aqui',
      url: '/faq',
      icon: 'chatbubble-ellipses',
      color: 'primary'
    },
    {
      title: 'Reglamento',
      subtitle: 'Reglamento de Bus2U',
      url: '/regulation',
      icon: 'newspaper',  
      color: 'primary'
    },
    {
      title: 'Contactémonos',
      subtitle: 'Tus comentarios son importantes',
      url: '/contact-us',
      icon: 'chatbubbles',
      color: 'warning'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private navController: NavController,
    private storageService: StorageService,
    private usersService: UsersService,
    private fcm: FCM,
    private router: Router,
    public toastController: ToastController
  ) {
    this.authService.getUserFromDB().subscribe( (user) => {
      this.user = user;
      //console.log("1-" + this.user);
      if(this.user === undefined) {
        this.signout();
      }
    })
    setTimeout(() => {
      this.initializeApp();
    }, 500);
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
			// await this.storageService.forceSettings();
      this.fcm.onNotification().subscribe(data => {
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
}
