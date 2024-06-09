$(document).ready(function() {
    var loginUrl = 'http://127.0.0.1:8000/api/login';
    var dataUrl = 'http://127.0.0.1:8000/api/admin/products';
    var imageUrl = 'http://127.0.0.1:8000/storage/';
    
    // Fungsi untuk login
    $('#login').click(function() {
        const email = $('#email').val();
        const password = $('#password').val();
        
        $.ajax({
            url: loginUrl,
            type: 'POST',
            data: {
                email: email,
                password: password
            },
            success: function(response) {
                $('#loginResult').text(JSON.stringify(response, null, 2));
            },
            error: function(error) {
                $('#loginResult').text(JSON.stringify(error, null, 2));
            }
        });
    });

    // Fungsi untuk mengambil data
    $('#fetchData').click(function() {
        $.ajax({
            url: dataUrl,
            type: 'GET',
            success: function(response) {
                if (response.success) {
                    $('#dataResult').empty(); // Kosongkan div sebelum mengisinya dengan data baru
                    
                    response.data.checkout.forEach(function(checkout) {
                        const card = `
                            <div class="col-md-4">
                                <div class="product-card">
                                    <div class="product-info">
                                        <div class="product-title">Checkout ID: ${checkout.id}</div>
                                        <div class="product-price">Total Pembayaran: ${checkout.total_pembayaran}</div>
                                        <div class="product-title">Metode Bayar: ${checkout.metode_bayar}</div>
                                        <div class="product-title">Metode Kirim: ${checkout.metode_kirim}</div>
                                        <div class="product-title">Alamat: ${checkout.alamat}</div>
                                    </div>
                                    <div class="product-info">
                                        <h5>Keranjang:</h5>
                                        ${checkout.carts.map(cart => `
                                            <div>
                                                <img src="${imageUrl + cart.product.image}" alt="${cart.product.name}">
                                                <div class="product-title">${cart.product.name}</div>
                                                <div class="product-price">${cart.product.price}</div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        `;
                        $('#dataResult').append(card);
                    });
                }
            },
            error: function(error) {
                console.log(error);
            }
        });
    });

    // Fungsi untuk membuat data baru
    $('#createData').click(function() {
        const metode_kirim = $('#metode_kirim').val();
        const metode_bayar = $('#metode_bayar').val();
        const biaya_kirim = $('#biaya_kirim').val();
        const total_pembayaran = $('#total_pembayaran').val();
        const alamat = $('#alamat').val();
        
        $.ajax({
            url: dataUrl,
            type: 'POST',
            data: {
                metode_kirim: metode_kirim,
                metode_bayar: metode_bayar,
                biaya_kirim: biaya_kirim,
                total_pembayaran: total_pembayaran,
                alamat: alamat
            },
            success: function(response) {
                $('#createResult').text(JSON.stringify(response, null, 2));
                $('#fetchData').click(); // Refresh data setelah create
            },
            error: function(error) {
                $('#createResult').text(JSON.stringify(error, null, 2));
            }
        });
    });

    // Fungsi untuk memperbarui data
    $('#updateData').click(function() {
        const id = $('#update_id').val();
        const metode_kirim = $('#update_metode_kirim').val();
        const metode_bayar = $('#update_metode_bayar').val();
        const biaya_kirim = $('#update_biaya_kirim').val();
        const total_pembayaran = $('#update_total_pembayaran').val();
        const alamat = $('#update_alamat').val();
        
        $.ajax({
            url: `${dataUrl}/${id}`,
            type: 'PUT',
            data: {
                metode_kirim: metode_kirim,
                metode_bayar: metode_bayar,
                biaya_kirim: biaya_kirim,
                total_pembayaran: total_pembayaran,
                alamat: alamat
            },
            success: function(response) {
                $('#updateResult').text(JSON.stringify(response, null, 2));
                $('#fetchData').click(); // Refresh data setelah update
            },
            error: function(error) {
                $('#updateResult').text(JSON.stringify(error, null, 2));
            }
        });
    });

    // Fungsi untuk menghapus data
    $('#deleteData').click(function() {
        const id = $('#delete_id').val();
        
        $.ajax({
            url: `${dataUrl}/${id}`,
            type: 'DELETE',
            success: function(response) {
                $('#deleteResult').text(JSON.stringify(response, null, 2));
                $('#fetchData').click(); // Refresh data setelah delete
            },
            error: function(error) {
                $('#deleteResult').text(JSON.stringify(error, null, 2));
            }
        });
    });
});
