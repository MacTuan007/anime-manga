// src/component/TheLoaiDropdown.tsx
import { useNavigate } from "react-router-dom";
import type { Tags } from "../interfaces/Tag";

interface Props {
  theLoaiList: Tags[];
}

export default function TheLoaiDropdown({ theLoaiList }: Props) {
  const navigate = useNavigate();

  return (
    <div className="dropdown-menu">
      {theLoaiList.map((item) => (
        <div
          key={item.tenlink}
          className="dropdown-item"
          onClick={() => navigate(`/the-loai/${item.tenlink}`)}
        >
          {item.ten}
        </div>
      ))}
    </div>
  );
}
