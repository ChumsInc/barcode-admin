import NotesBadge from "../../NotesBadge.tsx";

export interface StickerItemCommentProps {
    itemCode: string;
    commentText?: string | null;
    notes?: string | null;
    specialInstructions?: string | null;
}

const StickerItemComment = ({itemCode, commentText, notes, specialInstructions}: StickerItemCommentProps) => {
    return (
        <div className="d-flex justify-content-start">
            <div className="me-3">{itemCode}</div>
            {!!commentText && <NotesBadge note={commentText}/>}
            {!!notes && <NotesBadge note={notes}/>}
            {!!specialInstructions && <NotesBadge note={specialInstructions} bg="warning"/>}
        </div>
    )
}
export default StickerItemComment;
