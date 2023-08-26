## Chạy local server và download dependencies

-   Ở phần của dự án có chứa file "app.py", chạy flask run để chạy bình thường trên local server hoặc "flask run --debug" để thấy cách hoạt động rõ ràng hơn của website trên local server.

-   Có thể cài các dependencies của Python bằng lệnh "pip install -r 'requirements.txt" và có thể cài dependency của Javascript bằng lệnh "npm init -y" để khởi tạo npm rồi chạy "npm install" để cài các dependency có trong file "package.json"

-   Có account với username: "admin", password: "admin123" để mọi người có thể login và trải nghiệm dịch vụ.

-   Website cũng sử dụng Nvidia Cuda để tải model lên trên GPU. Nếu mọi người không có GPU có thể đổi "device='cuda'" ở MODEL thành "device='cpu'", tuy nhiên việc làm vậy sẽ khiến model chạy chậm đi.

## Các route của web

-   Homepage ("/"): Chứa các thông tin cơ bản về người dùng, như username, số lượng ghi âm, số lượng tóm tắt.
-   Login ("/login"): Trang để người dùng có thể login.
-   Register ("/register"): Trang để người dùng đăng ký tài khoản mới.
-   Logout ("/logout"): Trang để người dùng đăng xuất.
-   Reset ("/reset"): Trang để đặt lại mật khẩu mới.
-   Apology("/apology"): Trang để báo các lỗi của server cho người dùng.
-   Record ("/record"): Trang dùng để ghi âm trực tiếp tại Website bằng Javascript. Sau khi thu âm và chọn môn học xong, website sẽ tự động điều hướng người dùng đến trang Summary.
-   Summary sẽ là trang để người dùng chọn tóm tắt, có thể được dẫn từ file Record hoặc đi trực tiếp từ navbar, mỗi mode sẽ có một view khác nhau.
-   Quiz ("/quiz"): Trang để người dùng có thể chọn các bài giảng mà bản thân muốn câu hỏi được dựa vào.
-   Display_quiz ("/display_quiz): Trang hiển thị các câu hỏi cho người dùng cũng như hiển thị đáp án chính xác cho người dùng. Trang này chỉ được dẫn tới sau khi người dùng chọn các văn bản để tạo quiz.
-   Correction ("/correction"): Trang để hiển thị đúng sai của người dùng.
-   Database sẽ sử dụng SQL, với 5 table là "user", "recording", "summary", "transcript":
    1. Table "user" sẽ ghi thông tin của người dùng.
    2. Table "recording" sẽ ghi lại vị trí lưu các ghi âm, tên môn học cũng như tên bài giảng.
    3. Table "summary" sẽ ghi lại vị trí lưu file tóm tắt.
    4. Table "transcript" sẽ ghi lại ví trí lưu file dịch từ ghi âm.
-   Database sử dụng thiết kế one-to-many.

## Các model được sử dụng

1. Open AI GPT 3.5 turbo 16k để tóm tắt các file phiên âm cũng như tô đậm các điểm nổi bật trong tóm tắt.
2. Model Faster_Whisper: https://github.com/guillaumekln/faster-whisper - để dịch ghi âm sang chữ

## API tạo câu hỏi

1. API URL: "https://api.opexams.com"
2. Để tạo câu hỏi, ta cần có API key mà nhóm đã cung cấp, tại thời điểm viết README (6/8/2023) thì API key sẽ còn 970 lần tạo câu hỏi.
3. Để tạo câu hỏi, ta cần truyền vào nội dung để lấy câu hỏi về. Nội dung đó được lấy từ các file tóm tắt của người dùng, do các file tóm tắt sẽ là file mà các ý hàm súc và cô đọng nhất. Ta cũng cần truyền vào loại câu hỏi, ngôn ngữ... Tất cả có thể được tìm thấy ở "https://opexams.com/questions-generator-api/"
