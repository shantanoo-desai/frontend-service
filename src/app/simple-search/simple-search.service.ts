import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as myGlobals from '../globals';
import { map } from 'rxjs/operators';
import {CookieService} from 'ng2-cookies';

@Injectable()
export class SimpleSearchService {
    private token = 'Bearer '+this.cookieService.get("bearer_token");
    private headers = new Headers({'Content-Type': 'application/json','Authorization':this.token});
	private url = myGlobals.simple_search_endpoint;
	private url_bpe = myGlobals.bpe_endpoint+"/delegate";
	private facetMin = myGlobals.facet_min;

	product_name = myGlobals.product_name;
	product_vendor_id = myGlobals.product_vendor_id;
	product_vendor_name = myGlobals.product_vendor_name;
	product_img = myGlobals.product_img;
	product_nonfilter_full = myGlobals.product_nonfilter_full;
	product_nonfilter_regex = myGlobals.product_nonfilter_regex;
	product_configurable = myGlobals.product_configurable;
	product_cat = myGlobals.product_cat;
	product_cat_mix = myGlobals.product_cat_mix;

	constructor(private http: Http,
				private cookieService: CookieService) { }

	getFields(): Promise<any> {
		const federationInstanceId = this.cookieService.get("federation_instance_id");
		const url = `${this.url_bpe}/search/fields?initiatorInstanceId=${federationInstanceId}&targetInstanceId=${federationInstanceId}`;

		return this.http
		.get(url, {headers: this.headers})
		.toPromise()
		.then(res => res)
		.catch(this.handleError);
	}

    get(query: string, facets: [string], facetQueries: [string], page: number, cat: string): Promise<any> {
        facetQueries.push(cat);
        const federationInstanceId = this.cookieService.get("federation_instance_id");
        query = query.replace(/[!'()]/g, '');
        const url = `${this.url_bpe}/search/query?initiatorInstanceId=${federationInstanceId}&targetInstanceId=${federationInstanceId}&query=${query}&page=${page}&facets=${facets}&facetQueries=${facetQueries}&federated=${true}`;
        return this.http
            .get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

	getSingle(id: string): Promise<any> {
        const federationInstanceId = this.cookieService.get("federation_instance_id");
		const url = `${this.url_bpe}/search/select?initiatorInstanceId=${federationInstanceId}&targetInstanceId=${federationInstanceId}&id:${id}`;
		return this.http
		.get(url, {headers: this.headers})
		.toPromise()
		.then(res => res.json())
		.catch(this.handleError);
	}

    getSuggestions(query:string, facetQueries: [string], cat: string) {
        const federationInstanceId = this.cookieService.get("federation_instance_id");
        query = query.replace(/[!'()]/g, '');
        const url = `${this.url_bpe}/search/suggest?initiatorInstanceId=${federationInstanceId}&targetInstanceId=${federationInstanceId}&query=${query}&wt=json&federated=true`;
        var full_url = url + "";
        for (let facetQuery of facetQueries) {
            full_url += "&facets="+encodeURIComponent(facetQuery);
        }
        if (cat != "") {
            var add_url = `${this.product_cat}:"${cat}"`;
            full_url += "&category="+encodeURIComponent(add_url);
        }
        return this.http
            .get(full_url, {headers: this.headers})
            .pipe(
                map(response =>
                    this.getSuggestionArray(response,query)
                ));
    }

	getSuggestionArray(res:any, q:string): string[] {
		var suggestions=[];
		if (q.length >= 2) {
			res = JSON.parse(res._body);
			if (res && res.suggestions && res.suggestions.suggestion_facets && res.suggestions.suggestion_facets[this.product_name]) {
				for (let sug in res.suggestions.suggestion_facets[this.product_name]) {
					if (suggestions.length<10)
					suggestions.push(sug);
				}
			}
		}
		return suggestions;
	}

	checkField(field:string): boolean {
		var valid = true;
		if (field == this.product_name || field == this.product_img || field == this.product_vendor_id || field == this.product_cat || field == this.product_cat_mix)
			valid = false;
		for (let filter of this.product_nonfilter_full) {
			if (field == filter)
				valid = false;
		}
		for (let filter of this.product_nonfilter_regex) {
			if (field.search(filter) != -1)
				valid = false;
		}
		for (let filter of this.product_configurable) {
			if (field.search(filter) != -1)
				valid = false;
		}
		return valid;
	}

	private handleError(error: any): Promise<any> {
		return Promise.reject(error.message || error);
	}

}
