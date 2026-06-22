import Alert from "react-bootstrap/Alert";
import {useOrderStickers} from "@/components/customer/order-stickers/useOrderStickers.ts";

const MissingItemAlert = () => {
    const {detail} = useOrderStickers();
    const missing = detail
        .filter(row => row.ItemType === '1')
        .filter(row => row.UnitOfMeasure !== 'KIT')
        .filter(row => !row.ItemCode.startsWith('PEG'))
        .filter(row => !row.ItemCode.startsWith('98'))
        .filter(row => !row.item).length;

    if (!missing) {
        return null;
    }
    return (
        <Alert variant="warning">
            <span className="bi-exclamation-triangle-fill me-1"/>
            Missing data for <strong>{missing}</strong> item{missing === 1 ? '' : 's'}.
        </Alert>
    )
}

export default MissingItemAlert;
