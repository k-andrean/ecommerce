import { useQuery } from "@tanstack/react-query";
import fetchAxios from "utils/axios";


const useGetAllCollectionsQuery = () => {
    return useQuery({
        queryKey: ['getAllCollections'], // use the object form
        queryFn: async () => {
            const { data } = await fetchAxios.get(`/collections`);
            return data;
        }
    });
};

const useGetCollectionQuery = (id) => {
    return useQuery({
        queryKey: ['getCollection'], // use the object form
        queryFn: async () => {
            const { data } = await fetchAxios.get(`/collections/${id}`);
            return data;
        }
    });
};



export {
    useGetAllCollectionsQuery,
    useGetCollectionQuery
}
