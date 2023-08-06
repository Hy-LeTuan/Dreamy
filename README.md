## Chạy local server và download dependencies

-   Ở phần của dự án có chứa file "app.py", chạy flask run để chạy bình thường trên local server hoặc "flask run --debug" để thấy cách hoạt động rõ ràng hơn của website trên local server.

-   Có thể cài các dependencies của Python bằng lệnh "pip install -r 'requirements.txt" và có thể cài dependency của Javascript bằng lệnh "npm install" để cài các dependency có trong file "package.json"

-   Có account với username: "admin", password: "admin123" để mọi người có thể tham khảo một số file ghi âm cũng như tóm tắt.

## Các route của web

-   Homepage ("/"): Chứa các thông tin cơ bản về người dùng, như username, số lượng ghi âm, số lượng tóm tắt.
-   Login ("/login"): Trang để người dùng có thể login.
-   Register ("/register"): Trang để người dùng đăng ký tài khoản mới.
-   Logout ("/logout"): Trang để người dùng đăng xuất.
-   Reset ("/reset"): Trang để đặt lại mật khẩu mới.
-   Apology("/apology"): Trang để báo các lỗi của server cho người dùng.
-   Record ("/record"): Trang dùng để ghi âm trực tiếp tại Website bằng Javascript. Sau khi thu âm và chọn môn học xong, website sẽ tự động điều hướng người dùng đến trang After_record
-   After_record ("/after_record"): Trang cho phép người dùng có thể coi lại phần đã dịch từ đoạn ghi âm, cũng như tóm tắt mà model Ai đã tạo ra. Người dùng sau đó có thể đặt tên cho bài giảng và có thể chỉnh sửa lại summary theo ý thích của mình. Trang này chỉ được dẫn tới sau khi người dùng vừa ghi âm xong.
    -Display ("/display"): Trang để người dùng có thể coi tất cả các bài giảng cũng như tất cả tóm tắt của bài giảng.
-   My_folder ("/my_folder"): Trang để người dùng có thể xem tất cả các tên của bài giảng được chia theo từng môn học khác nhau.
-   Quiz ("/quiz"): Trang để người dùng có thể chọn các bài giảng mà bản thân muốn câu hỏi được dựa vào.
-   Display_quiz ("/display_quiz): Trang hiển thị các câu hỏi cho người dùng cũng như hiển thị đáp án chính xác cho người dùng. Trang này chỉ được dẫn tới sau khi người dùng chọn các văn bản để tạo quiz.
-   Database sẽ sử dụng SQL, với 4 table là "user", "recording", "summary", "transcript":
    1. Table "user" sẽ ghi thông tin của người dùng.
    2. Table "recording" sẽ ghi lại vị trí lưu các ghi âm, tên môn học cũng như tên bài giảng.
    3. Table "summary" sẽ ghi lại vị trí lưu file tóm tắt.
    4. Table "transcript" sẽ ghi lại ví trí lưu file dịch từ ghi âm.
-   Database sử dụng thiết kế one-to-many.

## Các model được sử dụng

1. Model của VietAI: https://huggingface.co/VietAI/vit5-base-vietnews-summarization - để tóm tắt các phần ghi âm của người dùng
2. Model Faster_Whisper: https://github.com/guillaumekln/faster-whisper - để dịch ghi âm sang chữ

## API tạo câu hỏi

1. API URL: "https://api.opexams.com"
2. Để tạo câu hỏi, ta cần có API key mà nhóm đã cung cấp, tại thời điểm viết README (6/8/2023) thì API key sẽ còn 970 lần tạo câu hỏi.
3. Để tạo câu hỏi, ta cần truyền vào nội dung để lấy câu hỏi về. Nội dung đó được lấy từ các file tóm tắt của người dùng, do các file tóm tắt sẽ là file mà các ý hàm súc và cô đọng nhất.
