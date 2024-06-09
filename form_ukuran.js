$(document).ready(function () {
    // Fungsi untuk mendapatkan token dari localStorage
    function getToken() {
      return localStorage.getItem("token");
    }
  
    $("#addUkuranForm").on("submit", function (event) {
      event.preventDefault();
  
      var ukuranNama = $("#ukuranName").val(); // Mengambil nilai nama kategori
  
      // Mendapatkan token sebelum mengirimkan permintaan
      var token = getToken();
  
      // Data kategori yang akan dikirim dalam format JSON
      var ukuranData = {
        ukuran: ukuranNama,
      };
  
      $.ajax({
        url: "http://127.0.0.1:8000/api/admin/ukuran", // Ganti dengan URL API Anda
        method: "POST",
        contentType: "application/json",
        headers: {
          Authorization: "Bearer " + token, // Menggunakan token dalam header Authorization
        },
        data: JSON.stringify(ukuranData),
        success: function (response) {
          $("#dataResult").text(response.message);
          if (response.success) {
            alert("Ukuran Added successfully!");
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
  