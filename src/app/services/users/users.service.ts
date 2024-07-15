import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestoreCollectionGroup } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, from } from 'rxjs';
import { concatMap, map, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import * as tslib from 'tslib';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
	private readonly CHUNK_SIZE = 35;
  private readonly DELAY_BETWEEN_CHUNKS = 250;
  constructor(private afs: AngularFirestore) { }


	async getUsersWithBoardingPasses(): Promise<any[]> {
		try {
			const batchSize = 100;
			let lastUser: any = null;
	
			const snapshot = await this.getNextBatch(lastUser, batchSize, '');
	
			const users = snapshot.docs;
			console.log(users)
			const results = [];
	
			for (const user of users) {
				console.log('recorre');
				const userId = user.id;
				const userData = user.data();
				console.log('User ID:', userId);
	
				const boardingPassesSnapshot = await this.afs.collection(`users/${userId}/boardingPasses`).ref.get();
				console.log('aqui');
				const boardingPasses = boardingPassesSnapshot.docs.map(doc => doc.data());
				console.log(`Boarding passes for user ${userId}:`, boardingPasses);
	
				const result = {
					userId,
					data: userData,
					hasBoardingPasses: boardingPasses && boardingPasses.length > 0
				};
	
				results.push(result);
			}
	
			console.log('Results:', results);
			return results;
		} catch (error) {
			console.error('Error in getUsersWithBoardingPasses:', error);
			throw error;
		}
	}
	
	private async getNextBatch(lastUser: any, batchSize: number, customerId: any): Promise<firebase.firestore.QuerySnapshot> {
		// let query = this.afs.collection('users').ref.limit(batchSize);
		/*let query = this.afs.collection('users').ref;
		if (lastUser) {
			query = query.startAfter(lastUser);
		}
		console.log('Query:', query.toString()); 
		return query.get();
	}*/ 

	//customerId
		let query: any = this.afs.collection('users').ref.where('customerId', '==', customerId); //.limit(batchSize);
		console.log('queyyyy')
		console.log(query)
	
		if (lastUser) {
			query = query.startAfter(lastUser);
		}

		console.log('Query:', query.toString()); 
		return query.get();
	}

	async getUsersWithBoardingPasses2(): Promise<any[]> {
		try {
			const batchSize = 20;
			let lastUser: any = null;
	
			const snapshot = await this.getNextBatch(lastUser, batchSize, '');
	
			const users = snapshot.docs;
			const results = [];
	
			for (const user of users) {
				const userId = user.id;
				const userData = user.data();
	
				const boardingPassesSnapshot = await this.afs.collection(`users/${userId}/boardingPasses`).ref.get();
				const boardingPasses = boardingPassesSnapshot.docs.map(async boardingPassDoc => {
					const boardingPassData = boardingPassDoc.data();
					const boardingPassId = boardingPassDoc.id;
	
					// Obtener las subcolecciones de cada documento boardingPasses
					const subcollections = await this.afs.collection(`users/${userId}/boardingPasses/${boardingPassId}/subcollectionName`).ref.get();
					const subcollectionData = subcollections.docs.map(subcollectionDoc => subcollectionDoc.data());
	
					return {
						id: boardingPassId,
						data: boardingPassData,
						subcollections: subcollectionData
					};
				});
	
				const boardingPassesData = await Promise.all(boardingPasses);
	
				const result = {
					userId,
					data: userData,
					boardingPasses: boardingPassesData,
					hasBoardingPasses: boardingPasses && boardingPasses.length > 0
				};
	
				results.push(result);
			}
	
			return results;
		} catch (error) {
			console.error('Error in getUsersWithBoardingPasses:', error);
			throw error;
		}
	}

	private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

	async getUsersWithBoardingPasses3(startDate: any, endDate: any, customerId: any): Promise<any[]> {
		let results = [];
		try {
			const userQuerySnapshot = await this.afs.collection('users', ref => ref.where('customerId', '==', customerId)).get().toPromise();
			
			console.log('queryyyy')
			console.log(userQuerySnapshot)
      const userBoardingPassesPromises = userQuerySnapshot.docs.map(userDoc => async () => {
        const userData = userDoc.data();
        /*const boardingPassesSnapshot = await this.afs.collection(`users/${userDoc.id}/boardingPasses`, ref =>
					ref.where('validTo', '<=', endDate)
				).get().toPromise();
        const boardingPasses = boardingPassesSnapshot.docs.map(boardingPassDoc => boardingPassDoc.data());
				*/

				// Consulta para documentos donde validFrom sea mayor o igual a startDate
				const validFromSnapshot = await this.afs.collection(`users/${userDoc.id}/boardingPasses`).ref
				.where('validFrom', '>=', startDate)
				.get();
				const validFromDocs = validFromSnapshot.docs;

				// Consulta para documentos donde validTo sea menor o igual a endDate
				const validToSnapshot = await this.afs.collection(`users/${userDoc.id}/boardingPasses`).ref
					.where('validTo', '<=', endDate)
					.get();
				const validToDocs = validToSnapshot.docs;

				// Filtrar los documentos que cumplen ambas condiciones
				const validPassesDocs = validFromDocs.filter(doc => {
					const validToDoc = validToDocs.find(d => d.id === doc.id);
					return validToDoc != null; // Documento también cumple con el filtro validTo
				});

				const boardingPasses = validPassesDocs.map(boardingPassDoc => boardingPassDoc.data());
        return {
          userId: userDoc.id,
          data: userData,
          boardingPasses,
          hasBoardingPasses: boardingPasses.length > 0
        };
      });

      for (let i = 0; i < userBoardingPassesPromises.length; i += this.CHUNK_SIZE) {
        const chunkPromises = userBoardingPassesPromises.slice(i, i + this.CHUNK_SIZE);

        try {
          const chunkResults = await Promise.all(chunkPromises.map(fn => fn()));
          results = results.concat(chunkResults);
        } catch (chunkError) {
          console.error('Error processing chunk:', chunkError);
          await this.sleep(this.DELAY_BETWEEN_CHUNKS); // Retry after a delay
        }

        await this.sleep(this.DELAY_BETWEEN_CHUNKS); // Delay between each chunk
      }

      console.log(results);
      return results;
			/*const userQuerySnapshot = await this.afs.collection('users').ref.where('customerId', '==', customerId).get();
    
			const userBoardingPassesPromises = userQuerySnapshot.docs.map(async (userDoc) => {
				const userData = userDoc.data();
				const boardingPassesSnapshot = await this.afs.collection(`users/${userDoc.id}/boardingPasses`).ref.get();
				const boardingPasses = boardingPassesSnapshot.docs.map(boardingPassDoc => boardingPassDoc.data());
	
				return {
					userId: userDoc.id,
					data: userData,
					boardingPasses: boardingPasses,
					hasBoardingPasses: boardingPasses.length > 0
				};
			});
			

			const results = await Promise.all(userBoardingPassesPromises);
			
			console.log()
			console.log(results)
			return results;*/
			/*const batchSize = 200;
			let lastUser: any = null;
	
			const snapshot = await this.getNextBatch(lastUser, batchSize, customerId);
	
			const users = snapshot.docs;
			const results = [];
			
			console.log('users');
			console.log(users)
	
			for (const user of users) {
				const userId = user.id;
				const userData = user.data();

				where('validTo', '<=', endDate)
				where('validFrom', '>=', startDate)
				// Consulta para documentos donde validFrom sea mayor o igual a startDate
				const validFromSnapshot = await this.afs.collection(`users/${userId}/boardingPasses`).ref.where('validFrom', '>=', startDate).get();
				const validFromDocs = validFromSnapshot.docs;
				
				
				// Consulta para documentos donde validTo sea menor o igual a endDate
				const validToSnapshot = await this.afs.collection(`users/${userId}/boardingPasses`).ref.where('validTo', '<=', endDate).get();
				const validToDocs = validToSnapshot.docs;
				

				if (userData.uid === '0aoJSJCRb0fKLdhfRkrIthIhZjO2') {
					console.log('enonctrado????')
				}
				// Combinar los resultados de las consultas
				const validDocs = validFromDocs.filter(doc => validToDocs.some(toDoc => toDoc.id === doc.id));
				if (userData.uid === '18Ngn2YiDVYJUwYDQuyGtiiDbib2') {
					console.log('enonctrado????2222')
					console.log(userData.uid)
					console.log(userId)
					console.log(validDocs)
				}
				const boardingPasses = validDocs.map(doc => {
					const boardingPassData = doc.data();
					const boardingPassId = doc.id;
					return { id: boardingPassId, data: boardingPassData };
				});
	
				const result = {
					userId,
					data: userData,
					boardingPasses,
					hasBoardingPasses: boardingPasses && boardingPasses.length > 0
				};
	
				results.push(result);
			}
	
			return results;
			*/
		} catch (error) {
			console.error('Error in getUsersWithBoardingPasses:', error);
			throw error;
		}
	}
}


