import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController, NavController, ToastController } from '@ionic/angular';
import { OpenpayService } from 'src/app/services/openpay/openpay.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ToastService } from 'src/app/services/toast.service'
import { ErrorCodes } from 'src/app/services/openpay/error-codes';
import { UsersService } from "../../../../services/firebase/users.service";
import { map, take, filter } from "rxjs/operators";
import { IUserData, IPayNowReference, ICardCustomerData } from '../../../../models/models';
declare var OpenPay: any;

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.page.html',
  styleUrls: ['./purchase.page.scss'],
})
export class PurchasePage implements OnInit {

  deviceSessionId: any;
  userData: IUserData;
  product: IPayNowReference;
  token_id: any;
  errorCodes = ErrorCodes;
  newCardChargeRequest: any = {};
  card =
    {
      state: 'OFF',
      logo: "assets/img/visa.png",
      logo2: "assets/img/mastercard.png",
      logo3: "assets/img/american.png",
      a: 1234,
      b: 5522,
      c: 8432,
      d: 2264,
      expires: '',
      bank: 'CVV'
    };
  loading: HTMLIonLoadingElement;
  agreed = false;
  holderName = "";

  constructor(
    private storageService: StorageService,
    public toastController: ToastController,
    private navController: NavController,
    private openpayService: OpenpayService,
    public loadingController: LoadingController,
    public alertController: AlertController,
		public _UsersService:UsersService,
		private _ToastService: ToastService
		) {
    //old  OpenPay.setId('mptiot2sftktydvpfgxj');
    // old OpenPay.setApiKey('pk_7dccea88359847118d24d3fefa8f8595');
		/*Prod*/ // OpenPay.setId('msbxvjptsxwkbl40zaky');
    /*Prod*/ // OpenPay.setApiKey('pk_c72df91dae844dd99d86d7b6795eb1ca');
		// Tester Ali: OpenPay.setId('m0lhvrprbzv2sg8ajmki');
    // Teste Ali: OpenPay.setApiKey('pk_5bd6cfdeb8524fcfa4dc84f77404e09d');
		OpenPay.setId('msbxvjptsxwkbl40zaky');
		OpenPay.setApiKey('pk_c72df91dae844dd99d86d7b6795eb1ca');
    OpenPay.setSandboxMode(false);
    this.deviceSessionId = OpenPay.deviceData.setup("payment-form", "deviceIdHiddenFieldName");
    console.log(this.deviceSessionId);
    this.product = JSON.parse(localStorage.getItem('payNowReference'));
		console.log('el paynow')
		console.log(this.product);
  }

  ngOnInit() {
		console.log('alicarlo');
    this.storageService.getItem('userData').then((userData) => {
      this.userData = JSON.parse(userData);
    });

    var form = (<HTMLFormElement>document.getElementById('payment-form'));

    form.addEventListener('submit', event => {
      event.preventDefault();
      console.log('tep'+event);
      // $("#pay-button").prop("disabled", true);
      this.presentLoadingWithOptions();
      OpenPay.token.extractFormAndCreate('payment-form', success_callbak, error_callbak);
    });

    var success_callbak = (response) => {
			console.log('success')
      console.log(response);
      this.token_id = response.data.id;
      var token_input = (<HTMLInputElement>document.getElementById('token_id'));
			console.log('esto veo');
			console.log(token_input)
      const aux = token_input.setAttribute('value', this.token_id);
			console.log('esto veo2')
			console.log(aux);
      console.log(formToJSON(form.elements));
      if (response.data.card.points_card) {
        // Si la tarjeta permite usar puntos, mostrar el cuadro de diálogo
        this.loading.dismiss().then(() => {
          this.presentAlertConfirm();
        });
      } else {
        // De otra forma, realizar el pago inmediatamente
        this.createCardCharge(false);
      }
    };

    var error_callbak = (response) => {
			console.log('truena')
			console.log(response);
      this.loading.dismiss().then(() => {
        this.presentToastWithOptions(response);
      });
    };

    const formToJSON = elements => [].reduce.call(elements, (data, element) => {

      data[element.name] = element.value;
      return data;

    }, {});
		

  }

  async presentToastWithOptions(response: any) {
    console.log(response);
    const toast = await this.toastController.create({
      header: 'Error',
      message: `${response.data.error_code}: ${this.errorCodes[response.data.error_code]}`,
      position: 'bottom',
      color: 'danger',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

  async presentLoadingWithOptions() {
    this.loading = await this.loadingController.create({
      spinner: 'crescent',
      message: 'Realizando el cargo',
      translucent: true
    });

    this.loading.onDidDismiss().then(() => {

    });

    return await this.loading.present();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Pagar con puntos',
      message: '¿Desea usar los <strong>puntos</strong> de su tarjeta para realizar este pago?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.presentLoadingWithOptions().then(() => {
              this.createCardCharge(false);
            })
          }
        }, {
          text: 'Sí',
          handler: () => {
            this.presentLoadingWithOptions().then(() => {
              this.createCardCharge(true);
            })
          }
        }
      ]
    });

    await alert.present();
  }

	async updateUserData() {
		return new Promise((resolve, reject) => {
			this._UsersService.getUser(this.userData.uid).pipe(
				map(a => {
					const data = a.payload.data() as any;
					const id = a.payload.id;
					return { id, ...data };
					})
				).subscribe((userR: IUserData) => {
					console.log('esto manda hey');
					console.log(userR)
					this.storageService.setItem('userData', JSON.stringify(userR));
					resolve(true)
				},(error) => {
					resolve(false)
			})
		})
	}

  async presentAlertConfirmPayment(response: any) {

    let header, message, buttons: any;

    if (response.status === 'completed') {
      header = 'Cargo realizado',
        message = `Se realizó un cargo por ${response.currency} ${response.amount} a su tarjeta ${response.card.brand} por concepto de ${response.description}`,
        buttons = [{
          text: 'Enterado',
          handler: () => {
						
            this.navController.navigateBack('purchases');
          }
        }]
    } else {
        header = 'No se pudo realizar el cargo',
        message = `error ${response.error_code}: ${this.errorCodes[response.error_code]}`,
        buttons = [{
          text: 'Aceptar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('user cancelled transaction');
          }
        }]
    }
    const alert = await this.alertController.create({
      header, message, buttons
    });

    await alert.present();
  }

  createCardCharge(useCardPoints: boolean) {
    /*this.newCardChargeRequest = {
      source_id: this.token_id,
      method: 'card',
      device_session_id: this.deviceSessionId,
      amount: this.product.price,
      currency: this.product.currency,
      order_id: `${this.product.id}-${this.userData.id}-${Math.floor(100000000 + Math.random() * 900000000)}`,
      description: 'Para la ruta ' + this.product.routeName + ' ' + this.product.description + ' turno de ' + this.product.round + '. El servicio será prestado en la parada ' + this.product.stopName + ' (' + this.product.stopDescription + '). Usuario: ' + this.userData.displayName +' , Matricula: ' + this.userData.studentId + ' Telefono: '+ this.userData.phone,
      customer: {
        name: this.userData.firstName,
        last_name: this.userData.lastName,
        phone_number: this.userData.phone_number || '',
        email: this.userData.email
      }
    }*/

		const newCardChargeRequestAux: ICardCustomerData = {
			source_id: this.token_id,
			method: 'card',
			amount: this.product.price,
			currency: "MXN",
			description: 'Para la ruta ' + this.product.routeName + ' ' + this.product.description + ' turno de ' + this.product.round + '. El servicio será prestado en la parada ' + this.product.stopName + ' (' + this.product.stopDescription + '). Usuario: ' + this.userData.displayName +' , Matricula: ' + this.userData.studentId + ' Telefono: '+ this.userData.phone,
			device_session_id: this.deviceSessionId,
			customer: {
        name: this.userData.firstName,
        last_name: this.userData.lastName,
        phone_number: this.userData.phoneNumber || '',
        email: this.userData.email
      }

		}
    if (useCardPoints) {
      this.newCardChargeRequest.use_card_points = true;
    }

		console.log(newCardChargeRequestAux)
		console.log(this.product);
		console.log(this.userData);
    this.openpayService.newCardChargeRequest(newCardChargeRequestAux, this.product, this.userData).then(async (response: any) => {
			console.log('veooooooo')
			console.log(response);
			console.log(response.error_code)
			if (response.error_code !== undefined) {
				if (response.error_code === 3005) {
					this._ToastService.presentToast('Problemas con su Banco', 3000, 'danger')
					this.loading.dismiss();
				}
			}
			this.openpayService.createBoardingPass(response, this.userData).then(async(response2: any) => {
				console.log('funciones')
				console.log(response2)
				await this.updateUserData();
      	this.loading.dismiss().then(() => {
        	this.presentAlertConfirmPayment(response);
      	})
			})
			/**/
    }).catch((err) => {
			console.log('veo el error')
			console.log(err);
			console.log(err.error_code)
		})

  }

	// purchaseRequest: IPurchaseRequest, user: IUserData, idBoardingPass: string
	createPurchaseRequest() {
		this.openpayService.createPurchaseRequest(this.userData).then((resp) => {

		})
		
	 }

}
