import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  customers: AngularFirestoreCollection;
  routes: AngularFirestoreCollection;

  constructor(private afs: AngularFirestore) {
    this.customers = this.afs.collection('customers');
   }

   getRoutesByCustomer(uid: string) {    
    const routes = this.afs.collection('customers')
    .doc(uid)
    .collection('routes', ref => ref.where('active', '==', true));
    return routes.snapshotChanges();
     
   }
   getStopRoutesByCustomer(uid: string, uidRoute:string) {    
    const routes = this.afs.collection('routes')
    .doc(uidRoute)
    .collection('stops', ref => ref.where('active', '==', true));
    return routes.snapshotChanges();
     
   }
   getRouteStopPoints(accountId: string, routeId: string) {
    const stopPoints = this.afs.collection('customers').doc(accountId).collection('routes').doc(routeId).
    collection('stops', ref => ref.where('active', '==', true).orderBy('order', 'asc'));
    return stopPoints.snapshotChanges();
  }

   getCustomersPublicList() {
    this.customers = this.afs.collection('pCustomers', ref => ref.where('active', '==', true).orderBy('name','asc'));
    return this.customers.snapshotChanges();
   }
}
