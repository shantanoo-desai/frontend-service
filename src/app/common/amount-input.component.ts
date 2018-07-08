import { Component, EventEmitter, OnInit, Input, Output } from "@angular/core";
import { Quantity } from "../catalogue/model/publish/quantity";
import { UnitService } from "./unit-service";

@Component({
    selector: "amount-input",
    templateUrl: "./amount-input.component.html",
    styleUrls: ["./amount-input.component.css"],
})
export class AmountInputComponent implements OnInit {

    @Input() visible: boolean = true;
    @Input() disabled: boolean = false;
    @Input() presentationMode: "edit" | "view" = "edit";

    @Input() label: string;
    @Input() definition: string;
    @Input() labelClass: string = "col-3";
    @Input() labelMainClass: string = "";
    @Input() rowClass: string = "";
    @Input() valueClass: string; // set based on label
    @Input() placeholder: string = "Enter a value...";
    
    private amountValue: number;
    @Output() amountChange = new EventEmitter<number>();
    @Input() amountUnit?: string;

    constructor() {

    }

    ngOnInit() {
        if(!this.valueClass) {
            this.valueClass = this.label ? "col-9" : "col-12";
        }
    }

    @Input()
    get amount(): number {
        return this.amountValue;
    }

    set amount(value: number) {
        this.amountValue = value;
        this.amountChange.emit(value);
    }
}