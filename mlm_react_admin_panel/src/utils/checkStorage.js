import { AddModeratorOutlined } from "@mui/icons-material";

export const setLoginResponseCheck = () => {
    const accessToken = localStorage.getItem('accessToken');
    const admin = localStorage.getItem('admin');
    if (!accessToken || !AddModeratorOutlined) {
        localStorage.clear()
    }
    const data = { accessToken, admin };

    return data
}


