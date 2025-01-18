// Câu hỏi và đáp án (30 câu hỏi)
const allQuestions = [
    { hint: "Câu chúc đặc trưng", answer: "Chúc mừng năm mới" },
    { hint: "Một loài hoa đặc trưng trong dịp Tết", answer: "Mai vàng" },
    { hint: "Một món quà Tết", answer: "Lì xì" },
    { hint: "Một loại bánh truyền thống", answer: "Bánh chưng" },
    { hint: "Một lời chúc dành cho người lớn tuổi", answer: "An khang thịnh vượng" },
    { hint: "Tên một loại quả bày trên mâm ngũ quả", answer: "Mãng cầu" },
    { hint: "Một hoạt động truyền thống vào ngày đầu năm mới", answer: "Chúc Tết" },
    { hint: "Một trò chơi dân gian thường thấy dịp Tết", answer: "Đánh đu" },
    { hint: "Một món ăn Tết làm từ thịt lợn và trứng", answer: "Thịt kho tàu" },
    { hint: "Loại cây thường trưng trong nhà ngày Tết", answer: "Cây đào" },
    { hint: "Tên một phong tục vào ngày Tết", answer: "Xông đất" },
    { hint: "Một câu chúc cho trẻ em", answer: "Học giỏi" },
    { hint: "Tên một loại kẹo thường xuất hiện trong ngày Tết", answer: "Kẹo mứt" },
    { hint: "Một trò chơi thường thấy vào ngày Tết", answer: "Bầu cua" },
    { hint: "Một lễ hội truyền thống dịp đầu năm", answer: "Lễ hội đua thuyền" },
    { hint: "Tên một món ăn làm từ gạo nếp", answer: "Bánh dày" },
    { hint: "Loại trái cây tượng trưng cho tài lộc", answer: "Quả quýt" },
    { hint: "Tên một món canh ngày Tết miền Bắc", answer: "Canh măng" },
    { hint: "Một hoạt động tâm linh đầu năm mới", answer: "Đi chùa" },
    { hint: "Tên một câu tục ngữ nói về năm mới", answer: "Đầu năm mua muối, cuối năm mua vôi" },
    { hint: "Một phong tục giúp mang lại may mắn", answer: "Lì xì" },
    { hint: "Một loại bánh truyền thống miền Trung", answer: "Bánh tét" },
    { hint: "Tên một loại hoa thường thấy vào ngày Tết", answer: "Hoa cúc" },
    { hint: "Một câu chúc dành cho doanh nghiệp", answer: "Phát tài phát lộc" },
    { hint: "Một lễ hội truyền thống trong dịp Tết", answer: "Lễ hội chọi trâu" },
    { hint: "Một loại nước uống thường thấy trên bàn tiệc Tết", answer: "Rượu vang" },
    { hint: "Tên một loại quả nhỏ, tròn", answer: "Quả sung" },
    { hint: "Một câu chúc dành cho bạn bè", answer: "Sức khỏe dồi dào" },
    { hint: "Tên một hoạt động thường làm vào đêm giao thừa", answer: "Cúng giao thừa" }
];

// Chọn 5 câu hỏi ngẫu nhiên từ bộ 30 câu hỏi
let questions = [];
function selectRandomQuestions() {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    questions = shuffled.slice(0, 5);
}
selectRandomQuestions();

let currentQuestionIndex = 0; // Biến theo dõi câu hỏi hiện tại
let correctAnswers = 0; // Biến theo dõi số câu trả lời đúng

// Hàm hiển thị câu hỏi
function showQuestion() {
    const hintElement = document.getElementById("hint");
    const resultElement = document.getElementById("result");
    const inputElement = document.getElementById("answer");
    const hintButton = document.getElementById("hint-btn");

    const currentQuestion = questions[currentQuestionIndex];
    const wordCount = currentQuestion.answer.split(" ").length; // Đếm số từ trong đáp án

    // Cập nhật gợi ý
    hintElement.textContent = `Gợi ý: ${currentQuestion.hint} (${wordCount} từ)`;

    inputElement.value = ""; // Xóa ô nhập mỗi lần hiển thị câu hỏi mới
    resultElement.classList.add("hidden"); // Ẩn kết quả trước khi trả lời câu hỏi

    // Reset trạng thái nút gợi ý
    freeHintAvailable = true;
    hintButton.disabled = false;
}

// Hàm kiểm tra câu trả lời
function checkAnswer() {
    const answerElement = document.getElementById("answer");
    const resultElement = document.getElementById("result");
    const resultMessageElement = document.getElementById("result-message");

    const userAnswer = answerElement.value.trim();
    const correctAnswer = questions[currentQuestionIndex].answer;

    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        resultMessageElement.textContent = "Chúc mừng bạn, bạn đã trả lời đúng!";
        correctAnswers++;
    } else {
        resultMessageElement.textContent = `Rất tiếc, đáp án đúng là: ${correctAnswer}`;
    }

    resultElement.classList.remove("hidden");
    document.getElementById("next-btn").disabled = false; // Bật nút Tiếp theo
}

// Hàm chuyển sang câu hỏi tiếp theo
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex >= questions.length) {
        // Kết thúc trò chơi
        endGame();
    } else {
        showQuestion();
        document.getElementById("next-btn").disabled = true; // Tắt nút Tiếp theo
    }
}

// Hàm kết thúc trò chơi
function endGame() {
    const hintElement = document.getElementById("hint");
    const gameContainer = document.getElementById("game-container");
    const message = correctAnswers >= 3
        ? "Chúc mừng! Bạn đã chiến thắng trò chơi! +1 lượt lì xì"
        : "Rất tiếc! Bạn đã không đủ điểm để nhận lì xì.";

    hintElement.textContent = message;
    if (correctAnswers >= 3) {
        // Thêm nút chuyển hướng đến trang nhận lì xì
        const luckyMoneyButton = document.createElement("button");
        luckyMoneyButton.textContent = "Nhận Lì Xì";
        luckyMoneyButton.onclick = function () {
            window.location.href = "game/xephinh/xh.html"; // Đường dẫn đến trang nhận lì xì
        };
        gameContainer.appendChild(luckyMoneyButton);
    } else {
        gameContainer.innerHTML = ""; // Xóa nội dung câu hỏi nếu không thắng
    }
}

// Bắt đầu trò chơi với câu hỏi đầu tiên
showQuestion();