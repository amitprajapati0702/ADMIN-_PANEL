import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";

const PageTitle = ({ title }) => {
    const { t } = useTranslation();
    const location = useLocation();

    useEffect(() => {
        const pageTitle = location.pathname.split('/')[1];
        if (title) {
            document.title = title;
        } else {
            document.title = `${t('user')} | ${t(pageTitle)}`;
        }
    }, [location, title]);

    return null;
};

export default PageTitle;
