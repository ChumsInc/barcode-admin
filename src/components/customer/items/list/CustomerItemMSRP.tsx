import is_number from "is-number";
import Decimal from "decimal.js";
import numeral from "numeral";

export interface CustomerItemMSRPProps {
    msrp: string;
    suggestedRetailPrice: string | number | null | undefined;
}
export default function CustomerItemMSRP({msrp, suggestedRetailPrice}:CustomerItemMSRPProps) {
    if (!suggestedRetailPrice || !is_number(msrp)) {
        return <>{msrp}</>;
    }
    return (
        <div className="text-nowrap">
            <span>{numeral(msrp).format('0,0.00')}</span>
            {new Decimal(msrp).lt(suggestedRetailPrice) && (
                <span className="ms-1 bi-exclamation-triangle-fill text-danger"/>)}
            {new Decimal(msrp).gt(suggestedRetailPrice) && (
                <span className="ms-1 bi-exclamation-triangle-fill text-success"/>)}
        </div>
    )

}
