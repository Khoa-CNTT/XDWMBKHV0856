import http from "../../../config/http";

export const updateUser = async (data, id) => {
    try {
        const response = await http.put("/user", {
            ...data,
            id,
        });
        toast.success("Update successfully", {
            autoClose: 1000,
        });
        localStorage.setItem("user", JSON.stringify(response.data.data));
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const updateAvatar = async (file, id) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await http.patch(`/user.avatar/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        toast.success("Update successfully", {
            autoClose: 1000,
        });
        localStorage.setItem("user", JSON.stringify(response.data.data));
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const uploadBackground = async (file, id) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await http.patch(`/user.background/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        toast.success("Update successfully", {
            autoClose: 1000,
        });
        localStorage.setItem("user", JSON.stringify(response.data.data));
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
};
