import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CustomersService } from 'src/app/services/firebase/customers.service';
import { BusesService } from 'src/app/services/firebase/buses.service';
import { map } from 'rxjs/operators';
import { ToastService } from 'src/app/services/toast.service';
import { NavController, AlertController} from '@ionic/angular';
import * as _ from 'lodash';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  signupForm: FormGroup;
  customersList: any = [];
  loading = false;
  canDismiss = null;
  presentingElement = null;
  public isValidFlg:boolean = true;
	routes: any = [];
	typeTrip: any = [
		{ name: 'sencillo'},
		{ name: 'redondo'}
	]

	turn: any = [
		{ id: 0, name: 'No Definido'},
		{ id: 1, name: 'Matutino'},
		{ id: 2,name: 'Vespertino'},
		{ id: 3,name: 'Nocturno'},
		// { name: 'no definido'},
	]
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private customersService: CustomersService,
    public toastService: ToastService,
    public navController: NavController,
    public alertController: AlertController,
		private _BusesService: BusesService
  ) { }

  ngOnInit() {
    this.createForm();
    this.getSubscriptions();
    this.presentingElement = document.querySelector('.ion-page');
  }

  createForm() {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.compose([Validators.required, Validators.maxLength(30), Validators.minLength(5)])],
      lastName: ['', Validators.compose([Validators.required, Validators.maxLength(30), Validators.minLength(5)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
			phone:['',Validators.required],
      studentId: ['', Validators.compose([ Validators.required])],
      customerId: ['', Validators.compose([Validators.required])],
      customerName: ['', Validators.compose([Validators.required])],
			route: ['', Validators.compose([Validators.required])],
			typeTrip: ['', Validators.compose([Validators.required])],
			turn: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      verifyPassword: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      verifyTerms:  ['', Validators.compose([Validators.required,Validators.requiredTrue])],
			verifyRules:  ['', Validators.compose([Validators.required,Validators.requiredTrue])]
    });
  }



  getSubscriptions() {
    this.loading = true;
    this.customersService.getCustomersPublicList().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).subscribe( (customers) => {
      console.log(customers);
      this.customersList = customers;
      this.loading = false;
    })
  }

  onChange(event) {
    console.log(event.target.value);
    const selected = event.target.value;
    const customerName = _.find(this.customersList, (o) => {
      return o.id == selected;
    });
    this.signupForm.controls['customerName'].setValue(customerName.name);
    console.log(this.signupForm.value);
		this.getRoutes(event.target.value);
  }

	getRoutes(customerId: string) {
		this._BusesService
      .getUserActiveRoutesId(customerId)
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      )
      .subscribe((routes) => {
        console.log('esto regresa');
				console.log(routes)
				this.routes =  routes;
      });
	}

  async signUpWarning() {
    const alert = await this.alertController.create({
      header: '¡Confirmación!',
      message: 'Confirma que te estás registrando en <strong>' + this.signupForm.controls['customerName'].value + '</strong>, ya que esta acción no puede modificarse después.',
      buttons: [
        {
          text: 'Corregir',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.signup();
          }
        }
      ]
    });

    await alert.present();
  }
	

	test() {
		let data = this.signupForm.value;
		console.log(data)
		// const pattern = new RegExp("^\\+[1-9]{1}[0-9]{0,2}-[2-9]{1}[0-9]{2}-[2-9]{1}[0-9]{2}-[0-9]{4}$");
		const pattern = /^[0-9\-]*$/;
		if (pattern.test(data.phone)) {
			this.toastService.presentToast('Ingresa un numero valido', 3000, 'danger')
			return true;
		}else{
			console.log('ali')
		}

	}

  signup() {
    let data = this.signupForm.value;
		console.log(data)
		/*const pattern = new RegExp("^\\+[1-9]{1}[0-9]{0,2}-[2-9]{1}[0-9]{2}-[2-9]{1}[0-9]{2}-[0-9]{4}$");
		if (!pattern.test(data.phone)) {
			this.toastService.presentToast('Ingresa un numero valido', 3000, 'danger')
			return true;
		}*/


    let credentials = data;
    if (this.signupForm.valid) {
      this.loading = true;
      this.authService.signup(credentials).then((result) => {
        result.user.updateProfile({
          displayName: this.signupForm.controls['firstName'].value,
          photoURL: 'assets/img/male_avatar.png'
        });
        this.authService.sendVerificationMail();
        this.authService.setUserData(credentials, result.user).then( () => {
          this.navController.navigateForward('auth/verify');
          this.loading = false;
        }).catch((err) => {
          console.log(err);
          this.toastService.presentToast(err.message);
          this.loading = false;
        });
      }).catch((err) => {
        console.log(err);
        this.toastService.presentToast(err.message);
        this.loading = false;
      });
    } else {
      this.toastService.presentToast('Por favor ingresa correctamente tus datos de registro', 3000, 'warning');
    }
  }

  backToSignIn() {
    this.navController.navigateBack('auth/signin');
  }

  onTermsChanged(event: Event) {
    console.log(event);
   this.canDismiss = false;
  }

}
