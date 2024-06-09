$(document).ready(function() {
    function getToken() {
        return localStorage.getItem('token');
    }

    function fetchDetailProducts() {
        var token = getToken();

        if (!token) {
            console.error('Token not found in localStorage');
            return;
        }

        $.ajax({
            url: 'http://127.0.0.1:8000/api/detail_products',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function(response) {
                console.log('API response:', response);

                if (response.success) {
                    var detailProducts = response.data;
                    var productCards = '';

                    if (detailProducts.length === 0) {
                        console.warn('No detail products found in the response');
                        $('#productList').html('<p>No products available.</p>');
                        return;
                    }

                    detailProducts.forEach(function(detailProduct) {
                        var product = detailProduct.product;
                        var category = detailProduct.category;
                        var ukuran = detailProduct.ukuran;

                        console.log('Product:', product);
                        console.log('Category:', category);
                        console.log('Ukuran:', ukuran);

                        productCards += `
                            <div class="col-md-4">
                                <div class="product-card">
                                    <img src="${product.image_url}" alt="${product.nama_product}">
                                    <div class="product-info">
                                        <div>
                                            <div class="product-title">${product.nama_product}</div>
                                            <div class="product-description">${product.description}</div>
                                            <div class="product-category">Category: ${category.nama_category}</div>
                                            <div class="product-size">Size: ${ukuran.ukuran}</div>
                                        </div>
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div class="product-price">Price: ${product.price}</div>
                                            <div class="product-stock">Stock: ${product.stock}</div>
                                            <div class="product-quantity">
                                                <button class="btn btn-sm btn-outline-secondary decrease-quantity" data-id="${product.id_product}">-</button>
                                                <span class="mx-2">0</span>
                                                <button class="btn btn-sm btn-outline-secondary increase-quantity" data-id="${product.id_product}">+</button>
                                            </div>
                                            <div class="product-cart" data-id="${product.id_product}">
                                                <i data-feather="shopping-cart"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    });

                    $('#productList').html(productCards);
                    console.log('Generated HTML:', productCards);
                    feather.replace();
                } else {
                    alert('Failed to fetch detail products: ' + response.message);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('Error: ' + errorThrown);
                console.log('jqXHR:', jqXHR);
                console.log('textStatus:', textStatus);
                console.log('errorThrown:', errorThrown);
            }
        });
    }

    fetchDetailProducts();
});
