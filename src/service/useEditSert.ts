import { useMutation, useQueryClient } from "@tanstack/react-query";
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

export const userEditSert = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Icontract }) =>
            request
                .put(`/api/staff/contracts/${id}`, data)
                .then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contracts"] });
        },
    });
};
