$(document).ready(function() {
    $('#checkoutForm').submit(function(event) {
        event.preventDefault();
        
        var token = localStorage.getItem('token'); // Ambil token dari local storage
        if (!token) {
            alert('Please login to proceed with checkout.');
            return;
        }

        var checkoutData = {
            id_customer: $('#id_customer').val(),
            metode_bayar: $('#metode_bayar').val(),
            metode_kirim: $('#metode_kirim').val(),
            alamat: $('#alamat').val(),
            id_keranjang: $('#id_keranjang').val().split(',')
        };

        $.ajax({
            url: 'http://127.0.0.1:8000/api/checkout',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(checkoutData),
            success: function(response) {
                if (response.success) {
                    $('#checkoutResult').text('Checkout successful. Order ID: ' + response.data.id_checkout);
                } else {
                    $('#checkoutResult').text('Failed to checkout: ' + response.message);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#checkoutResult').text('Error: ' + textStatus + ' ' + errorThrown);
                console.log('jqXHR:', jqXHR);
                console.log('textStatus:', textStatus);
                console.log('errorThrown:', errorThrown);
                console.log('Response Text:', jqXHR.responseText); // Log the response text for debugging
            }
        });
    });
});
