$(document).ready(function() {
    // Function to retrieve token from localStorage
    function getToken() {
        return localStorage.getItem("token");
    }

    // URLs for API endpoints
    var dataUrl = "http://127.0.0.1:8000/api/admin/products";
    var imageUrl = "http://127.0.0.1:8000/storage/";

    // Function to handle API request errors
    function handleError(jqXHR, textStatus, errorThrown) {
        console.error("Error: " + textStatus, errorThrown);
        $("#dataResult").text("Error: " + textStatus + " " + errorThrown);
    }

    // Function to create product cards
    function createCards(data) {
        var cards = $('<div class="card-deck"></div>');
        data.forEach(function(item) {
            var card = $('<div class="col-md-4 mb-4"></div>');
            var cardContent = $('<div class="product-card"></div>');
            var productImage = item.image ? '<img src="' + imageUrl + item.image + '" alt="Product Image" class="card-img-top">' : "";
            var productTitle = '<div class="product-title">' + item.nama_product + "</div>";
            var productDescription = "<p>" + item.description + "</p>";
            var productPrice = '<div class="product-price">Rp' + item.price + "</div>";
            var deleteButton = '<button class="btn btn-danger delete-product" data-id_product="' + item.id_product + '">Delete</button>';
            var editButton = '<button class="btn btn-info edit-product" data-id_product="' + item.id_product + '">Edit</button>';
            cardContent.append(productImage);
            cardContent.append(
                '<div class="product-info">' +
                productTitle +
                productDescription +
                productPrice +
                deleteButton +
                editButton +
                "</div>"
            );
            card.append(cardContent);
            cards.append(card);
        });

        return cards;
    }

    // Function to show/hide "Tambah Product" button
    function toggleAddProductButton(show) {
        if (show) {
            $('.add-product-button').show();
        } else {
            $('.add-product-button').hide();
        }
    }

   // Function to handle "Hapus Product" button click
   $(document).on('click', '.delete-product', function() {
    var productId = $(this).data('id_product');
    console.log("Deleting Product ID:", productId); // Log Product ID
    var token = getToken();

    if (!token) {
        $("#dataResult").text("You must login first!");
        return;
    }

    // Find Product by ID before deletion
    $.ajax({
        url: dataUrl + "/" + productId,
        method: "GET",
        headers: {
            Authorization: "Bearer " + token,
        },
        success: function(response) {
            if (response.success) {
                var product = response.data; // Product data
                if (confirm("Are you sure you want to delete the product: " + product.nama_product + "?")) {
                    // Proceed with deletion
                    deleteProduct(productId, token);
                }
            } else {
                console.error("Error finding product:", response.message);
                // Display error message to user
                $("#dataResult").text("Error finding product: " + response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error("Error finding product:", error);
            // Display error message to user
            $("#dataResult").text("Error finding product. Please try again later.");
        }
    });
});

// Function to delete product after confirmation
function deleteProduct(productId, token) {
    $.ajax({
        url: dataUrl + "/" + productId,
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + token,
        },
        success: function(response) {
            console.log("Product successfully deleted:", response);
            // Refresh data after deletion
            $("#fetchProducts").trigger("click");
        },
        error: handleError,
    });
}
    // Function to handle "Edit Product" button click
    $(document).on('click', '.edit-product', function() {
        var productId = $(this).data('id_product');
        var token = getToken();

        if (!token) {
            $("#dataResult").text("You must login first!");
            return;
        }

        // Example: Redirect to edit page with product ID
        window.location.href = "edit_product.html?id=" + productId; // Replace with appropriate logic
    });

    // Fetch data request when clicking "Fetch Products"
    $("#fetchProducts").click(function(event) {
        event.preventDefault(); // Prevent default link behavior

        var token = getToken();

        if (!token) {
            $("#dataResult").text("You must login first!");
            return;
        }

        $.ajax({
            url: dataUrl,
            type: "GET",
            headers: {
                Authorization: "Bearer " + token,
            },
            dataType: "json",
            success: function(data) {
                $("#dataResult").empty(); // Clear previous results

                if (data.success) {
                    $("#dataResult").append(createCards(data.data.products));
                    // Replace feather icons if used
                    toggleAddProductButton(true); // Show the "Tambah Product" button
                } else {
                    $("#dataResult").text("Data fetched is not an array.");
                }
            },
            error: handleError,
        });
    });

    // Function to handle "Fetch Categories" click
    $("#fetchCategories").click(function() {
        toggleAddProductButton(false); // Hide the "Tambah Product" button
    });

    // Function to handle "Fetch Sizes" click
    $("#fetchSizes").click(function() {
        toggleAddProductButton(false); // Hide the "Tambah Product" button
    });

    // Function to handle "Tambah Product" button click
    $("#addProductButton").click(function() {
        // Add your logic to handle adding a new product here
        console.log("Tambah Product button clicked!");
    });

    // Initial hide for "Tambah Product" button
    toggleAddProductButton(false);
});