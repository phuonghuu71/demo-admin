import axios from "axios";
import { Vehicle } from "./column";

export async function fetchData(token: string): Promise<Vehicle[]> {
    const response = await axios.get(
        "https://dev254205.service-now.com/api/x_1281635_vehicles/v2/vehicles/vehicles?name=Nissan",
        {
            headers: {
                Authorization: `Bearer ${token}`, // Use accessToken in Authorization header
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );

    return response.data.result;
}
