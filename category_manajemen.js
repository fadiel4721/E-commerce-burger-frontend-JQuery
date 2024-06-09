$(document).ready(function() {
    // Function to retrieve token from localStorage
    function getToken() {
        return localStorage.getItem('token');
    }

    // URLs for API endpoints
    var categoryUrl = 'http://127.0.0.1:8000/api/admin/categories'; // Endpoint kategori

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

    // Function to create category cards with product images
// Function to create category cards with edit and delete buttons
function createCategoryCards(categories) {
    var container = $('<div></div>');
    categories.forEach(function(category) {
        var categorySection = $('<div class="category-section"></div>');
        var categoryName = '<h2>' + category.nama_category + '</h2>';
        var editButton = '<button class="btn btn-info edit-category" data-id_category="' + category.id_category + '">Edit</button>';
        var deleteButton = '<button class="btn btn-danger delete-category" data-id_category="' + category.id_category + '">Delete</button>';
        var productCards = createProductCards(category.product);

        categorySection.append(categoryName);
        categorySection.append(editButton);
        categorySection.append(deleteButton);
        categorySection.append(productCards);
        container.append(categorySection);
    });

    return container;
}

// Function to handle "Edit Category" button click
$(document).on('click', '.edit-category', function() {
    var categoryId = $(this).data('id_category');
    // Redirect to edit_category.html with categoryId as query parameter
    window.location.href = 'edit_category.html?id=' + categoryId;
});

// Function to handle "Delete Category" button click
$(document).on('click', '.delete-category', function() {
    var categoryId = $(this).data('id_category');
    console.log("Deleting Category ID:", categoryId); // Log Category ID
    var token = getToken();

    if (!token) {
        $("#dataResult").text("You must login first!");
        return;
    }

    // Find Product by ID before deletion
    $.ajax({
        url: categoryUrl + "/" + categoryId,
        method: "GET",
        headers: {
            Authorization: "Bearer " + token,
        },
        success: function(response) {
            if (response.success) {
                var category = response.data; // Product data
                if (confirm("Are you sure you want to delete the product: " + category.nama_category + "?")) {
                    // Proceed with deletion
                    deleteProduct(categoryId, token);
                }
            } else {
                console.error("Error finding category:", response.message);
                // Display error message to user
                $("#dataResult").text("Error finding category: " + response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error("Error finding category:", error);
            // Display error message to user
            $("#dataResult").text("Error finding category. Please try again later.");
        }
    });
});

// Function to delete category after confirmation
function deleteProduct(categoryId, token) {
    $.ajax({
        url: categoryUrl + "/" + categoryId,
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

    function toggleAddCategoryButton(show) {
        if (show) {
            $('.add-category-button').show();
        } else {
            $('.add-category-button').hide();
        }
    }
    // Fetch categories and products
    $('#fetchCategories').click(function(event) {
        event.preventDefault(); // Prevent default link behavior

        var token = getToken();

        if (!token) {
            $('#dataResult').text('You must login first!');
            return;
        }

        $.ajax({
            url: categoryUrl,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            dataType: 'json',
            success: function(data) {
                $('#dataResult').empty(); // Clear previous results

                if (data.success) {
                    $('#dataResult').append(createCategoryCards(data.data.categories));
                    toggleAddCategoryButton(true); // Show the "Tambah Product" button
                } else {
                    $('#dataResult').text('Failed to fetch categories.');
                }
            },
            error: handleError
        });
    });
    
    // Function to handle "Fetch Categories" click
    $("#fetchProducts").click(function() {
        toggleAddCategoryButton(false); // Hide the "Tambah Product" button
    });

    // Function to handle "Fetch Sizes" click
    $("#fetchSizes").click(function() {
        toggleAddCategoryButton(false); // Hide the "Tambah Product" button
    });

    // Function to handle "Tambah Product" button click
    $("#addCategoryButton").click(function() {
        // Add your logic to handle adding a new category here
        console.log("Tambah Product button clicked!");
    });

    // Initial hide for "Tambah Product" button
    toggleAddCategoryButton(false);
});
