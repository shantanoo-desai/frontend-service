import {GoodsItem} from "./goods-item";
import {ItemLocationQuantity} from "./item-location-quantity";
import {Period} from "./period";
/**
 * Created by suat on 26-May-17.
 */
export class CatalogueLine {
    constructor(
        public hjid:string,
        public orderableUnit: string,
        public warrantyValidityPeriod: Period,
        public warrantyInformation: string[],
        public requiredItemLocationQuantity: ItemLocationQuantity,
        public goodsItem:GoodsItem
    ) {  }
}