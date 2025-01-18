document.getElementById("drawFortuneBtn").addEventListener("click", function () {
    // Danh sách các quẻ
    const fortunes = [
        "Quẻ Thiên Địa Thái: Cát tường, mọi việc hanh thông.",
        "Quẻ Địa Sơn Khiêm: Khiêm tốn, thuận lợi về sau.",
        "Quẻ Sơn Thủy Mông: Khởi đầu khó khăn, cần kiên trì.",
        "Quẻ Phong Hỏa Gia Nhân: Gia đình hòa thuận, thịnh vượng.",
        "Quẻ Lôi Phong Hằng: Bền bỉ, thành công sẽ đến.",
        "Quẻ Thủy Hỏa Ký Tế: Việc lớn đã xong, tận hưởng thành quả.",
        "Quẻ Hỏa Thiên Đại Hữu: Thành công lớn, tài lộc dồi dào.",
        "Quẻ Địa Phong Thăng: Thăng tiến trong công danh, sự nghiệp.",
        "Quẻ Lôi Địa Dự: Niềm vui sắp tới, gặp nhiều may mắn.",
        "Quẻ Phong Trạch Trung Phu: Sống thật thà, uy tín được nâng cao."
    ];

    // Lấy một quẻ ngẫu nhiên từ danh sách
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];

    // Hiển thị quẻ và trạng thái
    const messageDiv = document.getElementById("fortuneMessage");
    const fortuneText = document.getElementById("fortuneText");
    const statusDiv = document.getElementById("fortuneStatus");

    fortuneText.textContent = randomFortune; // Hiển thị quẻ
    messageDiv.classList.remove("hidden"); // Hiện nội dung quẻ
    statusDiv.textContent = "Chúc mừng bạn 😘 !!";

    statusDiv.classList.remove("hidden");
    const drawFortuneBtn = document.getElementById("drawFortuneBtn");
    drawFortuneBtn.disabled = true; // Vô hiệu hóa nút
    drawFortuneBtn.style.backgroundColor = "gray"; // Thay đổi màu nút để hiển thị đã vô hiệu hóa
});