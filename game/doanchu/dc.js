// Câu hỏi và đáp án
const questions = [
    { hint: "Gợi ý: Chúc mừng năm mới", answer: "Chúc mừng năm mới" },
    { hint: "Gợi ý: Một loài hoa đặc trưng trong dịp Tết", answer: "Mai vàng" },
    { hint: "Gợi ý: Một món quà Tết", answer: "Lì xì" },
    { hint: "Gợi ý: Một loại bánh truyền thống", answer: "Bánh chưng" },
    { hint: "Gợi ý: Một lời chúc dành cho người lớn tuổi", answer: "An khang thịnh vượng" }
];

let currentQuestionIndex = 0; // Biến theo dõi câu hỏi hiện tại

// Hàm hiển thị câu hỏi
function showQuestion() {
    const hintElement = document.getElementById("hint");
    const resultElement = document.getElementById("result");
    const inputElement = document.getElementById("answer");

    hintElement.textContent = `Gợi ý: ${questions[currentQuestionIndex].hint}`;
    inputElement.value = ""; // Xóa ô nhập mỗi lần hiển thị câu hỏi mới
    resultElement.classList.add("hidden"); // Ẩn kết quả trước khi trả lời câu hỏi
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
    } else {
        resultMessageElement.textContent = `Rất tiếc, đáp án đúng là: ${correctAnswer}`;
    }
    
    resultElement.classList.remove("hidden");
}

// Hàm chuyển sang câu hỏi tiếp theo
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex >= questions.length) {
        currentQuestionIndex = 0; // Quay lại câu hỏi đầu tiên nếu đã hết câu hỏi
    }
    showQuestion();
}

// Bắt đầu trò chơi với câu hỏi đầu tiên
showQuestion();