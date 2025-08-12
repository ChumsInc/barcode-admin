import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import NotesIcon from '@mui/icons-material/Notes';
import type {Variant} from "react-bootstrap/types";

const NotesBadge = ({
                        note,
                    }: {
    note: string | null;
    bg?: Variant;
}) => {

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
