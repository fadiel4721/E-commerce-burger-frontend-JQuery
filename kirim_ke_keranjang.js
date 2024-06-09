$(document).ready(function() {
    function getToken() {
        return localStorage.getItem('token');
    }

    function getRoleFromToken() {
        // Replace this function with your logic to get the role from the token
        return 'customer'; // Example role
    }

    function getCustomerIdFromRole(role) {
        switch (role) {
            case 'admin':
                return 1;
            case 'customer':
                return 2;
            default:
                return null;
        }
    }

    $(document).on('click', '.product-cart', function() {
        var productId = $(this).data('id');
        var quantity = parseInt($(this).siblings('.product-quantity').find('span').text());
        var role = getRoleFromToken();
        var idCustomer = getCustomerIdFromRole(role);

        if (idCustomer && quantity > 0) {
            addToCart(productId, idCustomer, quantity);
        } else {
            alert('Role not found or quantity is zero. Unable to add to cart.');
        }
    });

    function addToCart(productId, idCustomer, quantity) {
        var token = getToken();

        if (!token) {
            console.error('Token not found in localStorage');
            return;
        }

        var data = {
            id_product: productId,
            id_customer: idCustomer,
            qty: quantity
        };

        $.ajax({
            url: 'http://127.0.0.1:8000/api/keranjang',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            success: function(response) {
                if (response.success) {
                    alert('Successfully added to cart!');
                } else {
                    alert('Failed to add to cart: ' + response.message);
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
});
