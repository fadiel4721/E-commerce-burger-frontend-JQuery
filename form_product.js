$(document).ready(function() {
    // Fungsi untuk mendapatkan token dari localStorage
    function getToken() {
        return localStorage.getItem('token');
    }

    $('#addProductForm').on('submit', function(event) {
        event.preventDefault();

        var formData = new FormData();
        formData.append('nama_product', $('#productName').val());
        formData.append('description', $('#productDescription').val());
        formData.append('stock', $('#productStock').val());
        formData.append('price', $('#productPrice').val());
        formData.append('image', $('#productImage')[0].files[0]);
        formData.append('id_category', $('#productCategory').val());
        formData.append('id_ukuran', $('#productSize').val());

        // Mendapatkan token sebelum mengirimkan permintaan
        var token = getToken();

        $.ajax({
            url: 'http://127.0.0.1:8000/api/admin/products', // Ganti dengan URL API Anda
            method: 'POST',
            processData: false,
            contentType: false,
            data: formData,
            headers: {
                'Authorization': 'Bearer ' + token  // Menggunakan token dalam header Authorization
            },
            success: function(response) {
                $('#dataResult').text(response.message);
                if (response.success) {
                    alert('Product Added successfully!');
                    // Redirect or perform necessary actions after successful update
                    window.location.href = 'admin_homepage.html'; // Example: Redirect to product list page
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('AJAX Error:', errorThrown);
                $('#dataResult').text('Error: ' + errorThrown);
            }
        });
    });
});