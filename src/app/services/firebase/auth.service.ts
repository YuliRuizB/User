import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { BehaviorSubject, of } from 'rxjs';
import { OpenpayService } from '../openpay/openpay.service';
import { UsersService } from './users.service';
import { StorageService } from '../storage/storage.service';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

export class Credentials {
  email: string;
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: firebase.User;
  userState: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(private auth: AngularFireAuth, private afs: AngularFirestore, private openpayService: OpenpayService, private usersService: UsersService, private storageService: StorageService) {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.user = user;
        this.storageService.setItem('user', JSON.stringify(this.user));
        // JSON.parse(this.localStorage.getItem('user'));
        this.afs.collection('users').doc(user.uid).valueChanges().subscribe( userDb => {
          this.userState.next(userDb);
        })
      } else {
        this.storageService.setItem('user', null);
        // JSON.parse(localStorage.getItem('user'));
        return of(null);
      }
    });

  }

  getUser() {
    return this.auth.authState;
  }

  getUserFromDB() {
    return this.userState;
  }

  signin(c: Credentials) {
		
    return this.auth.auth.signInWithEmailAndPassword(c.email, c.password);
  }

  signup(form) {
    return this.auth.auth.createUserWithEmailAndPassword(form.email, form.password);
  }

  signout() {
    return this.auth.auth.signOut();
  }

  sendVerificationMail() {
    return this.auth.auth.currentUser.sendEmailVerification();
  }

  sendPasswordResetEmail(email: string) {
    return this.auth.auth.sendPasswordResetEmail(email);
  }

  setUserData(user, result) {
    console.log(user);
    console.log(result);
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${result.uid}`);
    const userData = {
      uid: result.uid,
      email: result.email,
      displayName: `${user.firstName} ${user.lastName}`,
      firstName: user.firstName,
      lastName: user.lastName,
      photoURL: user.photoURL || "",
      emailVerified: result.emailVerified,
      address: {
        addressLine: '',
        city: '',
        postCode: '',
        state: ''
      },
      occupation: 'user',
      phone: '',
      refreshToken: '',
      roles: ['user'],
      socialNetworks: {
        facebook: '',
        instagram: '',
        apple: '',
        google: '',
        linkedIn: '',
        twitter: ''
      },
      username: user.firstName,
      _isEditMode: false,
      _userId: result.uid,
      customerName: user.customerName,
      customerId: user.customerId,
      studentId: user.studentId,
      terms: user.verifyTerms,
			rulesAccepted: user.verifyRules,
			roundTrip: user.typeTrip,
			defaultRoute: user.route,
			phoneNumber: user.phone,
			status: 'preRegister',
			dateCreateUserFormat: moment().format('l'),
			dateCreateUserFull: moment().format(),
			turno: user.turn
    }

    // let customerRequest = {
    //   creation_date: new Date().toISOString(),
    //   name: user.firstName,
    //   last_name: user.lastName,
    //   email: result.email,
    //   phone_number: null,
    //   external_id: result.uid,
    //   requires_account: false,
    //   status: "active"
    // }

    return userRef.set(userData, {merge: true});
    // .then( () => {
    //   return this.openpayService.newOpenpayCustomer(customerRequest)
    // })
    
  }

  forgotPassword(email: string) {
    return this.auth.auth.sendPasswordResetEmail(email);
  }

  resendVerificationEmail() {
    return this.user.sendEmailVerification();
  }
}
