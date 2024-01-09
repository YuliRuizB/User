import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ProductsService } from 'src/app/services/firebase/products.service';
import { map } from 'rxjs/operators';
import { StopPointsService } from 'src/app/services/firebase/stop-points.service';
import * as _ from 'lodash';
import { ModalController, ActionSheetController, NavController } from '@ionic/angular';
import { StopPointsPage } from './stop-points/stop-points.page';
import { PaymentMethodsService } from 'src/app/services/firebase/payment-methods.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { IUserData, IRoles,IProduct, IPayNowReference } from '../../../../models/models';
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {

  productId = null;
  paymentMethods: any;
  paymentMethodsButtons: any = [];
  product: IProduct = {
		id: '',
		validTo: {
			seconds: 0,
			nanoseconds: 0
		},
		timesSold: 0,
		rangeDatePicker: [
			{
				seconds: 0,
				nanoseconds: 0
			},
			{
				seconds: 0,
				nanoseconds: 0
			}
		],
		price: 0,
		date_created: {
			seconds: 0,
			nanoseconds: 0
		},
		type: '',
		isTaskOut: false,
		validFrom: {
			seconds: 0,
			nanoseconds: 0
		},
		category: '',
		name: '',
		active: false,
		description: '',
		isTaskIn: false
	};
  stopPoints: any = [];
  loading = true;
  productDetailsForm: FormGroup;
  user: IUserData;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private productsService: ProductsService,
    private stopPointsService: StopPointsService,
    private paymentMethodsService: PaymentMethodsService,
    public actionSheetController: ActionSheetController,
    public navController: NavController,
    private storageService: StorageService,
    public modalController: ModalController) { 
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.productId);
  }

  ngOnInit() {
    this.storageService.getItem('userData').then( (userData) => {
      this.user = JSON.parse(userData);
      this.getSubscriptions();
    });
    this.productDetailsForm = this.formBuilder.group({
      round: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      stopName: ['', Validators.required],
      stopId: ['', Validators.required],
      stopDescription: ['', Validators.required],
      routeId: ['', Validators.required],
      routeName: ['', Validators.required]
    });
  }

  getSubscriptions() {
    this.productsService.getProduct(this.user, this.productId).pipe(
      map(action => {
        const data = action.payload.data();
        const id = action.payload.id;
        return { id, ...data };
    })
    ).subscribe( (product: IProduct) => {
			console.log('este es el producto payNow')
      console.log(product);
      this.product = product;
      this.loading = false;
    });

    this.stopPointsService.getActiveStopPoints(this.user).pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).subscribe( (stoppoints) => {
      console.log(stoppoints);
      this.stopPoints = _.sortBy(stoppoints, "name", "desc");
      this.loading = false;
    });

    this.paymentMethodsService.getActivePaymentMethods(this.user).pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).subscribe((methods) => {
      this.paymentMethods = methods;
      this.createActionSheetButtons(methods);
    });
  }

  createActionSheetButtons(methods) {

    this.paymentMethodsButtons = [];
      methods.forEach( (method) => {
        const button = {
          text: method.name,
          icon: method.icon,
          handler: () => {
            this.navController.navigateForward(method.userNavigation);
          }
        };
        this.paymentMethodsButtons.push(button);
      })
      this.paymentMethodsButtons.push({
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel: blah');
        }
      });

  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: StopPointsPage,
      componentProps: {
        stopPoints: this.stopPoints
      }
    });
    
    modal.onWillDismiss().then((stopPoint) => {
      const stopPointSelected = stopPoint.data.data;
			console.log('stopPointSelected')
      console.log(stopPointSelected);
			//Se arma esta estructura 
			// { stopName: '', stopId: '', stopDescription: '', routeId: '', routeName: ''}
      this.productDetailsForm.controls['stopName'].setValue(stopPointSelected.name);
      this.productDetailsForm.controls['stopId'].setValue(stopPointSelected.id);
      this.productDetailsForm.controls['stopDescription'].setValue(stopPointSelected.description);
      this.productDetailsForm.controls['routeId'].setValue(stopPointSelected.routeId);
      this.productDetailsForm.controls['routeName'].setValue(stopPointSelected.routeName);
      console.log(this.productDetailsForm.value);
    })

    return await modal.present();
  }

  submitForm() {
    console.log(this.productDetailsForm.value);
    const purchaseRequest: IPayNowReference = {...this.product, ...this.productDetailsForm.value, active: true};
		console.log('payNowReference4 llenado');
		console.log(this.product)
		console.log(this.productDetailsForm.value)
    console.log(purchaseRequest);
    localStorage.setItem('payNowReference', JSON.stringify(purchaseRequest));
		console.log('payNowReference4');
		console.log(purchaseRequest);
    this.presentActionSheet(purchaseRequest);
  }

  async presentActionSheet(product) {

    const actionSheet = await this.actionSheetController.create({
      header: 'Seleccionar método de pago',
      buttons: this.paymentMethodsButtons
    });
    await actionSheet.present();
  }

}
