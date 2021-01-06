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

//FCM
import { FCM } from '@ionic-native/fcm/ngx';
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

@NgModule({
  declarations: [AppComponent],
  entryComponents: [ ],
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
    IonicStorageModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    FCM,
    Device,
    SocialSharing,
    Camera,
    File,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FirestoreSettingsToken, useValue: {} },
    { provide: LOCALE_ID, useValue: "es-MX" },
    { provide: FUNCTIONS_REGION, useValue: 'us-central1' },
    AngularFireAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
