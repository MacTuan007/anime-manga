import Header from "../partials/Header";
import HeaderMenu from "../partials/HeaderMenu";
import { useEffect, useState } from "react";
import { getDatabase, onValue, ref } from "firebase/database";
import type { Tag } from "../interfaces/Tag";
import TruyenMoi from "../component/TruyenMoi";

export default function Index() {
    const [theLoaiList, setTheLoaiList] = useState<Tag[]>([]);
    useEffect(() => {
        const db = getDatabase();
        const theLoaiRef = ref(db, "tags");

        const unsubscribe = onValue(theLoaiRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list: Tag[] = Object.values(data);
                setTheLoaiList(list);
            }
        });

        return () => unsubscribe();
    }, []);
    return (
        <>
            <Header />
            <HeaderMenu theLoaiList={theLoaiList} />
            <TruyenMoi />
        </>
    );
}