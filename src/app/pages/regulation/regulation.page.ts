import { Component } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
@Component({
    selector: 'regulation',
    templateUrl: './regulation.page.html',
    styleUrls: ['./regulation.page.scss']
})

export class RegulationPage {
	public fromPage: boolean= false;
    constructor(private activatedRoute: ActivatedRoute){
        
    };

		ngOnInit() { 
			this.activatedRoute.params.subscribe(params => {
				let from = params['from'];
				this.fromPage = from == 1 ? true : false;
				
				console.log(`${from}`);
				console.log(this.fromPage)
				});
		}
}