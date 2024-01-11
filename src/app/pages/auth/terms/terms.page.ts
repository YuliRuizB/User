import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import {  ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage implements OnInit {

  contactUsInfo: any = {};
  message: any = '';
  userData: any;
  button = false;
  loading = false;
  public fromPage: boolean= false;

  constructor( public toastController: ToastController, private activatedRoute: ActivatedRoute
  ) { 
    
  }

  ngOnInit() { 
    this.activatedRoute.params.subscribe(params => {
      let from = params['from'];
      this.fromPage = from == 1 ? true : false;
      
      console.log(`${from}`);
			console.log(this.fromPage)
      });
  }

 
}
