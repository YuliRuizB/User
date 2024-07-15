export class Models {
}


// Esta data se crea en el purchaseRequest
export interface IPurchaseRequest {
	idPurchasteRequest: string,
	authorization: string,
	operation_type: string,
	method: any,
	transaction_type: string,
	card:
	{
		type: any,
		brand: any,
		address: any,
		card_number: any,
		holder_name: any,
		expiration_year: any,
		expiration_month: any,
		allows_charges: any,
		allows_payouts: any,
		bank_name: any,
		bank_code: any,
		points_card: any,
		points_type: any,
	},
	status: string,
	conciliated: any,
	creation_date: any,
	operation_date: any,
	description: any,
	error_message: any,
	order_id: any,
	currency: any,
	amount: any,
	customer:
	{
		name: any,
		last_name: any,
		email: any,
		phone_number: any,
		address: any,
		creation_date: any,
		external_id: any,
		clabe: any
	},
	active: boolean,
	category: any,
	date_created: any,
	product_description: any,
	product_id: any,
	name: any,
	isTaskIn: any,
	isTaskOut: any,
	type: any,
	isOpenpay: boolean,
	paidApp: string,
	price: any,
	round: any,
	routeId: any,
	routeName: string,
	stopDescription: string,
	stopId: any,
	stopName: any,
	validFrom: any,
	validTo: any,
	is_courtesy: boolean,
	typePayment: string

}

// Esta data carga de la coleccion de customers dentro de la collecion stops
export interface IRouteStopsCustomer {
	id: string,
	latitude: string,
	geopoint: {
			latitude: number,
			longitude: number
	},
	round1: string,
	imageUrl: string,
	round3MinutesSinceStart: string,
	round2MinutesSinceStart: number,
	round1MinutesSinceStart: number,
	round3: string,
	longitude: string,
	rounds: {
		round2MinutesSinceStart: number,
		round3: string,
		round1MinutesSinceStart: number,
		round1: string,
		round3MinutesSinceStart: string,
		round2: string
	},
	order: number,
	name: string,
	description: string,
	round2: string,
	active: boolean,
	kmzUrl: string,
	routeId: string,
	routeName: string
}
// Esta data carga de la coleccion de customers
export interface IProduct {
    id: string,
    validTo: {
        seconds: number,
        nanoseconds: number
    },
    timesSold: number,
    rangeDatePicker: [
			{
				seconds: number,
				nanoseconds: number
			},
			{
				seconds: number,
				nanoseconds: number
			}
    ],
    price: number,
    date_created: {
        seconds: number,
        nanoseconds: number
    },
    type: string,
    isTaskOut: boolean,
    validFrom: {
        seconds: number,
        nanoseconds: number
    },
    category: string,
    name: string,
    active: boolean,
    description: string,
    isTaskIn: boolean
}
export interface IPayNowReference {
	id: string,
	timesSold: number,
	name: string,
	price: number,
	validTo: {
		seconds: number,
		nanoseconds: number
	},
	validFrom: {
		seconds: number,
		nanoseconds: number
	},
	description: string,
	type: string,
	isTaskOut: boolean,
	isTaskIn: boolean,
	active: boolean,
	category: string,
	rangeDatePicker: [
		{
			seconds: number,
			nanoseconds: number
		},
		{
			seconds: number,
			nanoseconds: number
		}
	],
	date_created: {
		seconds: number,
		nanoseconds: number
	},
	round: string,
	stopName: string,
	stopId: string,
	stopDescription: string,
	routeId: string,
	routeName: string
}

export interface ICardCustomerData {
	source_id: string,
	method: string,
	amount: number,
	currency: string,
	description: string,
	device_session_id: string,
	customer: {
		name: string,
		last_name: string,
		phone_number: string,
		email: string
	}
}

// esta interface es la esctructura ue regresa la api de openpay
export interface ICardOpenPayResponse {
	id: string,
	authorization: string,
	operation_type: string,
	transaction_type: string,
	status: string,
	conciliated: boolean,
	creation_date: string,
	operation_date: string,
	description: string | null,
	error_message: string | null,
	order_id: string,
	due_date: any,
	card: {
		type: string,
		brand: string,
		address: string | null,
		card_number: string,
		holder_name: string,
		expiration_year: string,
		expiration_month: string,
		allows_charges: boolean,
		allows_payouts: boolean,
		bank_name: string,
		points_type: string,
		points_card: boolean,
		bank_code: string
	},
	gateway_card_present: string,
	amount: number,
	currency: string,
	customer: {
		name: string,
		last_name: string,
		email: string,
		phone_number: string,
		address: string | null,
		creation_date: string,
		external_id: string | null,
		clabe:  string | null
	},
	fee: {
		amount: number,
		tax: number,
		currency: string
	},
	method: string,
	routeId: string
}

// esta interface es la esctructura ue regresa la api de openpay
export interface ICardOpenPayResponseStoreChargeRequest {
	id: string,
	idPurchaseRequest: string,
	authorization: any,
	operation_type: any,
	method: any,
	transaction_type: any,
	status: any,
	conciliated: any,
	creation_date: any,
	operation_date: any,
	description: any,
	error_message: any,
	order_id: any,
	due_date: any,
	payment_method: {
		type: any,
		reference: any,
		barcode_url: any
	},
	currency: any,
	amount: any,
	customer: {
		name: any,
		last_name: any,
		email: any,
		phone_number: any,
		address: any,
		creation_date: any,
		external_id: any,
		clabe: any
	},
	active: boolean,
	category: any,
	date_created: any,
	product_description: any,
	product_id: any,
	name: any,
	price: any,
	round: any,
	routeId: any,
	routeName: any,
	stopDescription: any,
	stopId: any,
	stopName: any,
	validFrom: any,
	validTo: any,
	isTaskIn: any,
	isTaskOut: any,
	type: any,
	isOpenpay: boolean,
	paidApp: string,
	is_courtesy: boolean,
	typePayment: string
}


export interface IUserData {
    address: {
        addressLine: string;
        city: string;
        postCode: string;
        state: string;
    },
    customerId: string;
    customerName: string;
    displayName: string;
    defaultRoute: string;
    defaultRound:string;
    defaultRouteName:string;
    defaultStopName:string;
    email: string;
    emailVerified: boolean;
    firstName: string;
    id: string;
    lastName: string;
    occupation: string;
    openpay: {
        address: string;
        clabe: string;
        creation_date: string;
        email: string;
        external_id: string;
        id: string;
        last_name: string;
        name: string;
        phone_number: string;
    },
    phone: string;
    photoURL: string;
    refreshToken: string;
    roles: Array<IRoles>;
    socialNetworks: {
        apple: string;
        facebook: string;
        google: string;
        instagram: string;
        linkedIn: string;
        twitter: string;
    }
    studentId: string;
    uid: string;
    username: string;
    _isEditMode: boolean;
    _userId: string;  
		dateCreateUserFormat: string; 
		dateCreateUserFull: string;
		phoneNumber: string;
		roundTrip: string;
		status: string;
		turno: string;
		deviceInfo: {
			lastDataConnectWithHour: string;
			lastDateConnect: string;
			lastDateConnectFull: string;
			manufacturer: string;
			model: string;
			platform: string;
			versionPlatformAppStore: string;
			versionPlatformAppStoreString: string;
			versionPlatformDevice: string;
			platformPermisionStatus: {
				businesName: string;
				id: any;
				idDoc: string;
			},
			businesPlatform: {
				businesName: string;
				businesType: string;
				currentVersion: string;
				id: any;
				idDoc: string;
			}
		}
}

export interface IBoardingPass {
	operation_type: string,
	status: string,
	transaction_type: string,
	stopName: string,
	authorization: string,
	method: string,
	currency: string,
	routeName: string,
	creation_date: string,
	description: string,
	productId: string,
	paidApp: string,
	product_description: string,
	isTaskOut: boolean,
	conciliated: boolean,
	stopId: string,
	price: number,
	amount: number,
	idBoardingPass: string,
	idPurchasteRequest: string,
	order_id: string,
	validTo: {
		seconds: number,
		nanoseconds: number
	},
	passValidation: {
		lasUsedLocation: string,
		lastValidUsage: boolean,
		lastUsed: {
			seconds: number,
			nanoseconds: number
		},
		validation: string,
		lastUsedVehicle: string,
		allowedOnBoard: boolean,
		lastUsedRound: string,
		lastUsedProgram: string,
		lastUsedRoute: string
	},
	customerId: string,
	error_message: string,
	round: string,
	customer: {
		email: string,
		address: string | null,
		external_id: string | null,
		phone_number: string,
		last_name: string,
		clabe: string | null,
		creation_date: string,
		name: string
	},
	typePayment: string,
	stopDescription: string,
	routeId: string,
	operation_date: string,
	validFrom: {
		seconds: number,
		nanoseconds: number
	},
	card: {
		card_number: string,
		bank_code: string,
		expiration_month: string,
		bank_name: string,
		expiration_year: string,
		brand: string,
		holder_name: string,
		allows_charges: boolean,
		allows_payouts: boolean,
		points_card: boolean,
		points_type: string,
		address: string,
		type: string
	},
	category: string,
	date_created: {
		seconds: number,
		nanoseconds: number
	},
	product_id: string,
	isTaskIn: boolean,
	active: boolean,
	name: string,
	type: string,
	isOpenpay: boolean,
	is_courtesy: boolean
}

export interface IRoute {
	active: boolean;
	customerId: string;
	customerName: string; 
	description: string; 
	id: string;
	imageUrl: string;
	kmzUrl: string;
	name: string; 
	routeId: string; 
}

export interface IRoles {
    user: true,
    admin: true,
    editor: true
}

export class Device {

    constructor(
      public id?: number,
      public groupId?: number,
      public name?: string,
      public uniqueId?: number,
      public status?: string,
      public lastUpdate?: string,
      public positionId?: number,
      public geofenceIds?: any[],
      public phone?: number,
      public model?: string,
      public contact?: string,
      public category?: string,
      public disabled?: boolean
    ) {}
  
  }

  export const deviceEvents = {
      1: "speed_alert",
      2: "unauthorized_movement",
      3: "engine_on",
      4: "engine_off",
      5: "panic",
      6: "position",
      7: "hook",
      8: "release",
      9: "low_battery",
      10: "init_chage",
      11: "end_chage",
      12: "poleo",
      13: "call_poleo",
      14: "door_open",
      15: "door_close",
      16: "engine_stop_active",
      17: "engine_stop_deactivated",
      18: "power_disconnection",
      19: "power_connection",
      20: "temperature",
      21: "gas",
      22: "device_off",
      23: "zone_in",
      24: "zone_out",
      25: "turn",
      26: "on_motion",
      27: "off_motion",
      28: "ralenti",
      29: "backup_energy_position",
      30: "periodic_reset",
      31: "unhook",
      32: "magnetic_lock_open",
      33: "magnetic_lock_close",
      34: "acceleration",
      35: "braking"
    };