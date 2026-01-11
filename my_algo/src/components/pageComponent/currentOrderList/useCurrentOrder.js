import { useEffect, useState } from "react";
import { fetchApi } from "../../../utils/frondend";

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loader, setLoader] = useState(false);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState(1);
    const [orderCol, setOrderCol] = useState(7);
    const [totalPage, setTotalPage] = useState(0);

    const fetchUsers = async () => {
        if (loader) return;
        setLoader(false);

        const res = await fetchApi("close-order", JSON.stringify({ a: 1 }), "GET");

        if (res.statusCode === 200) {
            setUsers(res.data);
            setTotalPage(res.data.length);
        }

        setLoader(false);
    };

    useEffect(() => {
        fetchUsers();
    }, [page, order, orderCol]);

    return {
        users,
        loader,
        page,
        totalPage,
        setPage,
        setOrder,
        setOrderCol,
        refetch: fetchUsers,
    };
};
