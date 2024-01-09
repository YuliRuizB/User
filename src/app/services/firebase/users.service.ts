import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase/app';
import { IUserData } from 'src/app/models/models';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  users: AngularFirestoreCollection;
  user: AngularFirestoreDocument;
	batch: any;
  constructor(private afs: AngularFirestore, private fbStorage: AngularFireStorage) {
    this.users = this.afs.collection('users');
		this.batch = this.afs.firestore.batch();
		// this.afs.firestore.batch
  }

  getUser(uid: string) {
		this.afs.firestore.batch
    const user = this.afs.collection('users').doc(uid);
    return user.snapshotChanges();
  }

	// This method use for testing is not use in productions
	getUserAllProd() {
    const user = this.afs.collection('usersCopy08122023');
    return user.snapshotChanges()
  }

	// This method use for testing is not use in productions
	getUserAll2() {
		//usersCopy05122023
    const user = this.afs.collection('usersCopy23112023')
    return user.snapshotChanges();
  }

	// This method use for testing is not use in productions
	async setUserAll(uid, data) {
		return new Promise((resolve) => {
			const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);
			userRef.set(data, {merge: true}).then(() => {
				resolve(true)
			}).catch((err) => {
				resolve(false)
			})
		})
  }

	// This method use for testing is not use in productions
	async setUserAllProd(uid, data) {
		return new Promise((resolve) => {
			const userRef: AngularFirestoreDocument<any> = this.afs.doc(`usersTest/${uid}`);
			userRef.set(data, {merge: true}).then(() => {
				resolve(true)
			})
		})
  }

	// This method use for testing is not use in productions
	async batchSet(data: any, id) {
		const batch = this.afs.firestore.batch();
		const insert =  this.afs.collection('usersCopy23112023').doc(id).ref; // Don't forget this ".ref"
		batch.set(insert, data);
		return this.batch.commit()
	}

	// This method use for testing is not use in productions
	updateUserId(uid: any) {
    const user = this.afs.collection('users').doc(uid);
    return user.update({
			roundTrip: '',
			status: 'inactive'
		});
  }

	getUserPreregisterByRoute(user: IUserData) {
		console.log(user);
		return new Promise((resolve, reject) => {
			this.afs.collection('users').ref.where("status","==", "preRegister").where("defaultRoute", "==" ,user.defaultRoute).where("turno", "==", user.turno)
			.get().then((doc) => {
				if(doc.empty){
					resolve(false);
				}else{
					let filterData = []
					doc.forEach(element => {
						filterData.push(element.data());
					});
					resolve(filterData)
				}
			}).catch((error) => {
				console.log(error)
			})
		})
  }

  registerToken(uid: string, token: string) {
    console.log('got a new token for ', uid, ', token is: ', token);
    const user = this.afs.collection('users').doc(uid);
    return user.update({
      token: token
    });
  }

  registerAPNSToken(uid: string, token: string) {
    console.log('got a new token for ', uid, ', token is: ', token);
    const user = this.afs.collection('users').doc(uid);
    return user.update({
      apnsToken: token
    });
  }

  updateUserPreference(uid: string, preference: object) {
    console.log('will save db preference: ', uid, preference);
    const user = this.users.doc(uid);
    return user.update(preference);
  }
  updateUserTerms(uid: string, terms: boolean) {
    const user = this.users.doc(uid);
    return user.update({"terms": terms});
  }


  uploadImage(imageURI) {
    return new Promise<any>((resolve, reject) => {
      let storageRef = firebase.storage().ref();
      let imageRef = storageRef.child('image').child('imageName');
      this.encodeImageUri(imageURI, function (image64) {
        imageRef.putString(image64, 'data_url')
          .then(snapshot => {
            resolve(snapshot.downloadURL)
          }, err => {
            reject(err);
          })
      })
    })
  }

  encodeImageUri(imageUri, callback) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      var aux: any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/jpeg");
      callback(dataURL);
    };
    img.src = imageUri;
  }

  setReminder(uid: string, reminder: any) {
    const remindersRef = this.users.doc(uid).collection('reminders');
    return remindersRef.add(reminder);
  }

  getReminders(uid: string) {
    const remindersRef = this.users.doc(uid).collection('reminders');
    return remindersRef.snapshotChanges();
  }

  updateReminder(uid: string, doc: string, reminder: any) {
    const reminderDoc = this.users.doc(uid).collection('reminders').doc(doc);
    return reminderDoc.update(reminder);
  }

  deleteReminder(uid: string, doc: string) {
    const reminderDoc = this.users.doc(uid).collection('reminders').doc(doc);
    return reminderDoc.delete();
  }


}
