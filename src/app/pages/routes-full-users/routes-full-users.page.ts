import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { CustomersService } from '../../services/firebase/customers.service';
import { BusesService } from '../../services/firebase/buses.service';
import * as moment from 'moment';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { map } from 'rxjs/operators';
import { StorageService } from "../../services/storage/storage.service";
import { AngularFireFunctions } from '@angular/fire/functions';
import { FirebaseX } from "@ionic-native/firebase-x/ngx";

@Component({
  selector: 'app-routes-full-users',
  templateUrl: './routes-full-users.page.html',
  styleUrls: ['./routes-full-users.page.scss'],
})
export class RoutesFullUsersPage implements OnInit {
	loading: any = 1;
	customersList: any = [];
	customerSelect: any = null;
	userData: any = null;
	routesList: any = null;
	token: string = '';

	startDate: any = null;
	endDate: any = null;
  constructor(
		private fcm: FirebaseX,
		private aff: AngularFireFunctions,
		private _UsersService: UsersService, private _CustomersService:  CustomersService, private _BusesService: BusesService, private storageService: StorageService,) { 
		
	}

  ngOnInit() {
		this.getUsers();
		this.getSubscriptions();
		/*this._UsersService.getUsersWithBoardingPasses2().then((res) => {
			console.log('Usuarios con pases de abordar:', res);
		}).catch((error) => {
			console.error('Error al obtener usuarios con pases de abordar:', error);
		});*/

		this.fcm.getToken().then((token) => {
      console.log("getToken() from homepage");
			console.log(token);
      this.token = token
		})
  }

	

	callUsers() {
		// Definir las fechas de inicio y fin usando Moment.js
		const startDate = moment(this.startDate); // 8 de diciembre de 2023, 11:07:26 a.m. UTC-8
		const endDate = moment(this.endDate); // 31 de enero de 2025, 11:07:26 a.m. UTC-8

		/*
		const startDate = moment('2024-06-01T11:00:00-08:00'); // 8 de diciembre de 2023, 11:07:26 a.m. UTC-8
		const endDate = moment('2024-06-31T11:23:59-08:00'); // 31 de enero de 2025, 11:07:26 a.m. UTC-8
		*/
		// Crear los objetos Timestamp de Firebase
		const startTimestamp: firebase.firestore.Timestamp = firebase.firestore.Timestamp.fromDate(startDate.toDate());
			const endTimestamp: firebase.firestore.Timestamp = firebase.firestore.Timestamp.fromDate(endDate.toDate());
		this._UsersService.getUsersWithBoardingPasses3(startTimestamp, endTimestamp, this.customerSelect.id).then(users => {
			console.log(users);
			let searchBoardingPasses = users.filter((x: any) => x.boardingPasses.length > 0);
			console.log('filtados');
			console.log(searchBoardingPasses)

			let index = 0;
			let acum = 0;

			let routesByBordingPassesList = []
			for (const x of this.routesList) {

				let routesByBordingPassesList = []
				for (const w of searchBoardingPasses) {
					console.log(w)
					if (w.hasBoardingPasses === true) {
						console.log('wwwwwww');
						console.log(w)
						// let searchCustomerId = w.boardingPasses.filter((x) => x.data.customerId === this.customerSelect.id);
						let searchCustomerId = w.boardingPasses.filter((x) => x.customerId === this.customerSelect.id);
						// console.log('show')
						// console.log(searchCustomerId)
						// let searchStopsIds = searchCustomerId.filter((w) => w.data.routeId === x.routeId);
						let searchStopsIds = searchCustomerId.filter((w) => w.routeId === x.routeId);
						if (searchStopsIds.length > 0) {
							// routesByBordingPassesList.push(searchStopsIds);
							// if (!routesByBordingPassesList.length) routesByBordingPassesList = searchStopsIds;
							// else routesByBordingPassesList = [...routesByBordingPassesList, ...searchStopsIds] 
							// routesByBordingPassesList = [...searchStopsIds]
							//searchStopsIds.data['student'] =  w.data;
							// console.log(searchStopsIds)
							for (const ww of searchStopsIds) {
								ww['student'] =  w.data;
							}
							routesByBordingPassesList = routesByBordingPassesList.concat(searchStopsIds);
						}
						//this.routesList[index]['routesByBordingPasses'] =  [searchStopsIds,...this.routesList[index]['routesByBordingPasses']];
						// console.log(searchCustomerId)

						acum = acum + searchCustomerId.length;
					}
				}
				this.routesList[index]['routesByBordingPasses'] = routesByBordingPassesList;
				this.routesList[index]['totalBoardingPasses'] = acum;
				let stopsStudents = [];
				let index2 = 0

				// console.log('pirson')
				for (const z of routesByBordingPassesList) {
					// console.log( x.stopList)
					// console.log(z.data.stopId)
					// let qq = x.stopList.filter((q) => q.id ===  z.data.stopId);
					let qq = x.stopList.filter((q) => q.id ===  z.stopId);
					// console.log(qq)
					stopsStudents = stopsStudents.concat(qq);
				}

				this.routesList[index]['stopStudentsByBordingPasses'] = stopsStudents;
				// x.stopList.filter((q) => q.id)
				// routesByBordingPassesList
				index++
			}


			let ii = 0
			for (const x of this.routesList) {
				const groupedItems = x.routesByBordingPasses.reduce((acc, item) => {
					if (!acc[item.student.uid]) {
						acc[item.student.uid] = [];
				}
				acc[item.student.uid].push(item.student);
				return acc;
			}, {} as { [key: string]: any[] });

				const groupedArray = Object.keys(groupedItems).map(key => (
					{
					uid: key,
					name: groupedItems[key][0], //+ groupedItems[key][0].student.lastName, // .student.firstName + groupedItems[0].student.lastName,
					// students: groupedItems[key]
			}));
			
			console.log(groupedItems);
			this.routesList[ii]['studentsCont'] = groupedArray;


				const groupedItems2 = x.stopStudentsByBordingPasses.reduce((acc, item) => {
					if (!acc[item.id]) {
							acc[item.id] = [];
					}
					acc[item.id].push(item);
					return acc;
				}, {} as { [key: string]: any[] });

				const groupedArray2 = Object.keys(groupedItems2).map(key2 => (
					{
					uid: key2,
					name: groupedItems2[key2][0], //+ groupedItems[key][0].student.lastName, // .student.firstName + groupedItems[0].student.lastName,
					students: groupedItems2[key2]
			}));
			this.routesList[ii]['studentsContFilterStops'] = groupedArray2;
			console.log(groupedItems);
				ii++;
			}

			console.log('encontro');
			console.log(acum)
			console.log(this.routesList)
			this.reportCreate(this.routesList)
			this.loading = 2;
		});
	}


	getSubscriptions() {
    this._CustomersService.getCustomersPublicList().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).subscribe( (customers) => {
      console.log(customers);
      this.customersList = customers;
			
    })
  }

	getRoutes(customerId) {
		return new Promise((resolve) => {
			this._BusesService
				.getUserActiveRoutes2(customerId)
				.pipe(
					map((actions) =>
						actions.map((a) => {
							const data = a.payload.doc.data() as any;
							const id = a.payload.doc.id;
							return { id, ...data };
						})
					)
				)
				.subscribe(async (routes) => {
					this.routesList = routes;
					console.log('rutas')
					console.log(this.routesList)

					let index = 0;
					for (const x of this.routesList) {
						const route  = await this.getStops(x.customerId, x.routeId);
						this.routesList[index]['stopList'] = route
						index++
					}
					resolve(this.routesList);
				},(error) => {
					console.log(error);
				})
		})
	}

	async getStops(customerId: string, routeId) {
		return new Promise((resolve) => {
			this._BusesService
		.getUserRouteActiveStops2(customerId, routeId)
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data, routeId: routeId, customerId: customerId };
          })
        )
      )
      .subscribe((stops) => {
        // console.log('esto regresa');
				// console.log(stops)

				// this.routesList =  routes;
				resolve(stops)
      });
		})
		
	}

	getUsers() {
		this.storageService.getItem("userData").then(async (userData) => {
      this.userData = JSON.parse(userData);
		}).catch((error) => {
			console.log(error)
		})
	}

	async onChange(event) {
		this.routesList = [];
		this.loading = 1;
		console.log('elegante');
    console.log(event.target.value);
		console.log(this.customerSelect)
		console.log(this.userData)
		let cc = await this.getRoutes(this.customerSelect.id)
		console.log(cc)
		// this.routesList = [];
		// this.loading = 1;
		this.callUsers();
		// this.getStops(this.customerSelect.id)
  }

	check1(idStop, stopStudentsByBordingPasses) {
		let ff = stopStudentsByBordingPasses.filter((x) => x.id === idStop)
		return ff.length
	}

	check2(idStop, stopStudentsByBordingPasses) {
		let ff = stopStudentsByBordingPasses.filter((x) => x.uid === idStop)
		return ff.length
	}

	reportCreate(data: any) {
		const createReport = this.aff.httpsCallable('createReport');
    return createReport({ route: data, token: this.token }).toPromise().then((response: any) => {
			return response;
    })
	}

}
