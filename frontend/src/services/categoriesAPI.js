import { useQuery } from "@tanstack/react-query";
import fetchAxios from "utils/axios";


const useGetAllCategoriesQuery = () => {
    return useQuery({
        queryKey: ['getAllCategories'], // use the object form
        queryFn: async () => {
            const { data } = await fetchAxios.get(`/categories`);
            return data;
        }
    });
};

const useGetCategoryQuery = (id) => {
    return useQuery({
        queryKey: ['getCategory'], // use the object form
        queryFn: async () => {
            const { data } = await fetchAxios.get(`/categories/${id}`);
            return data;
        }
    });
};


export {
    useGetAllCategoriesQuery,
    useGetCategoryQuery
}
