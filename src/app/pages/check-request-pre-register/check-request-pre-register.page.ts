import { Component, OnInit } from '@angular/core';
import { UsersService } from "../../services/firebase/users.service"; 
import { StorageService } from '../../services/storage/storage.service';
import { IUserData,IRoute } from '../../models/models';
import { BusesService } from '../../services/firebase/buses.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-check-request-pre-register',
  templateUrl: './check-request-pre-register.page.html',
  styleUrls: ['./check-request-pre-register.page.scss'],
})
export class CheckRequestPreRegisterPage implements OnInit {
	user: IUserData = null;
	dataPreregisters: any = 0;
	dataPreregistersText: any  = ''
	subText: string = 'PreRegistrados';
	routeData: IRoute = {
		active: false,
		customerId: '',
		customerName: '',
		description: '',
		id: '',
		imageUrl: '',
		kmzUrl: '',
		name: '',
		routeId: ''
	};
	loading: number = 1;
  constructor(private _UsersService:UsersService, private _StorageService: StorageService,
		private _BusesService: BusesService) { }

  ngOnInit() {
		this._StorageService.getItem("userData").then(async (userData) => {
      this.user = JSON.parse(userData);
			// await this.getRouteById();
			this.getUserPreregisterRouteById();
			this.getRoutePayment();
			console.log('user aliiiiiii');
			console.log(this.user)
    }).catch((error) => {
			console.log('error 777777');
			console.log(error)
		})
  }

	async getRouteById() {
		return  new Promise((resolve, reject) => {
		this._BusesService
      .getUserActiveRoutesById(this.user)
      .pipe(
				map(a => {
          const data = a.payload.data() as IRoute;
          const id = a.payload.id;
          return { id, ...data };
        })
			)
      .subscribe((response) => {
				console.log('entra 333333333')
				console.log(response)
				this.routeData = response;
				resolve(true);
      });
		})
	}

	async getUserPreregisterRouteById() {
		return  new Promise((resolve, reject) => {
			this._UsersService.getUserPreregisterByRoute(this.user).then((resp: any) => {
				console.log('resp');
				console.log(resp)
				const calculate = ( resp.length / 14 ) * 100;
				console.log(calculate)
				this.dataPreregisters =  calculate;
				this.dataPreregistersText = `${resp.length}/14`
				this.loading = 2;
			});
		})
	}

	async getRoutePayment() {
		this._BusesService
      .getUserPaymentsRoutesId(this.user)
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      )
      .subscribe((response) => {
				console.log('entra 5555555')
				console.log(response)
      });
	}

}
