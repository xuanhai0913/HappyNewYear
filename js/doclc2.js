const wishes = {
    "bà nội": {
        message: "Chúc Bà Ngoại luôn mạnh khỏe, an toàn trên mọi hành trình, và sống lâu vui vầy bên con cháu!",
        image: "../img/img_ngoai/bangoai.jpeg"
    },
    "cậu 5": {
        message: "Chúc Cậu,Mợ năm làm ăn phát đạt, công việc thuận buồm xuôi gió, và sức khỏe dồi dào để vươn xa hơn nữa!",
        image: "../img/img_noi/cau_5.png"
    },
    "gì 3": {
        message: "Chúc Dượng ba, dì ba luôn khỏe mạnh, công việc ở phường thuận lợi, và tràn đầy niềm vui trong năm mới!",
        image: "../img/img_noi/gi_3.png"
    },
    "gì 6": {
        message: "Chúc Dượng sáu, dì sáu bán bánh mì ngày càng đông khách, sức khỏe tốt, và một năm mới tài lộc dồi dào hơn!",
        image: "../img/img_noi/gi_6.png"
    }
};

document.getElementById("wishBtn").addEventListener("click", () => {
    const role = document.getElementById("role").value;
    const wish = wishes[role];

    if (wish) {
        const popup = document.getElementById("popup");
        const overlay = document.getElementById("overlay");
        const popupMessage = document.getElementById("popup-message");
        const roleImage = document.getElementById("role-image");

        popupMessage.textContent = wish.message;
        roleImage.src = wish.image;
        popup.classList.remove("hidden");
        overlay.classList.remove("hidden");

        // Phát âm thanh lời chúc
        const speech = new SpeechSynthesisUtterance(wish.message);
        speech.lang = "vi-VN";
        speech.rate = 1.1;
        window.speechSynthesis.speak(speech);
    }
});

document.getElementById("closePopup").addEventListener("click", () => {
    document.getElementById("popup").classList.add("hidden");
    document.getElementById("overlay").classList.add("hidden");
});