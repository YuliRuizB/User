import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController, ToastController, LoadingController} from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { StorageService } from "../../../../services/storage/storage.service";
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { ProductsService } from '../../../../services/firebase/products.service';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.page.html',
  styleUrls: ['./transfers.page.scss'],
})
export class TransfersPage implements OnInit {
	zoomLevel: any = 1.0;
	page: any = 1;
  totalPages: number;

	data: any = null;
	selectedValueFormat: any = null;
	convert: string | any = '';
	fileName: string = '';
	loading: number = 1;
	pdfUrl: any = null;
	pdfBlob: Blob;


	userBucketPath: string = '';
	percentage: Observable<number> | any;
	task: AngularFireUploadTask | any
	uploadPercent: Observable<number> | any;
	downloadURL: Observable<string> | any;

	user: any;
	token: string = '';
	@ViewChild('pdfViewerContainer', { static: false }) pdfViewerContainer: ElementRef;
  constructor(private _ActivatedRoute: ActivatedRoute, private _ToastController: ToastController,private sanitizer: DomSanitizer,
		private _LoadingController: LoadingController, private _BucketStorage: AngularFireStorage, private storageService: StorageService,
		private _ProductsService: ProductsService,  private fcm: FirebaseX,
	) { }

  ngOnInit() {
		this._ActivatedRoute.queryParams.subscribe(params => {
			this.data = params
			this.loading = 1;
		});

		this.storageService.getItem("userData").then(async (userData) => {
      this.user = JSON.parse(userData);
		})

		this.fcm.getToken().then((token) => {
      console.log("getToken() from homepage");
			console.log(token);
			this.token = token;
    });
  }

	onSelectionChange(event) {
		this.rmImage()
	}

	async onFileSelectedPortadaSend(event, flag){
		if (event.target.files[0].type !== "image/png" && event.target.files[0].type !== "image/jpg" && event.target.files[0].type !== "image/jpeg" && event.target.files[0].type !== 'application/pdf') {
			this.presentToast('Formato invalido1', 3000, 'danger');
			console.log('millon')
			event.target.value = '';
			return
		}else{
			if (this.selectedValueFormat === 'img'  && event.target.files[0].type !== "image/png" && event.target.files[0].type !== "image/jpg" && event.target.files[0].type !== "image/jpeg") {
				this.presentToast('Formato invalido2', 3000, 'danger');
				event.target.value = '';
				return
			}

			if (this.selectedValueFormat === 'pdf'  && event.target.files[0].type !== 'application/pdf') {
				this.presentToast('Formato invalido3', 3000, 'danger');
				event.target.value = '';
				return
			}

			this.fileName = event.target.files[0].name;
			const fileBase64Convert = await this.readFileAsBase64(event.target.files[0]);
			if (this.selectedValueFormat === 'img') {
				this.convert = fileBase64Convert.replace(/^"(.*)"$/, '$1');
			}else{
				let base = fileBase64Convert.replace(/^"(.*)"$/, '$1');
				this.convert = this.sanitizer.bypassSecurityTrustResourceUrl(base);

				let ss = this.convert.changingThisBreaksApplicationSecurity.split(',');
				const file = event.target.files[0];
				if (file) {
					const reader = new FileReader();
					reader.onload = (e: any) => {
						// this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
						const base64String = e.target.result.split(',')[1];
						this.pdfUrl = this.base64ToUint8Array(base64String);
					};
					reader.readAsDataURL(file);
				}
				// this.pdfUrl = this.base64ToBlobUrl(ss[1], 'application/pdf');
				console.log('url')
				console.log(this.pdfUrl)
			}
			event.target.value = '';
		
		}
	}

	base64ToUint8Array(base64: string): Uint8Array {
    const raw = atob(base64);
    const uint8Array = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      uint8Array[i] = raw.charCodeAt(i);
    }
    return uint8Array;
  }

  base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

	private readFileAsBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };

      reader.onerror = () => {
        reject(new Error('Failed to read the file.'));
      };

      reader.readAsDataURL(file);
    });
  }

	base64ToBlobUrl(base64: string, contentType: string): string {
    // Limpiar la cadena base64 y agregar padding si es necesario
		console.log(base64)
    const cleanBase64 = this.padBase64(base64.replace(/[^A-Za-z0-9+/=]/g, ''));

    // Decodificar la base64 a bytes
    const byteCharacters = atob(cleanBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    // Crear un blob con los bytes decodificados
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: contentType });

    // Crear una URL para el blob
    return URL.createObjectURL(blob);
  }

  padBase64(base64: string): string {
    const padding = '='.repeat((4 - base64.length % 4) % 4);
    return base64 + padding;
  }

	rm2() {
		this.selectedValueFormat = null;
		this.rmImage();
	}

	rmImage() {
		// this.selectedValueFormat = null;
		this.convert = '';
		this.fileName = '';
	}

	show(flag) {
		this.loading = flag;
	}

	closePhoto() {
		this.loading = 1;
	}

	async presentToast(message: string, duration: number, color: string) {
    const toast = await this._ToastController.create({
      message,
      duration,
      color,
    });
    toast.present();
  }

	onPdfClick() {
    this.zoomLevel += 0.5;
    if (this.zoomLevel > 3.0) { 
      this.zoomLevel = 1.0; 
    }
  }

	onPdfTouch() {
    this.zoomLevel += 0.5;
    if (this.zoomLevel > 3.0) { 
      this.zoomLevel = 1.0; 
    }
  }

	async load( ) {

		const loading = await this._LoadingController.create({
			message: 'Subiendo registro...',
		});
		await loading.present();

	
		const dateTimeId = moment().format('DD-MM-YYYY-hh:mm:ss');
		const dateTime = moment().format('DD-MM-YYYY hh:mm:ss');
		const date = moment().format('DD-MM-YYYY');
		const urlImage  = await this.uploadImage(dateTimeId)

		await this._ProductsService.insertTransferSubCollection(this.user, urlImage, this.data.product, this.data.stopInfo, dateTime, date, this.token);
		await this._ProductsService.insertTransferCollection(this.user, urlImage, this.data.product, this.data.stopInfo, dateTime, date, this.token);
		this.presentToast('Envio exitoso',3000, 'success');
		loading.dismiss();
	}

	uploadImage(dateTimeId: any) {
		return new Promise((resolve, rejects) => {
		let sendBase = '';
		if (this.selectedValueFormat === 'pdf') {
			this.userBucketPath = `transfers/user/${this.user.uid}-${dateTimeId}.pdf`;
			sendBase = this.convert.changingThisBreaksApplicationSecurity
			
		}else{
			this.userBucketPath = `transfers/user/${this.user.uid}-${dateTimeId}.jpeg`;
			sendBase = this.convert;
		}

		const fileRef = this._BucketStorage.ref(this.userBucketPath);
    this.task = this._BucketStorage.ref(this.userBucketPath).putString(sendBase, 'data_url');

      // observe percentage changes
      this.uploadPercent = this.task.percentageChanges();

			this.task.snapshotChanges().pipe(
        finalize(() => {

          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(async (url: any) => {
						// const response1 =  await this._DriverEvidenceService.insertDriverEvidenceInside(sendData, url);
						resolve(url);
          },(e: any) => {
						resolve(false)
						this.presentToast(`Problemas al subir la imagen:2 - ${e}`,3000, 'danger')
					})
        })
      ).subscribe(() => {

			},(error: any) => {
				// loading.dismiss();
				resolve(false)
				this.presentToast('Problemas al subir la imagen:1',3000, 'danger')
			})
		})
			
	}

}
