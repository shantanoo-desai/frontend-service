import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as myGlobals from '../globals';
import {ProcessInstanceInputMessage} from "./model/process-instance-input-message";
import {ProcessInstance} from "./model/process-instance";
import {ProcessInstanceGroup} from "./model/process-instance-group";
import {BPDataService} from "./bp-view/bp-data-service";
import {ProcessInstanceGroupResponse} from "./model/process-instance-group-response";
import {ProcessInstanceGroupFilter} from "./model/process-instance-group-filter";
import {CookieService} from "ng2-cookies";
import {Contract} from "../catalogue/model/publish/contract";
import {Clause} from "../catalogue/model/publish/clause";
import { CollaborationRole } from "./model/collaboration-role";
import { PpapResponse } from '../catalogue/model/publish/ppap-response';
import { Ppap } from '../catalogue/model/publish/ppap';
import { ItemInformationResponse } from '../catalogue/model/publish/item-information-response';
import { ItemInformationRequest } from '../catalogue/model/publish/item-information-request';
import { Order } from '../catalogue/model/publish/order';
import { TradingTerm } from '../catalogue/model/publish/trading-term';

@Injectable()
export class BPEService {

	private headers = new Headers({'Content-Type': 'application/json'});
	private url = myGlobals.bpe_endpoint;
	private delegate_url = myGlobals.delegate_bpe_endpoint;

	constructor(private http: Http,
				private bpDataService:BPDataService,
				private cookieService: CookieService) { }

	startBusinessProcess(piim:ProcessInstanceInputMessage,initiatorInstanceId:string,targetInstanceId):Promise<ProcessInstance> {
		const token = 'Bearer '+this.cookieService.get("bearer_token");
		let headers = new Headers({'Accept': 'application/json','Authorization': token});
		this.headers.keys().forEach(header => headers.append(header, this.headers.get(header)));

		let url = `${this.delegate_url}/start?initiatorInstanceId=${initiatorInstanceId}&targetInstanceId=${targetInstanceId}`;
		if(this.bpDataService.getRelatedGroupId() != null) {
			url += '&gid=' + this.bpDataService.getRelatedGroupId();
		}
		if(this.bpDataService.precedingProcessId != null) {
			url += '&precedingPid=' + this.bpDataService.precedingProcessId;
		}

		return this.http
            .post(url, JSON.stringify(piim), {headers: headers})
            .toPromise()
            .then(res => {
				if (myGlobals.debug)
					console.log(res.json());
            	return res.json();
            })
            .catch(this.handleError);
	}

	continueBusinessProcess(piim:ProcessInstanceInputMessage,initiatorInstanceId:string,targetInstanceId):Promise<ProcessInstance> {
		const token = 'Bearer '+this.cookieService.get("bearer_token");
		let headers = new Headers({'Accept': 'application/json','Authorization': token});
		this.headers.keys().forEach(header => headers.append(header, this.headers.get(header)));

		let url = `${this.delegate_url}/continue?initiatorInstanceId=${initiatorInstanceId}&targetInstanceId=${targetInstanceId}`;
		if(this.bpDataService.getRelatedGroupId() != null) {
			url += '?gid=' + this.bpDataService.getRelatedGroupId();
		}

		return this.http
            .post(url, JSON.stringify(piim), {headers: headers})
            .toPromise()
            .then(res => {
				if (myGlobals.debug)
					console.log(res.json());
				return res.json();
			})
            .catch(this.handleError);
	}
	
	cancelBusinessProcess(id: string): Promise<any> {
		const url = `${this.url}/rest/engine/default/process-instance/${id}`;
		return this.http
		.delete(url, {headers: this.headers})
		.toPromise()
		.then(res => res.json())
		.catch(this.handleError);
	}

	getProcessDetails(id: string): Promise<any> {
		const url = `${this.url}/rest/engine/default/variable-instance?processInstanceIdIn=${id}`;
		return this.http
		.get(url, {headers: this.headers})
		.toPromise()
		.then(res => res.json())
		.catch(this.handleError);
	}

	getInitiatorHistory(id: string): Promise<any> {
		const url = `${this.url}/rest/engine/default/history/task?processVariables=initiatorID_eq_${id}&sortBy=startTime&sortOrder=desc&maxResults=20`;
		return this.http
		.get(url, {headers: this.headers})
		.toPromise()
		.then(res => res.json())
		.catch(this.handleError);
	}

	getRecipientHistory(id: string): Promise<any> {
		const url = `${this.url}/rest/engine/default/history/task?processVariables=responderID_eq_${id}&sortBy=startTime&sortOrder=desc&maxResults=20`;
		return this.http
		.get(url, {headers: this.headers})
		.toPromise()
		.then(res => res.json())
		.catch(this.handleError);
	}

	getProcessInstanceGroup(groupId: string,targetInstanceID:string){
        const initiatorInstanceId = this.cookieService.get("federation_instance_id");
        const token = 'Bearer '+this.cookieService.get("bearer_token");
        let headers = new Headers({'Authorization': token});
        this.headers.keys().forEach(header => headers.append(header, this.headers.get(header)));
		let url:string = `${this.delegate_url}/group/${groupId}?initiatorInstanceId=${initiatorInstanceId}&targetInstanceID=${targetInstanceID}`;
		return this.http
            .get(url, {headers: headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
	}

	getProcessDetailsHistory(id: string,targetInstanceID:string): Promise<any> {
		const initiatorInstanceId = this.cookieService.get("federation_instance_id");
        const token = 'Bearer '+this.cookieService.get("bearer_token");
        let headers = new Headers({'Authorization': token});
        this.headers.keys().forEach(header => headers.append(header, this.headers.get(header)));
		const url = `${this.url}/rest/engine/default/history/variable-instance?initiatorInstanceId=${initiatorInstanceId}&targetInstanceID=${targetInstanceID}&processInstanceIdIn=${id}`;
		return this.http
		.get(url, {headers: headers})
		.toPromise()
		.then(res => res.json())
		.catch(this.handleError);
	}

	getLastActivityForProcessInstance(processInstanceId: string,targetInstanceId:string): Promise<any> {
        const initiatorInstanceId = this.cookieService.get("federation_instance_id");
        const token = 'Bearer '+this.cookieService.get("bearer_token");
        let headers = new Headers({'Authorization': token});
        this.headers.keys().forEach(header => headers.append(header, this.headers.get(header)));
		const url = `${this.url}/rest/engine/default/history/activity-instance?initiatorInstanceId=${initiatorInstanceId}&targetInstanceId=${targetInstanceId}&processInstanceId=${processInstanceId}&sortBy=startTime&sortOrder=desc&maxResults=1`;
		return this.http
            .get(url, {headers: headers})
            .toPromise()
            .then(res => res.json()[0])
            .catch(this.handleError);
	}

	getProcessInstanceDetails(processInstanceId: string,targetInstanceId:string): Promise<any> {
        const initiatorInstanceId = this.cookieService.get("federation_instance_id");
        const token = 'Bearer '+this.cookieService.get("bearer_token");
        let headers = new Headers({'Authorization': token});
        this.headers.keys().forEach(header => headers.append(header, this.headers.get(header)));
		const url = `${this.url}/rest/engine/default/history/process-instance/${processInstanceId}?initiatorInstanceId=${initiatorInstanceId}&targetInstanceId=${targetInstanceId}`;
		return this.http
            .get(url, {headers: headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
	}

	getItemInformationRequest(itemInformationResponse: ItemInformationResponse): Promise<ItemInformationRequest> {
		return this.getDocumentJsonContent(itemInformationResponse.itemInformationRequestDocumentReference.id,itemInformationResponse.sellerSupplierParty.party.federationInstanceID);
	}

	getDocumentJsonContent(documentId:string,targetInstanceId:string):Promise<any> {
        const initiatorInstanceId = this.cookieService.get("federation_instance_id");
        const token = 'Bearer '+this.cookieService.get("bearer_token");
        let headers = new Headers({'Authorization': token});
        this.headers.keys().forEach(header => headers.append(header, this.headers.get(header)));
		const url = `${this.url}/document/json/${documentId}?initiatorInstanceId=${initiatorInstanceId}&targetInstanceId=${targetInstanceId}`;
		return this.http
            .get(url, {headers: headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
	}

	getProcessInstanceGroupFilters(partyId:string, collaborationRole: CollaborationRole, archived: boolean, products: string[], categories: string[], partners: string[]): Promise<ProcessInstanceGroupFilter> {
        const initiatorInstanceId = this.cookieService.get("federation_instance_id");
		const token = 'Bearer '+this.cookieService.get("bearer_token");
		let headers = new Headers({'Accept': 'application/json','Authorization': token});
		this.headers.keys().forEach(header => headers.append(header, this.headers.get(header)));

		let url:string = `${this.url}/group/filters?initiatorInstanceId=${initiatorInstanceId}&partyID=${partyId}&collaborationRole=${collaborationRole}&archived=${archived}`;
		if(products.length > 0) {
			url += '&relatedProducts=' + this.stringifyArray(products);
		}
		if(categories.length > 0) {
			url += '&relatedProductCategories=' + this.stringifyArray(categories);
		}
		if(partners.length > 0) {
			url += '&tradingPartnerIDs=' + this.stringifyArray(partners);
		}
		return this.http
            .get(url, {headers: headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
	}

	getProcessInstanceGroups(partyId:string, collaborationRole: CollaborationRole, page: number, limit: number, archived: boolean, products: string[], categories: string[], partners: string[]): Promise<ProcessInstanceGroupResponse> {
        const initiatorInstanceId = this.cookieService.get("federation_instance_id");
		const token = 'Bearer '+this.cookieService.get("bearer_token");
        let headers = new Headers({'Authorization': token});
        this.headers.keys().forEach(header => headers.append(header, this.headers.get(header)));
		let offset:number = page * limit;
		let url:string = `${this.url}/group?initiatorInstanceId=${initiatorInstanceId}&partyID=${partyId}&collaborationRole=${collaborationRole}&offset=${offset}&limit=${limit}&archived=${archived}`;
		if(products.length > 0) {
			url += '&relatedProducts=' + this.stringifyArray(products);
		}
		if(categories.length > 0) {
			url += '&relatedProductCategories=' + this.stringifyArray(categories);
		}
		if(partners.length > 0) {
			url += '&tradingPartnerIDs=' + this.stringifyArray(partners);
		}
		return this.http
            .get(url, {headers: headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
	}

	deleteProcessInstanceGroup(groupId: string) {
        const token = 'Bearer '+this.cookieService.get("bearer_token");
        let headers = new Headers({'Authorization': token});
        this.headers.keys().forEach(header => headers.append(header, this.headers.get(header)));
		const url = `${this.url}/group/${groupId}`;
		return this.http
            .delete(url,{headers: headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
	}

	archiveProcessInstanceGroup(groupId: string) {
        const token = 'Bearer '+this.cookieService.get("bearer_token");
        let headers = new Headers({'Authorization': token});
        this.headers.keys().forEach(header => headers.append(header, this.headers.get(header)));
		const url = `${this.url}/group/${groupId}/archive`;
		return this.http
            .post(url, null,{headers: headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
	}

	restoreProcessInstanceGroup(groupId: string) {
        const token = 'Bearer '+this.cookieService.get("bearer_token");
        let headers = new Headers({'Authorization': token});
        this.headers.keys().forEach(header => headers.append(header, this.headers.get(header)));
		const url = `${this.url}/group/${groupId}/restore`;
		return this.http
            .post(url, null,{headers: headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
	}

	constructContractForProcess(processInstancesId: string,targetInstanceId:string): Promise<Contract> {
        const initiatorInstanceId = this.cookieService.get("federation_instance_id");
        const token = 'Bearer '+this.cookieService.get("bearer_token");
        let headers = new Headers({'Authorization': token});
        this.headers.keys().forEach(header => headers.append(header, this.headers.get(header)));
		const url = `${this.url}/contracts?processInstanceId=${processInstancesId}&initiatorInstanceId=${initiatorInstanceId}&targetInstanceId=${targetInstanceId}`;
		return this.http
            .get(url, {headers: headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
	}

	getClauseDetails(clauseId:string,targetInstanceID:string): Promise<Clause> {
        const initiatorInstanceId = this.cookieService.get("federation_instance_id");
        const token = 'Bearer '+this.cookieService.get("bearer_token");
        let headers = new Headers({'Authorization': token});
        this.headers.keys().forEach(header => headers.append(header, this.headers.get(header)));
        const url = `${this.delegate_url}/clauses/${clauseId}?initiatorInstanceId=${initiatorInstanceId}&targetInstanceId=${targetInstanceID}`;
		return this.http
            .get(url, {headers: headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
	}

	downloadContractBundle(id: string): Promise<any> {
        const token = 'Bearer '+this.cookieService.get("bearer_token");
        const url = `${this.url}/contracts/create-bundle?orderId=${id}`;
        return new Promise<any>((resolve, reject) => {
            let xhr = new XMLHttpRequest();

            xhr.open('GET', url, true);
            xhr.setRequestHeader('Accept', 'application/zip');
            xhr.setRequestHeader('Authorization',token);
            xhr.responseType = 'blob';

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {

                        var contentType = 'application/zip';
                        var blob = new Blob([xhr.response], {type: contentType});
                        resolve({fileName: "Contract Bundle.zip", content: blob});
                    } else {
                        reject(xhr.status);
                    }
                }
            }
            xhr.send();
        });
    }

    generateOrderTermsAndConditionsAsText(order: Order, buyerParty, sellerParty): Promise<string> {
        const token = 'Bearer '+this.cookieService.get("bearer_token");
        let headers = new Headers({'Authorization': token});
        this.headers.keys().forEach(header => headers.append(header, this.headers.get(header)));
        const url = `${this.url}/contracts/create-terms?orderId=${order.id}&sellerParty=${JSON.stringify(sellerParty)}&buyerParty=${JSON.stringify(buyerParty)}&incoterms=${order.orderLine[0].lineItem.deliveryTerms.incoterms == null ? "" :order.orderLine[0].lineItem.deliveryTerms.incoterms}&tradingTerms=${encodeURIComponent(JSON.stringify(this.getSelectedTradingTerms(order.paymentTerms.tradingTerms)))}`;
        return this.http
            .get(url, {headers: headers})
            .toPromise()
            .then(res => res.text())
            .catch(this.handleError);
	}

	private  getSelectedTradingTerms(tradingTerms): TradingTerm[] {
        let selectedTradingTerms: TradingTerm[] = [];

        for(let tradingTerm of tradingTerms){
            if(tradingTerm.id.indexOf("Values") != -1){
                let addToList = true;
                for(let value of tradingTerm.value){
                    if(value == null){
                        addToList = false;
                        break;
                    }
                }
                if(addToList){
                    selectedTradingTerms.push(tradingTerm);
                }
            }
            else{
                if(tradingTerm.value[0] == 'true'){
                    selectedTradingTerms.push(tradingTerm);
                }
            }
        }
        return selectedTradingTerms;
	}

	private stringifyArray(values: any[]): string {
		let paramVal: string = '';
		for (let value of values) {
			paramVal += value + ',';
		}
		paramVal = paramVal.substring(0, paramVal.length-1);
		return paramVal;
	}

	private handleError(error: any): Promise<any> {
		return Promise.reject(error.message || error);
	}
}
