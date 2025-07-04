function toggleSidebar() {
    const sidebar = document.getElementById("mobileSidebar");
    sidebar.classList.add("open");
  }

  document.addEventListener("DOMContentLoaded", function () {
    const closeBtn = document.getElementById("closeSidebar");
    closeBtn.addEventListener("click", function () {
      document.getElementById("mobileSidebar").classList.remove("open");
    });
  });