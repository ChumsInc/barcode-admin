import {useOrderStickers} from "@/components/customer/order-stickers/useOrderStickers.ts";
import {useSalesOrder} from "@/components/customer/order-stickers/useSalesOrder.ts";
import {useState} from "react";
import {usePrintOptions} from "@/components/customer/order-stickers/usePrintOptions.ts";
import Modal from "react-bootstrap/Modal";
import {ProgressBar} from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import {detailSorter} from "@/components/customer/order-stickers/utils.ts";

export default function GenerateStickersButton() {
    const {generateStickers, status} = useSalesOrder();
    const {setAllChecked} = useOrderStickers();
    const {detail} = useOrderStickers();
    const {reversed, sort, shipToCode} = usePrintOptions();
    const [generated, setGenerated] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [show, setShow] = useState<boolean>(false);

    const handleGenerateStickers = async () => {
        const lines = detail.filter(row => row.selected)
            .filter(row => !shipToCode || row.UDF_SHIP_CODE === shipToCode)
            .filter(row => row.item && (row.stickerQty ?? 0 > 0))
            .sort(detailSorter(sort))
            .map(row => ({
                LineKey: row.LineKey,
                item_id: row.item!.ID,
                quantity: row.stickerQty!
            }))
        try {
            setGenerated(0);
            setShow(true);
            const result = await generateStickers({lines, reversed})
            setGenerated(result);
            setAllChecked(false);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    }

    const closeModalHandler = () => {
        setShow(false);
    }

    const count = detail.filter(row => row.selected && row.item && (row.stickerQty ?? 0 > 0))
        .reduce((acc, row) => acc + row.stickerQty!, 0);

    return (
        <>
            <button type="button" className="btn btn-sm btn-success" disabled={count === 0}
                    onClick={handleGenerateStickers}>
                Generate Stickers ({count})
            </button>
            <Modal onHide={closeModalHandler} show={show}>
                <Modal.Header closeButton>
                    <Modal.Title>Generating Stickers</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {status === 'generating' && <ProgressBar now={100} striped animated/>}
                    <div>Stickers Generated: {generated}</div>
                    {error && (
                        <Alert variant="danger">
                            {error}
                        </Alert>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-secondary" onClick={closeModalHandler}>
                        Close
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
