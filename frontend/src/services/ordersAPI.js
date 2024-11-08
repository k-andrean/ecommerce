import { useQuery } from '@tanstack/react-query';
import fetchAxios from "utils/axios";


const useGetOrderDetailQuery = ( userId, orderId ) => {
    return useQuery({
        queryKey: ['getOrder'], // use the object form
        queryFn: async () => {
            const { data } = await fetchAxios.get(`/orders/${userId}/${orderId}`);
            return data;
        }
    });
};

const useGetUserOrdersQuery = ( userId ) => {
    return useQuery({
        queryKey: ['getUserOrder'], // use the object form
        queryFn: async () => {
            const { data } = await fetchAxios.get(`/orders/${userId}`);
            return data;
        }
    });
};


export {
    useGetOrderDetailQuery,
    useGetUserOrdersQuery
} 

