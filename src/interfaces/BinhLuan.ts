export interface BinhLuan {
  idbinhluan: string; // ID bình luận
  idchuong?: string;     // Có thể không có nếu bình luận ở chi tiết truyện
  idtruyen: string;      // ID truyện
  iduser: string;        // ID người dùng (emailkey)
  ho: string; 
  ten: string;      // Tên người dùng
  noidung: string;       // Nội dung bình luận
  ngaybinhluan: number; // Ngày bình luận (số nguyên, định dạng YYYYMMDDHHMMSS)
}
