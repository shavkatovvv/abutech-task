import { useQuery } from "@tanstack/react-query";
import { request } from "../config/request";

export const useGetSert = () => {
    return useQuery({
        queryKey: ["contracts"],
        queryFn: () => request.get("/api/staff/contracts/all"),
    });
};
