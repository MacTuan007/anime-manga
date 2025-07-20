export interface Truyen {
  id: string;
  ten: string;
  tacgia?: string;
  thumbnail: string;
  chuongMoiNhat: string;
  ngayDangChuong: number;
}

export interface TruyenDetail extends Truyen {
  tinhtrang: number;
  trangthai: number;
  noidung: string;
  luotfl: number;
  luotxem: number;
  luotthich: number;
  listtag: Record<string, string>; // idtag: tenlink
  chuong: Record<string, Record<string, string> & { 'ngay-dang'?: number }>;
}