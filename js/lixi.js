document.getElementById("ageForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Ngăn form tải lại trang
    const ageGroup = document.getElementById("age").value;
    const messageDiv = document.getElementById("message");
    let message = "";

    // Lời chúc tùy theo độ tuổi
    switch (ageGroup) {
        case "kid":
            message = "Chúc con năm mới học giỏi, ngoan ngoãn và luôn vui vẻ nhé!";
            break;
        case "teen":
            message = "Chúc bạn một năm mới nhiều thành công, luôn tràn đầy năng lượng!";
            break;
        case "adult":
            message = "Chúc bạn năm mới sức khỏe dồi dào, sự nghiệp thăng tiến!";
            break;
        case "senior":
            message = "Chúc bác/cụ năm mới an khang, thịnh vượng và sống lâu trăm tuổi!";
            break;
        default:
            message = "Chúc mừng năm mới! Hãy luôn vui vẻ và hạnh phúc!";
    }

    // Hiển thị lời chúc
    messageDiv.textContent = message;
    messageDiv.classList.remove("hidden");
});