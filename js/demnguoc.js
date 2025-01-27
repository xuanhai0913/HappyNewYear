 // Đếm ngược
 const countdownElement = document.getElementById('countdown');
 const newYearDate = new Date("2025-01-29T00:00:00").getTime();

 const interval = setInterval(function() {
   const now = new Date().getTime();
   const timeLeft = newYearDate - now;

   const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
   const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
   const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
   const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

   countdownElement.innerHTML = `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;

   if (timeLeft < 0) {
     clearInterval(interval);
     countdownElement.innerHTML = "Chúc mừng năm mới Ất Tỵ 2025!";
   }
 }, 1000);