/**
 * Created by suat on 18-May-17.
 */
import {Component, Input, OnInit} from "@angular/core";
import {ItemProperty} from "./model/publish/item-property";
import {PublishAndAIPCService} from "./publish-and-aip.service";

@Component({
    selector: 'additional-item-property',
    templateUrl: './additional-item-property.component.html'
})

export class AdditionalItemPropertyComponent implements OnInit {
    @Input() additionalItemProperty:ItemProperty;
    /* Display only attribute bolds the label text, adds
     * a colon to the end of the label, and makes properties
     * multi-line viewable and uneditable
     * TODO: make this a separate component?
     */
    @Input() displayOnly = false;

    stringValue:boolean = true;
    binaryValue:boolean = false;

    constructor(
        private _publishAndAIPCService: PublishAndAIPCService) { }

    ngOnInit(): void {
        if(this.additionalItemProperty.embeddedDocumentBinaryObject.length != 0) {
            this.stringValue = false;
            this.binaryValue = true;
        }
    }

    //store in deleted properties for later check
    deleteCP(inputVal: string) {
        this._publishAndAIPCService.addToDeletedProperties(inputVal);
    }
}