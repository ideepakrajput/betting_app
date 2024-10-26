import apiClient from "./apiClient";

const handleResponse = (response) => {
    console.log(response, "response");

    if (response.status >= 200 && response.status < 300) {
        return response.data;
    } else {
        throw {
            status: response.status,
            message: response.data.message || 'An error occurred',
            data: response.data
        };
    }
};

export const login = async (credentials) => {
    try {
        const response = await apiClient.post('api/user/login', credentials);
        return handleResponse(response);
    } catch (error) {
        throw handleResponse(error.response);
    }
};

export const register = async (userData) => {
    try {
        const response = await apiClient.post('api/user/register', userData);
        console.log(response, "responseu");

        return handleResponse(response);
    } catch (error) {
        console.log(response, error, "responseu");

        throw handleResponse(error.response);
    }
};

export const me = async () => {
    try {
        const response = await apiClient.get('api/user/me');
        return handleResponse(response);
    } catch (error) {
        throw handleResponse(error.response);
    }
};

export const checkUserWithPhone = async (phone) => {
    try {
        const response = await apiClient.post(`api/user/check-user`, phone);
        return handleResponse(response);
    } catch (error) {
        throw handleResponse(error.response);
    }
};

export const changePassword = async (passwords) => {
    try {
        const response = await apiClient.post('api/user/change-password', passwords);
        return handleResponse(response);
    } catch (error) {
        throw handleResponse(error.response);
    }
};

export const updateBankDetails = async (bankDetails) => {
    try {
        const response = await apiClient.post('api/user/update-bank-details', bankDetails);
        return handleResponse(response);
    } catch (error) {
        throw handleResponse(error.response);
    }
};

export const updateUpiDetails = async (upiDetails) => {
    try {
        const response = await apiClient.post('api/user/update-upi-details', upiDetails);
        return handleResponse(response);
    } catch (error) {
        throw handleResponse(error.response);
    }
};

export const AddMoney = async (transactionId, amount) => {
    try {
        const response = await apiClient.post(`api/transaction/add-money`, { transactionId, amount });
        return handleResponse(response);
    } catch (error) {
        throw handleResponse(error.response);
    }
};

export const withdrawMoney = async (amount) => {
    try {
        const response = await apiClient.post(`api/transaction/withdraw-money`, { amount });
        return handleResponse(response);
    } catch (error) {
        throw handleResponse(error.response);
    }
};