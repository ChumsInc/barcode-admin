import OverlayTrigger, {type OverlayTriggerProps} from "react-bootstrap/OverlayTrigger";
import Tooltip, {type TooltipProps} from "react-bootstrap/Tooltip";
import Button, {type ButtonProps} from "react-bootstrap/Button";
import {useCustomerItems} from "@/components/customer/items/useCustomerItems.ts";

export interface PasteIconProps extends ButtonProps {
    pasteValue?: string | null;
    overlayTriggerProps?: OverlayTriggerProps;
    tooltipProps?: TooltipProps;
}

export default function PasteButton({
                                        pasteValue,
                                        onClick,
                                        overlayTriggerProps,
                                        tooltipProps,
                                        disabled,
                                        ...rest
                                    }: PasteIconProps) {
    const {canEdit} = useCustomerItems()

    return (
        <OverlayTrigger {...overlayTriggerProps} placement="bottom"
                        overlay={<Tooltip {...tooltipProps}>Paste '{pasteValue}'</Tooltip>}>
            <Button type="button" onClick={onClick} variant={pasteValue ? "secondary" : 'outline-secondary'}
                    disabled={!pasteValue || !canEdit || disabled}
                    {...rest}>
                <span className="bi-clipboard-plus"/>
            </Button>
        </OverlayTrigger>
    );
}
