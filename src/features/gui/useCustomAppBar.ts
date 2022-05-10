import { useEffect } from "react"
import { useAppDispatch } from "../../app/hooks"
import { appBarBackButtonDisabled, appBarBackButtonEnabled, appBarTitleCustomized, appBarTitleReset } from "./guiSlice"

export const useCustomAppBar = (title: string, enableBackButton=false) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(appBarTitleCustomized(title));
        if (enableBackButton) {
            dispatch(appBarBackButtonEnabled());
        }

        return () => {
            dispatch(appBarTitleReset());
            dispatch(appBarBackButtonDisabled());
        }
    }, [dispatch, title, enableBackButton]);
}