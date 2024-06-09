$(document).ready(function() {
    // Function to retrieve token from localStorage
    function getToken() {
        return localStorage.getItem('token');
    }

    // URL for API endpoints
    var updateProductUrl = 'http://127.0.0.1:8000/api/admin/products'; // Adjust URL as per your API endpoint
    var categoryUrl = 'http://127.0.0.1:8000/api/admin/categories';
    var sizeUrl = 'http://127.0.0.1:8000/api/admin/ukuran';

    // Function to handle API request errors
    function handleError(jqXHR, textStatus, errorThrown) {
        console.error('Error: ' + textStatus, errorThrown);
        $('#dataResult').text('Error: ' + textStatus + ' ' + errorThrown);
    }

    // Function to fetch and populate product data for editing
    function fetchAndPopulateProductData(productId, token) {
        $.ajax({
            url: updateProductUrl + '/' + productId,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    var product = response.data; // Product data

                    // Populate edit form fields with product data
                    $('#productName').val(product.nama_product);
                    $('#productDescription').val(product.description);
                    $('#productStock').val(product.stock);
                    $('#productPrice').val(product.price);
                    $('#currentImage').attr('src', product.image_url); // Display current image of the product
                    $('#productCategory').val(product.id_category); // Set category ID input value
                    $('#productSize').val(product.id_ukuran); // Set size ID input value

                } else {
                    $('#dataResult').text('Failed to fetch product data.');
                }
            },
            error: handleError
        });
    }

    // Fetch categories and ukuran data from API
    var categories = []; // Array to store categories data
    var ukuran = []; // Array to store ukuran data

    // Fetch and populate categories and ukuran data
    $.when(
        $.ajax({
            url: categoryUrl,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + getToken()
            },
            dataType: 'json',
            success: function(data) {
                if (data.success) {
                    categories = data.data.categories;
                } else {
                    $('#dataResult').text('Failed to fetch categories.');
                }
            },
            error: handleError
        }),
        $.ajax({
            url: sizeUrl,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + getToken()
            },
            dataType: 'json',
            success: function(data) {
                if (data.success) {
                    ukuran = data.data.ukuran;
                } else {
                    $('#dataResult').text('Failed to fetch ukuran.');
                }
            },
            error: handleError
        })
    ).then(function() {
        // Both requests are completed, populate input values after fetching categories and ukuran
        populateInputValues();
    });

    // Function to populate input values
    function populateInputValues() {
        // Fetch product ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        // Check if productId is valid
        if (!productId) {
            $('#dataResult').text('Product ID is missing');
            return;
        }

        var token = getToken();
        if (!token) {
            $('#dataResult').text('You must login first!');
            return;
        }

        // Fetch and populate product data for editing
        fetchAndPopulateProductData(productId, token);
    }

    // Function to handle form submission for updating product
    $('#updateProductForm').submit(function(event) {
        event.preventDefault();

        var token = getToken();
        if (!token) {
            $('#dataResult').text('You must login first!');
            return;
        }

        var updatedProductName = $('#productName').val();
        var updatedProductDescription = $('#productDescription').val();
        var updatedProductStock = $('#productStock').val();
        var updatedProductPrice = $('#productPrice').val();
        var updatedProductImage = $('#productImage')[0].files[0]; // File object for image upload
        var updatedProductCategory = $('#productCategory').val();
        var updatedProductSize = $('#productSize').val();

        // Fetch product ID from URL again (in case the URL changes dynamically)
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        var formData = new FormData();
        formData.append('nama_product', updatedProductName);
        formData.append('description', updatedProductDescription);
        formData.append('stock', updatedProductStock);
        formData.append('price', updatedProductPrice);
        formData.append('image', updatedProductImage); // Append file object
        formData.append('id_category', updatedProductCategory);
        formData.append('id_ukuran', updatedProductSize);

        $.ajax({
            url: updateProductUrl + '/' + productId,
            type: 'POST', // Change to PUT if your API uses PUT for updates
            headers: {
                'Authorization': 'Bearer ' + token,
            },
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    alert('Product updated successfully!');
                    // Redirect or perform necessary actions after successful update
                    window.location.href = 'admin_homepage.html'; // Example: Redirect to product list page
                } else {
                    $('#dataResult').text('Failed to update product: ' + response.message);
                }
            },
            error: handleError
        });
    });

});
