import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
@Component({
  selector: 'app-update-store-modal',
  templateUrl: './update-store-modal.page.html',
  styleUrls: ['./update-store-modal.page.scss'],
})
export class UpdateStoreModalPage implements OnInit {

  constructor(private iab: InAppBrowser,private platform: Platform,) { }

  ngOnInit() {
  }
	
	load() {
		// window.open("https://play.google.com/store/apps/details?id=com.adn.userv12023");
		let url = '';

    if (this.platform.is('android')) {
      url = 'market://details?id=com.adn.userv12023'; // Use market:// for Play Store
    } else if (this.platform.is('ios')) {
      url = 'itms-apps://itunes.apple.com/app/idYOUR_APP_ID'; // Use itms-apps:// for App Store
    }

    const browser = this.iab.create(url, '_system');
	}
}
