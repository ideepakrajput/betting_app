import apiClient from "./apiClient";

const handleResponse = (response) => {

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
        return handleResponse(response);
    } catch (error) {
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

export const getBazaars = async () => {
    try {
        const response = await apiClient.get('api/user/bazaars');
        return handleResponse(response);
    } catch (error) {
        throw handleResponse(error.response);
    }
};

export const jantariBets = async (betsData) => {
    try {
        const response = await apiClient.post('api/bet/jantari', betsData);
        return handleResponse(response);
    } catch (error) {
        throw handleResponse(error.message);
    }
}

export const OpenPlayBets = async (betsData) => {
    try {
        const response = await apiClient.post('api/bet/open-play', betsData);
        return handleResponse(response);
    } catch (error) {
        throw handleResponse(error.message);
    }
}

export const CrossPlayBets = async (betsData) => {
    try {
        const response = await apiClient.post('api/bet/cross', betsData);
        return handleResponse(response);
    } catch (error) {
        throw handleResponse(error.message);
    }
}

export const getBetHistory = async () => {
    try {
        const response = await apiClient.get('api/user/bet-history');
        return handleResponse(response);
    } catch (error) {
        throw handleResponse(error.message);
    }
}

export const getUPIDetails = async () => {
    try {
        const response = await apiClient.get('api/user/admin-upi');
        return handleResponse(response);
    } catch (error) {
        throw handleResponse(error.message);
    }
}

export const sentOTP = async (phone) => {
    try {
        const response = await apiClient.post('api/user/send-otp', { phone });
        return handleResponse(response);
    } catch (error) {
        throw handleResponse(error.message);
    }
}

export const verifyEmailOTP = async (email) => {
    try {
        const response = await apiClient.post('api/user/verify-email-otp', { email });
        return handleResponse(response);
    } catch (error) {
        throw handleResponse(error.message);
    }
}

export const resetPassword = async (newPassword, phone) => {
    try {
        const response = await apiClient.post('api/user/reset-password', { newPassword, phone });
        return handleResponse(response);
    } catch (error) {
        throw handleResponse(error.message);
    }
}

export const getResultHistory = async () => {
    try {
        const response = await apiClient.get('api/bazaar/result');
        return handleResponse(response);
    } catch (error) {
        throw handleResponse(error.message);
    }
}