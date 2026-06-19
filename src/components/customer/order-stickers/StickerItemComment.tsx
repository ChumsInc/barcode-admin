import NotesBadge from "../../NotesBadge.tsx";
import {useAppDispatch} from "@/app/configureStore.ts";
import {toggleLineSelected} from "@/ducks/salesOrder/actions.ts";

export interface StickerItemCommentProps {
    lineKey: string;
    itemCode: string;
    commentText?: string | null;
    notes?: string | null;
    specialInstructions?: string | null;
}

const StickerItemComment = ({lineKey, itemCode, commentText, notes, specialInstructions}: StickerItemCommentProps) => {
    const dispatch = useAppDispatch();

    const clickHandler = () => {
        dispatch(toggleLineSelected({lineKey}))
    }
    return (
        <div className="d-flex justify-content-start">
            <div className="me-3" onClick={clickHandler}>{itemCode}</div>
            {!!commentText && <NotesBadge note={commentText}/>}
            {!!notes && <NotesBadge note={notes}/>}
            {!!specialInstructions && <NotesBadge note={specialInstructions} bg="warning"/>}
        </div>
    )
}
export default StickerItemComment;
