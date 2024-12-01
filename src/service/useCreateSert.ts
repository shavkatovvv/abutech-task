import { useMutation } from "@tanstack/react-query";
import { request } from "../config/request";

export interface Icontract {
    title?: string;
    courseId: number;
    attachment: {
        size?: number;
        url?: string;
        origName?: string;
    };
}

export const userCreateSert = () => {
    return useMutation({
        mutationFn: (data: Icontract) =>
            request
                .post("/api/staff/contracts/create", data)
                .then((res) => res.data),
    });
};
