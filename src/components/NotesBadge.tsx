import React, {MouseEvent, useId, useState} from 'react';
import {Popover, Typography} from "@mui/material";
import {BootstrapBGColor} from "chums-components";
import classNames from "classnames";

const NotesBadge = ({

                        note,
                        color = 'info'
                    }: {
    note: string | null;
    color?: BootstrapBGColor;
}) => {
    const [open, setOpen] = useState(false);
    const [badgeRef, setBadgeRef] = useState<HTMLDivElement | null>(null);
    const id = useId();


    const handleToggle = (ev: MouseEvent<HTMLDivElement>) => {
        ev.preventDefault();
        ev.stopPropagation();
        setBadgeRef(ev.currentTarget);
    }

    const handleClose = (ev: MouseEvent) => {
        ev.preventDefault();
        ev.stopPropagation();
        setBadgeRef(null);
    }

    if (!note) {
        return null;
    }
    return (
        <div>
            <div className={classNames("badge", {[`bg-${color}`]: !!color})} style={{cursor: 'pointer'}}
                 onClick={handleToggle} aria-describedby={id}>
                <span className="bi-card-text"/>
            </div>
            <Popover open={Boolean(badgeRef)} id={id} anchorEl={badgeRef} onClose={handleClose}
                     anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} onClick={handleClose}>
                <Typography sx={{
                    width: 400,
                    maxWidth: '50vw',
                    height: 'auto',
                    whiteSpace: 'pre-wrap',
                    m: 1,
                    overflow: 'auto'
                }}>{note}</Typography>
            </Popover>
        </div>
    )
}

export default NotesBadge;
