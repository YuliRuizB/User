import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ToastController } from '@ionic/angular';
import { tap, map } from 'rxjs/operators';

// Import firebase to fix temporary bug in AngularFire
import * as app from 'firebase';
import { Observable, of } from 'rxjs';
import { FCM } from '@ionic-native/fcm/ngx';
// import { FirebaseX } from "@ionic-native/firebase-x/ngx";
@Injectable({
  providedIn: 'root'
})
export class FcmService {

  token;
  hasPermission: Observable<any>;
  canShowMessages: Observable<any>;

  constructor(
    // private afMessaging: FirebaseX,
    private fun: AngularFireFunctions,
    private toastController: ToastController
  ) {

    // Bind methods to fix temporary bug in AngularFire
    try {
      const _messaging = app.messaging();
      _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      _messaging.onMessage = _messaging.onMessage.bind(_messaging);
    } catch(e) {}

  }

  async makeToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 5000,
      position: 'top'
    });
    toast.present();
  }

  getPermission(): Observable<any>  {
    return this.hasPermission;
  }
  
  showMessages(): Observable<any> {
    return this.canShowMessages;
  }

  sub(topic) {
    this.fun
      .httpsCallable('subscribeToTopic')({ topic, token: this.token })
      .pipe(tap(_ => this.makeToast(`subscribed to ${topic}`)))
      .subscribe();
  }
  
  unsub(topic) {
    this.fun
      .httpsCallable('unsubscribeFromTopic')({ topic, token: this.token })
      .pipe(tap(_ => this.makeToast(`unsubscribed from ${topic}`)))
      .subscribe();
  }

}