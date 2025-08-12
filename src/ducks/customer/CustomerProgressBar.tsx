import {useSelector} from "react-redux";
import {selectCustomerLoading, selectCustomerSaving} from "./selectors";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import LinearProgress from "@mui/material/LinearProgress";

export default function CustomerProgressBar() {
    const loading = useSelector(selectCustomerLoading);
    const saving = useSelector(selectCustomerSaving);
    return (
        <Box sx={{height: 10}}>
            <Fade in={loading || saving} style={{transitionDelay: loading ? '800ms' : '0'}} unmountOnExit>
                <LinearProgress variant="indeterminate" color={saving ? 'success' : 'primary'} />
            </Fade>
        </Box>
    )
}
