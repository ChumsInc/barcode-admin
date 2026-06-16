import Tooltip from "react-bootstrap/Tooltip";
import type {Variant} from "react-bootstrap/types";
import {OverlayTrigger} from "react-bootstrap";
import classNames from "classnames";

const NotesBadge = ({
                        note,
                        bg = 'secondary'
                    }: {
    note: string | null;
    bg?: Variant;
}) => {

    if (!note) {
        return null;
    }

    return (
        <OverlayTrigger overlay={<Tooltip>{note}</Tooltip>}>
            <div className={classNames("badge", {[`bg-${bg}`]: !!bg})}>
                <span className="bi-card-checklist"/>
            </div>
        </OverlayTrigger>
    )

}

export default NotesBadge;
