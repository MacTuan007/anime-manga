import Header from "../partials/Header";
import HeaderMenu from "../partials/HeaderMenu";
import TruyenMoi from "../component/TruyenMoi";
import useTheLoaiList from "../utils/theloaiList";
import Footer from "../partials/Footer";

export default function Index() {
    const theLoaiList = useTheLoaiList();
    return (
        <>
            <Header />
            <HeaderMenu theLoaiList={theLoaiList} />
            <TruyenMoi />
            <Footer />
        </>
    );
}