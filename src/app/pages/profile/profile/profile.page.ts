import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from '@angular/fire/storage';
import * as firebase from 'firebase/app';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController, NavController, AlertController } from '@ionic/angular';
import { IUserData } from 'src/app/models/models';
import { StorageService } from 'src/app/services/storage/storage.service';
import { UsersService } from 'src/app/services/firebase/users.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { File } from '@ionic-native/file/ngx';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { CustomersService } from 'src/app/services/firebase/customers.service';
import { AuthService } from '../../../services/firebase/auth.service';

export interface Image {
  id: string;
  image: string;
}

export interface ProfileImage {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  profile: FormGroup;
  user: firebase.User;
  loading = false;
  currentImage: any;
  userData: IUserData;
  userBucketPath: string = '';
  uploadPercent: Observable<number>;
  uploadvalue: number = 0;
  downloadURL: Observable<string>;
  roundOptions = [];
  roundName: string = "";
  stopsOptions = [];


  // Upload Task 
  task: AngularFireUploadTask;
  // Progress in percentage
  percentage: Observable<number>;
  // Snapshot of uploading file
  snapshot: Observable<any>;
  // Uploaded File URL
  UploadedFileURL: Observable<string>;
  //Uploaded Image List
  images: Observable<ProfileImage[]>;

  croppedImagepath = "";
  isLoading = false;

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };

  constructor(private auth: AngularFireAuth,
    private usersService: UsersService,
    private navCtrl: NavController, 
    private storageService: StorageService,
    public actionSheetController: ActionSheetController,
    private camera: Camera,
    private file: File,
    public customersService: CustomersService,
    private formBuilder: FormBuilder,
    private afs: AngularFirestore,
    private bucketStorage: AngularFireStorage,
    private _AlertController: AlertController,
    private _AuthService: AuthService
    ) {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.getSubscriptions(user.uid);
        this.user = user;
        this.userBucketPath = `students/pictureIds/${this.user.uid}.jpeg`;
      }
    });
  }

  ngOnInit() {
    this.storageService.getItem('userData').then((userData) => {
      this.userData = JSON.parse(userData);
      console.log(this.userData.defaultRoute);
      this.roundName = this.userData.defaultRouteName;
      //console.log("this.userData");
      console.log(this.userData);     
      this.customersService.getRoutesByCustomer(this.userData.customerId).pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      ).subscribe( (routes) => {
        console.log("routes");
        console.log(routes);
        this.roundOptions = routes;        
      })

      this.customersService.getRouteStopPoints(this.userData.customerId,this.userData.defaultRoute).pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      ).subscribe( (stops) => {
        console.log("rostopsutes");
        console.log(stops);
        this.stopsOptions = stops;        
      })

    });
    if (this.user) {
      console.log("this.user");
      console.log(this.user);
    }
  }

  getSubscriptions(uid: string) {
    this.usersService.getUser(uid).pipe(
      map(a => {
        const data = a.payload.data() as any;
        const id = a.payload.id;
        return { id, ...data };
      })
    ).subscribe( (user) => {
      this.userData = user;
    })
  }

  updateData(userDataElement: string, event) {
    
    let newData = event.target.value;
    if (this.userData[userDataElement] != newData) {
      if(userDataElement == 'firstName') {
        this.usersService.updateUserPreference(this.user.uid, {
          [userDataElement]: newData,
          displayName: newData
        });
        this.updateProfile('displayName', event);
      } else {
        this.usersService.updateUserPreference(this.user.uid, {
          [userDataElement]: newData
        });
      }
    }
  }

  updateEmail(event) {
    let user = firebase.auth().currentUser;
    if (user.email != event.target.value) {
      user.updateEmail(event.target.value).then(function () {
        // Update successful.
      }).catch(function (error) {
        // An error happened.
      });
    }
  }

  updateProfile(profileElement: string, event) {
    let user = firebase.auth().currentUser;
    if (user[profileElement] != event.target.value) {
      user.updateProfile({
        [profileElement]: event.target.value
      }).then(() => {
        console.log('update successful');
        // this.updateData(profileElement, event);
      }).catch((error) => {
        console.log('update error: ', error);
      });
    }
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: sourceType,
      encodingType: this.camera.EncodingType.JPEG,
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      console.log('imageData: ', imageData);
      this.loading = true;
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      const fileRef = this.bucketStorage.ref(this.userBucketPath);
      // this.task = this.bucketStorage.upload(this.userBucketPath, base64Image);
      this.task = this.bucketStorage.ref(this.userBucketPath).putString(base64Image, 'data_url');

      // observe percentage changes
      this.uploadPercent = this.task.percentageChanges();
      this.uploadPercent.pipe(
        map(a => {
          return Number((a/100).toFixed(2));
        })
      ).subscribe((value) => {
        this.loading = value != 0;
        this.uploadvalue = value;
      })

      // get notified when the download URL is available
      this.task.snapshotChanges().pipe(
        finalize(() => {
          this.loading = false;
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(async (url) => {
            let user = firebase.auth().currentUser;
            this.updatePhotoURL(url);
            this.usersService.updateUserPreference(user.uid, { photoURL: url });
          });
        })
      ).subscribe();

    }, (err) => {
      console.log(err);
      this.loading = false;
    });
  }

  async updatePhotoURL(url) {
    let user = firebase.auth().currentUser;
    console.log("started updatePhotoURL with url: ", url);
    await user.updateProfile({ photoURL: url }).then((response) => {
      this.loading = false;
      return console.log(response);

    }, err => { 
      this.loading = false;
      return console.log('error, ', err) });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Cambiar imágen desde",
      buttons: [{
        text: 'Galería de imágenes',
        icon: 'images',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Cámara',
        icon: 'camera',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  takePicture() {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });

  }

  updateMyInfo(){
    //this.navCtrl.navigateForward('/profile-detail'); 
    console.log("data");

  }

  initializeFormGroup() {
    this.profile = this.formBuilder.group({
      displayName: ['', Validators.compose([Validators.required, Validators.email])],
      photoUrl: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    })
  }

  onRoundSelect(event: any) {
    console.log('Selected Round:', this.roundName);
    console.log('Event:', event);
    // Add your custom logic here
  }

  async delete()
  {
    const alert = await this._AlertController.create({
      cssClass: 'my-custom-class',
      header: '¿Deseas eliminar su cuenta?',
      subHeader: 'Al presionar eliminar su cuenta sera borrada',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.signout();
          },
        },
      ],
    });

    await alert.present();
  }

  signout() {
    this._AuthService.signout().then( () => {
      this.storageService.forceSettings();
      this.navCtrl.navigateBack('auth');
    })
  }

}
