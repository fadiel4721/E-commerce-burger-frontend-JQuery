$(document).ready(function() {
    $(document).on('click', '.increase-quantity', function(e) {
        e.preventDefault();
        var productId = $(this).data('id_product');
        var quantityElement = $(this).siblings('span');
        var currentQuantity = parseInt(quantityElement.text());
        quantityElement.text(currentQuantity + 1);
    });

    $(document).on('click', '.decrease-quantity', function(e) {
        e.preventDefault();
        var productId = $(this).data('id_product');
        var quantityElement = $(this).siblings('span');
        var currentQuantity = parseInt(quantityElement.text());
        if (currentQuantity > 0) {
            quantityElement.text(currentQuantity - 1);
        }
    });
});
