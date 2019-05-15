import { CatalogueLine } from "../../../catalogue/model/publish/catalogue-line";
import { RequestForQuotation } from "../../../catalogue/model/publish/request-for-quotation";
import { Quotation } from "../../../catalogue/model/publish/quotation";
import { Amount } from "../../../catalogue/model/publish/amount";
import { Quantity } from "../../../catalogue/model/publish/quantity";
import { PaymentTermsWrapper } from "../payment-terms-wrapper";
import {copy, durationToString} from "../../../common/utils";
import { PriceWrapper } from "../../../common/price-wrapper";
import { Address } from "../../../catalogue/model/publish/address";
import { CompanyNegotiationSettings } from "../../../user-mgmt/model/company-negotiation-settings";
import {TradingTerm} from "../../../catalogue/model/publish/trading-term";
import {MultiTypeValue} from "../../../catalogue/model/publish/multi-type-value";
import {DiscountPriceWrapper} from "../../../common/discount-price-wrapper";

export class QuotationWrapper {

    paymentTermsWrapper: PaymentTermsWrapper;
    priceWrapper: PriceWrapper;

    constructor(private quotation: Quotation) {
        this.paymentTermsWrapper = new PaymentTermsWrapper(quotation.paymentTerms);
        this.priceWrapper = new PriceWrapper(quotation.quotationLine[0].lineItem.price, quotation.quotationLine[0].lineItem.quantity);
    }

    public get priceAmount(): Amount {
        return this.quotation.quotationLine[0].lineItem.price.priceAmount;
    }

    public get orderedQuantity(): Quantity {
        return this.quotation.quotationLine[0].lineItem.quantity;
    }

    public set orderedQuantity(quantity: Quantity) {
        this.quotation.quotationLine[0].lineItem.quantity = quantity;
    }

    public get deliveryPeriod(): Quantity {
        return this.quotation.quotationLine[0].lineItem.delivery[0].requestedDeliveryPeriod.durationMeasure;
    }

    public get deliveryPeriodString(): string {
        return durationToString(this.deliveryPeriod);
    }

    public get warranty(): Quantity {
        return this.quotation.quotationLine[0].lineItem.warrantyValidityPeriod.durationMeasure;
    }

    public get warrantyString(): string {
        return durationToString(this.warranty);
    }

    public get incoterms(): string {
        return this.quotation.quotationLine[0].lineItem.deliveryTerms.incoterms;
    }

    public get incotermsString(): string {
        return this.quotation.quotationLine[0].lineItem.deliveryTerms.incoterms || "None";
    }

    public set incoterms(incoterms: string) {
        this.quotation.quotationLine[0].lineItem.deliveryTerms.incoterms = incoterms;
    }

    public get paymentMeans(): string {
        return this.quotation.paymentMeans.paymentMeansCode.value;
    }

    public set paymentMeans(paymentMeans: string) {
        this.quotation.paymentMeans.paymentMeansCode.value = paymentMeans;
    }

    public get frameContractDuration(): Quantity {
        let tradingTerm: TradingTerm = this.quotation.tradingTerms.find(tradingTerm => tradingTerm.id == "FRAME_CONTRACT_DURATION");
        if(tradingTerm != null) {
            return tradingTerm.value.valueQuantity[0];
        }
        return null;
    }

    public set frameContractDuration(duration: Quantity) {
        let tradingTerm: TradingTerm = this.quotation.tradingTerms.find(tradingTerm => tradingTerm.id == "FRAME_CONTRACT_DURATION");
        if(tradingTerm == null) {
            tradingTerm = new TradingTerm("FRAME_CONTRACT_DURATION", null, null, new MultiTypeValue());
            tradingTerm.value.valueQuantity.push(duration)
            this.quotation.tradingTerms.push(tradingTerm);
        } else {
            tradingTerm.value.valueQuantity[0] = duration;
        }
    }
}