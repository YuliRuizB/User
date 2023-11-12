import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { UsersService } from '../services/firebase/users.service';
import {  map } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { IUserData } from '../models/models';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.page.html',
  styleUrls: ['./profile-detail.page.scss'],
})
export class ProfileDetailPage implements OnInit {
  user: firebase.User;
  userBucketPath: string = '';
  userData: IUserData; 
  formGroup:FormGroup;

  constructor( private auth: AngularFireAuth,
    private usersService: UsersService,
    private navCtrl: NavController) { 
    this.auth.authState.subscribe((user) => {
      if (user) {
        console.log(user.uid);
        this.getSubscriptions(user.uid);
        this.user = user;
        this.userBucketPath = `students/pictureIds/${this.user.uid}.jpeg`;
      }
    });
  }
  submitForm() {

  }
  ngOnInit() {  
      console.log( this.user );
      if (this.user) {
        this.formGroup.controls['phoneNumber'].setValue(this.userData.phone);
      this.formGroup.controls['customerName'].setValue(this.userData.customerName);
      this.formGroup.controls['defaultRound'].setValue(this.userData.defaultRound);
      this.formGroup.controls['defaultStopName'].setValue(this.userData.defaultStopName);
      }
    
  }


  getSubscriptions(uid: string) {
    console.log("this.userData");
    this.usersService.getUser(uid).pipe(
      map(a => {
        const data = a.payload.data() as any;
        const id = a.payload.id;
        return { id, ...data };
      })
    ).subscribe( (user) => {
      this.userData = user;
      console.log("this.userData");
      console.log(this.userData);
    })
  }

  backMyInfo(){
    this.navCtrl.navigateForward('/profile'); 
  }

}
