const wishes = {
    "bạn bè": {
        message: "Chúc bạn bè một năm mới tràn ngập niềm vui, sức khỏe dồi dào, và đạt được mọi mục tiêu trong cuộc sống!",
        image: "friend.png"
    },
    "đồng nghiệp": {
        message: "Chúc bạn một năm mới sự nghiệp thăng hoa, công việc thuận lợi, và thành công nối tiếp thành công!",
        image: "colleague.png"
    },
    "gia đình": {
        message: "Chúc gia đình bạn một năm tràn đầy yêu thương, đoàn viên, hạnh phúc và sức khỏe dồi dào!",
        image: "family.png"
    },
    "người yêu": {
        message: "Chúc bạn và người yêu một năm mới ngập tràn hạnh phúc, tình yêu thăng hoa, và luôn đồng hành cùng nhau!",
        image: "lover.png"
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