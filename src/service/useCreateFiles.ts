import { useMutation } from "@tanstack/react-query";
import { request } from "../config/request";

export interface dataType {
    data: {
        fileName: string;
        path: string;
        size: number;
    }[];
    error: null;
    success: boolean;
}
export const useCreatFile = () => {
    return useMutation({
        mutationFn: (data: FormData) =>
            request
                .post<dataType>("/api/staff/upload/contract/attachment", data)
                .then((res) => res.data),
    });
};
