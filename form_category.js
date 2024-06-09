$(document).ready(function () {
  // Fungsi untuk mendapatkan token dari localStorage
  function getToken() {
    return localStorage.getItem("token");
  }

  $("#addCategoryForm").on("submit", function (event) {
    event.preventDefault();

    var categoryNama = $("#categoryName").val(); // Mengambil nilai nama kategori

    // Mendapatkan token sebelum mengirimkan permintaan
    var token = getToken();

    // Data kategori yang akan dikirim dalam format JSON
    var categoryData = {
      nama_category: categoryNama,
    };

    $.ajax({
      url: "http://127.0.0.1:8000/api/admin/categories", // Ganti dengan URL API Anda
      method: "POST",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token, // Menggunakan token dalam header Authorization
      },
      data: JSON.stringify(categoryData),
      success: function (response) {
        $("#dataResult").text(response.message);
        if (response.success) {
          alert("Category Added successfully!");
          // Redirect or perform necessary actions after successful update
          window.location.href = "admin_homepage.html"; // Contoh: Redirect ke halaman daftar kategori
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("AJAX Error:", errorThrown);
        $("#dataResult").text("Error: " + errorThrown);
      },
    });
  });
});
