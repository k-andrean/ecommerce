import fetchAxios from "utils/axios";

export const processPayment = async (formData) => {
    console.log('form Data', formData)

    try {
        const response = await fetchAxios.post('/processPayment', formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          }); // Directly pass the payment details

        return response.data; // Return the payment response data from the Axios response
    } catch (error) {
        console.error('Error processing payment:', error);
        return { status: 'failed' }; // Handle the error accordingly
    }
};