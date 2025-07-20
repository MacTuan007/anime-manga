import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import type { Tag } from "../interfaces/Tag"; // Đảm bảo bạn có Tag { ten: string; tenlink: string; }

export default function useTheLoaiList() {
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

  return theLoaiList;
}
