// Imports
import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import * as configuration from '../globals';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {BP} from './model/bp';
import {ProcessConfiguration} from './model/process-configuration';
import {CookieService} from 'ng2-cookies';

@Injectable()
export class BPService {
    private token = 'Bearer '+this.cookieService.get("bearer_token");
    private headers = new Headers({'Content-Type': 'application/json', 'Authorization': this.token});
    private options = new RequestOptions({headers: this.headers});
    // private endpoint = 'http://localhost:8081';
    private endpoint = configuration.bpe_endpoint;
    private bpsUrl = this.endpoint + '/content';  // URL to web api
    private configurationUrl = this.endpoint + '/application';  // URL to web api

    constructor(private http: Http,
                private cookieService: CookieService) {
    }

    getBPs(): Observable<BP[]> {
        const initiatorInstanceId = this.cookieService.get("federation_instance_id");
        const url = `${this.bpsUrl}?initiatorInstanceId=${initiatorInstanceId}`;
        let headers = new Headers({'Authorization': this.token});
        let bps = this.http.get(url,{headers: headers})
            .map((res: Response) => res.json())
            .catch(this.handleError);

        return bps;
    }

    getBP(processID: string): Observable<BP> {
        const initiatorInstanceId = this.cookieService.get("federation_instance_id");
        let headers = new Headers({'Authorization': this.token});
        const url = `${this.bpsUrl}/${processID}?initiatorInstanceId=${initiatorInstanceId}`;
        return this.http.get(url,{headers: headers})
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    delete(processID: string): Observable<void> {
        const initiatorInstanceId = this.cookieService.get("federation_instance_id");
        let headers = new Headers({'Authorization': this.token});
        const url = `${this.bpsUrl}/${processID}?initiatorInstanceId=${initiatorInstanceId}`;
        return this.http.delete(url,{headers: headers})
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    create(bp: BP): Observable<BP> {
        const initiatorInstanceId = this.cookieService.get("federation_instance_id");
        const url = `${this.bpsUrl}?initiatorInstanceId=${initiatorInstanceId}`;
        console.log(' Sending business process: ', bp);
        return this.http
            .post(url, JSON.stringify(bp), this.options)
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    update(bp: BP): Observable<BP> {
        const initiatorInstanceId = this.cookieService.get("federation_instance_id");
        const url = `${this.bpsUrl}?initiatorInstanceId=${initiatorInstanceId}`;
        return this.http
            .put(url, JSON.stringify(bp), this.options)
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    getConfiguration(partnerID: string, processID: string, roleType: string): Observable<ProcessConfiguration> {
        let headers = new Headers({'Authorization': this.token});
        const url = `${this.configurationUrl}/${partnerID}/${processID}/${roleType}`;
        return this.http.get(url,{headers: headers})
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    updateConfiguration(configuration: ProcessConfiguration): Observable<ProcessConfiguration> {
        console.log(' Sending configurations: ', configuration);
        const url = `${this.configurationUrl}`;
        return this.http
            .put(url, JSON.stringify(configuration), this.options)
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    private handleError(error: any): Observable<any> {
        let errorMsg = error.message || `There was a problem with our the rest service and we couldn't retrieve the data!`;
        console.error(errorMsg);

        // throw an application level error
        return Observable.throw(errorMsg);
    }
}

