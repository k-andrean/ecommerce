import { useQuery } from "@tanstack/react-query";
import fetchAxios from "utils/axios";


const useGetProvincesQuery = () => {
    return useQuery({
        queryKey: ['getProvinces'], // use the object form
        queryFn: async () => {
            const { data } = await fetchAxios.get(`/cities/getProvinces`);
            return data;
        }
    });
};

export {
    useGetProvincesQuery
}
