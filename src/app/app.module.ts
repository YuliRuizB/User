import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

//Locale
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localEs from '@angular/common/locales/es-MX';

// the second parameter 'fr' is optional
registerLocaleData(localEs, 'es-MX');

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

//Storage
import { IonicStorageModule } from '@ionic/storage';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//Firebase
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireFunctionsModule, FUNCTIONS_REGION } from '@angular/fire/functions';
import { AngularFireAuthGuard, AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFireStorageModule } from '@angular/fire/storage';


//FCM // OLD Cordova 9
//import { FCM } from '@ionic-native/fcm/ngx';

//FCM // New Cordova 12
import { FirebaseX } from "@ionic-native/firebase-x/ngx";
import { HttpClientModule } from '@angular/common/http';

//Device Id
import { Device } from '@ionic-native/device/ngx';

// QR Code
import { NgxQRCodeModule } from 'ngx-qrcode2';

//Geolocation
import { Geolocation } from '@ionic-native/geolocation/ngx';

//Camera
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { PhoneMaskDirective } from './directives/phoneMask/phone-mask.directive';
import { InfoUserPreRegisterModalPageModule } from './modals/info-user-pre-register-modal/info-user-pre-register-modal.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { AndroidPermissions }  from '@ionic-native/android-permissions/ngx';
import { StopsListPageModule }  from '../app/pages/notifications/stops-list/stops-list.module';
import { StopPointsPageModule } from '../app/pages/purchases/products/product-details/stop-points/stop-points.module';
import { BusInfoPageModule } from '../app/pages/home/bus-info/bus-info.module'
import { StationInfoPageModule } from '../app/pages/home/station-info/station-info.module'
import  { PromotionDetailsPageModule } from '../app/pages/promotions/promotion-details/promotion-details.module'
@NgModule({
  declarations: [AppComponent, PhoneMaskDirective],
  entryComponents: [],
	exports: [
		PhoneMaskDirective
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireFunctionsModule,
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    AngularFireStorageModule,    
    HttpClientModule,
    NgxQRCodeModule,
		InfoUserPreRegisterModalPageModule,
		StopsListPageModule,
		StopPointsPageModule,
		BusInfoPageModule,
		StationInfoPageModule,
		PromotionDetailsPageModule,
    IonicStorageModule.forRoot(
			{driverOrder: ['indexeddb', 'sqlite', 'websql']}
		),
		NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    // FCM,
		FirebaseX,
    Device,
    SocialSharing,
    Camera,
    File,
		AndroidPermissions,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FirestoreSettingsToken, useValue: {} },
    { provide: LOCALE_ID, useValue: "es-MX" },
    { provide: FUNCTIONS_REGION, useValue: 'us-central1' },
    AngularFireAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
