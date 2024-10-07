import { useQuery } from '@tanstack/react-query';
import fetchAxios from "utils/axios";

const useGetAllProductsQuery = () => {
    return useQuery({
        queryKey: ['getAllProducts'], // Unique key for this query
        queryFn: async () => {
            const { data } = await fetchAxios.get('/products');
            return data; // Return the data
        },
    });
};


const useGetProductQuery = (id) => {
    return useQuery({
        queryKey: ['getProduct'], // use the object form
        queryFn: async () => {
            const { data } = await fetchAxios.get(`/products/${id}`);
            return data;
        }
    });
};

const useGetProductWithCategoryQuery = (categoryId) => {
    return useQuery({
        queryKey: ['getProductWithCategory'], // use the object form
        queryFn: async () => {
            const { data } = await fetchAxios.get(`/products/categories/${categoryId}`);
            return data;
        }
    });
};


export {
    useGetAllProductsQuery,
    useGetProductQuery,
    useGetProductWithCategoryQuery
}
