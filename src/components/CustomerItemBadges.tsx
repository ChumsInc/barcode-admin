import React from 'react';
import {ProductType} from "chums-types";
import {Badge} from "react-bootstrap";


export interface CustomerItemBadgesProps {
    inactiveItem?: 'Y' | 'N' | null;
    productType?: ProductType | null;
    productStatus?: string | null;
}

const CustomerItemBadges = ({inactiveItem, productType, productStatus}: CustomerItemBadgesProps) => {
    if (productType === 'D') {
        return (<Badge color="dark">Disco</Badge>);
    }
    if (inactiveItem === 'Y') {
        return (<Badge color="danger">Inactive</Badge>);
    }

    return (
        <>
            {!!productStatus && <Badge bg="warning" text="dark">{productStatus}</Badge>}
            {!productType && <Badge bg="info">Custom</Badge>}
        </>
    )
}

export default CustomerItemBadges;
