// import DashboardService from "../../services/dashboard/Dashboard"
import { dashboardStubService } from "../../stubs/dashboard/Dashboard"


export const AppLayout = async () => {
    try {
        const response = await dashboardStubService.appLayout();
        // const response = await DashboardService.appLayout();
        return response
    } catch (error) {
        return error.message
    }
}