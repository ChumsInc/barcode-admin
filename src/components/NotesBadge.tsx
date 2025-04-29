import React, {MouseEvent, useId, useState} from 'react';
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import NotesIcon from '@mui/icons-material/Notes';
import {Variant} from "react-bootstrap/types";

const NotesBadge = ({
                        note,
                        bg = 'info'
                    }: {
    note: string | null;
    bg?: Variant;
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
        <Tooltip title={note}>
            <IconButton color="info" size="small" sx={{color: 'white', backgroundColor: 'info.main'}}>
                <NotesIcon/>
            </IconButton>
        </Tooltip>
    )

}

export default NotesBadge;
