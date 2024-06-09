$(document).ready(function() {
    // Function to retrieve token from localStorage
    function getToken() {
        return localStorage.getItem('token');
    }

    // URLs for API endpoints
    var ukuranUrl = 'http://127.0.0.1:8000/api/admin/ukuran'; // Endpoint kategori

    // Function to handle API request errors
    function handleError(jqXHR, textStatus, errorThrown) {
        console.error('Error: ' + textStatus, errorThrown);
        $('#dataResult').text('Error: ' + textStatus + ' ' + errorThrown);
    }

    // Function to create product cards
    function createProductCards(products) {
        var cards = $('<div class="card-deck"></div>');
        products.forEach(function(product) {
            var card = $('<div class="col-md-4 mb-4"></div>');
            var cardContent = $('<div class="product-card"></div>');
            var productName = '<div class="product-title">' + product.nama_product + '</div>';
            var productPrice = '<div class="product-price">Rp' + product.price + '</div>';
            var productImage = '<img src="' + product.image_url + '" alt="' + product.nama_product + '">';

            cardContent.append(productImage);
            cardContent.append('<div class="product-info">' + productName + productPrice + '</div>');
            card.append(cardContent);
            cards.append(card);
        });

        return cards;
    }

    // Function to create ukuran cards with product images
    function createUkuranCards(ukuran) {
        var container = $('<div></div>');
        ukuran.forEach(function(ukuran) {
            var ukuranSection = $('<div class="ukuran-section"></div>');
            var ukuranName = '<h2>' + ukuran.ukuran + '</h2>';
            var editButton = '<button class="btn btn-info edit-ukuran" data-id_ukuran="' + ukuran.id_ukuran + '">Edit</button>';
            var deleteButton = '<button class="btn btn-danger delete-ukuran" data-id_ukuran="' + ukuran.id_ukuran + '">Delete</button>';
            var productCards = createProductCards(ukuran.product);

            ukuranSection.append(ukuranName);
            ukuranSection.append(deleteButton);
            ukuranSection.append(editButton);
            ukuranSection.append(productCards);
            container.append(ukuranSection);
        });

        return container;
    }
    
// Function to handle "Edit Category" button click
$(document).on('click', '.edit-ukuran', function() {
    var ukuranId = $(this).data('id_ukuran');
    // Add your logic to handle editing a ukuran here
    window.location.href = 'edit_ukuran.html?id=' + ukuranId;
});

// Function to handle "Delete Category" button click
$(document).on('click', '.delete-ukuran', function() {
    var ukuranId = $(this).data('id_ukuran');
    console.log("Deleting Category ID:", ukuranId); // Log Category ID
    var token = getToken();

    if (!token) {
        $("#dataResult").text("You must login first!");
        return;
    }

    // Find Product by ID before deletion
    $.ajax({
        url: ukuranUrl + "/" + ukuranId,
        method: "GET",
        headers: {
            Authorization: "Bearer " + token,
        },
        success: function(response) {
            if (response.success) {
                var ukuran = response.data; // Product data
                if (confirm("Are you sure you want to delete the ukuran: " + ukuran.ukuran + "?")) {
                    // Proceed with deletion
                    deleteProduct(ukuranId, token);
                }
            } else {
                console.error("Error finding ukuran:", response.message);
                // Display error message to user
                $("#dataResult").text("Error finding ukuran: " + response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error("Error finding ukuran:", error);
            // Display error message to user
            $("#dataResult").text("Error finding ukuran. Please try again later.");
        }
    });
});

// Function to delete ukuran after confirmation
function deleteProduct(ukuranId, token) {
    $.ajax({
        url: ukuranUrl + "/" + ukuranId,
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + token,
        },
        success: function(response) {
            console.log("Category successfully deleted:", response);
            // Refresh data after deletion
            $("#fetchProducts").trigger("click");
        },
        error: handleError,
    });
}
    
    function toggleAddUkuranButton(show) {
        if (show) {
            $('.add-ukuran-button').show();
        } else {
            $('.add-ukuran-button').hide();
        }
    }

    // Fetch ukuran and products
    $('#fetchSizes').click(function(event) {
        event.preventDefault(); // Prevent default link behavior

        var token = getToken();

        if (!token) {
            $('#dataResult').text('You must login first!');
            return;
        }

        $.ajax({
            url: ukuranUrl,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            dataType: 'json',
            success: function(data) {
                $('#dataResult').empty(); // Clear previous results

                if (data.success) {
                    $('#dataResult').append(createUkuranCards(data.data.ukuran));
                    toggleAddUkuranButton(true); // Show the "Tambah Product" button
                } else {
                    $('#dataResult').text('Failed to fetch categories.');
                }
            },
            error: handleError
        });
    });
       // Function to handle "Fetch Categories" click
       $("#fetchProducts").click(function() {
        toggleAddUkuranButton(false); // Hide the "Tambah Product" button
    });

    // Function to handle "Fetch Sizes" click
    $("#fetchCategories").click(function() {
        toggleAddUkuranButton(false); // Hide the "Tambah Product" button
    });

    // Function to handle "Tambah Product" button click
    $("#addUkuranButton").click(function() {
        // Add your logic to handle adding a new product here
        console.log("Tambah Product button clicked!");
    });

    // Initial hide for "Tambah Product" button
    toggleAddUkuranButton(false);
});
