var design = anime({
    targets: '#newyear2020 #happy',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 2000,
    delay: function(el, i) { return i * 250 },
    direction: 'alternate',
    loop: true
  });
  
  var design = anime({
    targets: '#newyear2020 #NEWYEAR',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 2500,
    delay: function(el, i) { return i * 250 },
    direction: 'alternate',
    loop: true
  });
  
  
  
  var design = anime({
    targets: '#newyear2020 #Vector_43,#Vector_210,#Vector_207,#Vector_42,#Vector_45',
    translateY: -10,
    easing: 'easeInOutSine',
    duration: 2500,
    delay: function(el, i) { return i * 250 },
    direction: 'alternate',
    loop: true
  });
// Hàm để mở tab và hiển thị nội dung của tab đã chọn
function openTab(evt, tabName) {
  var i, tabcontent, tablinks;

  // Ẩn tất cả các tab trước khi mở tab mới
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Bỏ lớp 'active' cho tất cả các tab
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Hiển thị nội dung của tab đã chọn
  document.getElementById(tabName).style.display = "block";

  // Thêm lớp 'active' cho tab đã chọn
  evt.currentTarget.className += " active";
  document.getElementById(tabName).scrollIntoView({ behavior: 'smooth' });

}

// Mở tab mặc định là BIDV khi trang tải
document.addEventListener("DOMContentLoaded", function () {
  document.getElementsByClassName("tablinks")[0].click();
});
  