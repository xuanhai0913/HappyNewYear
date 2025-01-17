document.getElementById("drawFortuneBtn").addEventListener("click", function() {
    // Danh sách các lời chúc may mắn
    const fortunes = [
        "Năm mới an khang, thịnh vượng, sức khỏe dồi dào!",
        "Chúc bạn luôn gặp may mắn và thành công trong mọi việc!",
        "Đầu năm may mắn, cuối năm rực rỡ!",
        "Mừng tuổi mới, vạn sự như ý, mọi điều thuận lợi!",
        "Cả năm hạnh phúc, bình an, làm gì cũng thành công!"
    ];

    // Lấy một lời chúc ngẫu nhiên từ danh sách
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];

    // Hiển thị lời chúc
    const messageDiv = document.getElementById("fortuneMessage");
    const fortuneText = document.getElementById("fortuneText");

    fortuneText.textContent = randomFortune;
    messageDiv.classList.remove("hidden");
});