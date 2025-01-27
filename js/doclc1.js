const wishes = {
    "ông bà nội": {
        message: "Chúc ông bà nội một năm mới tràn đầy sức khỏe, sống lâu trăm tuổi, và luôn hạnh phúc bên con cháu!",
        image: "../img/img_noi/ong.png"
    },
    "bác hai": {
        message: "Chúc Bác Hai năm mới phát tài, vạn sự như ý, và luôn vui vẻ bên gia đình!",
        image: "../img/img_noi/bac2.png"
    },
    "cô ba": {
        message: "Chúc Cô Ba năm mới an khang thịnh vượng, gặp nhiều may mắn và luôn xinh đẹp rạng ngời!",
        image: "../img/img_noi/co_ba.png"
    },
    "cô năm": {
        message: "Chúc Cô Năm năm mới sung túc, dồi dào sức khỏe, và luôn hạnh phúc bên gia đình!",
        image: "../img/img_noi/co5.png"
    },
    "hai chị": {
        message: "Chúc hai chị năm mới thành công rực rỡ, sức khỏe dồi dào, và luôn đạt được mọi ước mơ!",
        image: "../img/img_noi/hai_chi.png"
    },
    "ba mẹ": {
        message: "Chúc Ba Mẹ năm mới bình an, sức khỏe dồi dào, và mãi là chỗ dựa vững chắc cho con cháu!",
        image: "../img/img_noi/ba_me.png"
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