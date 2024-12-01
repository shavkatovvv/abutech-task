import { useQuery } from "@tanstack/react-query";
import { request } from "../config/request";

export const useSearchSert = (input = "") => {
    return useQuery({
        queryKey: ["search", input],
        queryFn: () =>
            request
                .get("/api/staff/contracts/all", {
                    params: {
                        title_like: input || undefined,
                    },
                })
                .then((res) => res.data),
    });
};
