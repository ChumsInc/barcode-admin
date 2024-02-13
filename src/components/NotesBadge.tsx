import React, {MouseEvent, useId, useState} from 'react';
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import {BootstrapBGColor} from "chums-components";
import classNames from "classnames";
import {IconButton, Tooltip} from "@mui/material";
import NotesIcon from '@mui/icons-material/Notes';
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
        <Tooltip title={note}>
            <IconButton color="info" size="small" sx={{color: 'white', backgroundColor: 'info.main'}}>
                <NotesIcon />
            </IconButton>
        </Tooltip>
    )

}

export default NotesBadge;
