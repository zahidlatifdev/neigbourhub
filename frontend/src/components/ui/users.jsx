import axios from "axios";

export const fetchUsers = {
    fetchUsers: async () => {
        const response = await axios.get("https://jsonplaceholder.typicode.com/users");
        return response.data;
    },
};