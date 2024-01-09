import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { startOfToday } from 'date-fns';
import { IUserData } from 'src/app/models/models';

@Injectable({
  providedIn: 'root'
})

export class BusesService {

  busesRef: AngularFirestoreCollection;
  routesRef: AngularFirestoreCollection;
  
  constructor(private afs: AngularFirestore) { 
  }

  canShowDevices(user: IUserData) {
    console.log(user);
    const canShowDevices = this.afs.doc(`customers/${user.customerId}`);
    return canShowDevices.snapshotChanges();
  }

  getUserActiveRoutes(user: IUserData) {
    const activeRoutes = this.afs.collection('customers').doc(user.customerId).collection('routes');
    activeRoutes.ref.where('active','==', true);
    return activeRoutes.snapshotChanges();
  }

	test() {
    const activeRoutes = this.afs.collection('users').doc('kSV7rFYh3fcc4oFCjZSKd6qytJF2').collection('boardingPasses' , ref => {
			let aux = ref.where('creation_date','==', '2023-12-26T20:42:09.890Z');
			return aux;
		})
		// .ref.where('creation_date','==', '2023-12-26T20:42:09.890Z').get();
    // activeRoutes.ref.where('creation_date','==', '2023-12-26T20:42:09.890Z').get();
    return activeRoutes.snapshotChanges();
  }

	getUserActiveRoutesById(user: IUserData) {
		console.log('entro aqui firebase');
		console.log(user.customerId);
    this.routesRef = this.afs.collection('customers').doc(user.customerId).collection('routes');
    const routeStops = this.routesRef.doc(user.defaultRoute)
    return routeStops.snapshotChanges();
  }

	getUserPaymentsRoutesId(user: IUserData) {
		console.log('pok')
		console.log(user.id)
		console.log(user.defaultRoute)
    const activeRoutes = this.afs.collection('storeChargeRequests');
		activeRoutes.ref.where('routeId', '==', user.defaultRoute)
    return activeRoutes.snapshotChanges();
  }


	getUserActiveRoutesId(customerId: string) {
    const activeRoutes = this.afs.collection('customers').doc(customerId).collection('routes');
    activeRoutes.ref.where('active','==', true);
    return activeRoutes.snapshotChanges();
  }

  getRoute(routeId: string) {
    const route = this.routesRef.doc(routeId);
    return route.snapshotChanges();
  }

  getUserRouteActiveStops(user: IUserData) {
    this.routesRef = this.afs.collection('customers').doc(user.customerId).collection('routes');
    const routeStops = this.routesRef.doc(user.defaultRoute).collection('stops', ref => ref.where('active','==', true).orderBy('order','asc'));
    return routeStops.snapshotChanges();
  }

  getUserSelectedRouteActiveStops(user: IUserData, routeId: string) {
    this.routesRef = this.afs.collection('customers').doc(user.customerId).collection('routes');
    const routeStops = this.routesRef.doc(routeId).collection('stops')
    routeStops.ref.where('active','==', true).orderBy('order','desc');
    return routeStops.snapshotChanges();
  }

  getLiveBusesRoute(user: IUserData, routeId: string) {
    let liveBusesRef = this.afs.collection('customers').doc(user.customerId).collection('live', ref => ref.where('routeId','==', routeId).where('startAt','>=', startOfToday()).limit(5));
    return liveBusesRef.snapshotChanges();
  }

  getLiveBusRoute(bus: any) {
    let liveBusesRef = this.afs.doc(bus.customerPath).collection('live').doc(bus.id);
    return liveBusesRef.valueChanges();
  }
  
}
