$(document).ready(function() {
    $('#registerForm').on('submit', function(event) {
        event.preventDefault();
        
        var name = $('#name').val();
        var email = $('#email').val();
        var password = $('#password').val();
        var password_confirmation = $('#password_confirmation').val();
        
        // Client-side validation
        if (password !== password_confirmation) {
            $('#alertContainer').html(`
                <div class="alert alert-danger" role="alert">
                    Password dan konfirmasi password tidak cocok.
                </div>
            `);
            return;
        }
        
        var registerData = {
            name: name,
            email: email,
            password: password,
            password_confirmation
        };

        $.ajax({
            url: 'http://127.0.0.1:8000/api/register',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(registerData),
            success: function(response) {
                if (response.success) {
                    alert('Registrasi berhasil!');
                    window.location.href = 'login.html';
                } else {
                    $('#alertContainer').html(`
                        <div class="alert alert-danger" role="alert">
                            Registrasi gagal: ` + response.message + `
                        </div>
                    `);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#alertContainer').html(`
                    <div class="alert alert-danger" role="alert">
                        Terjadi kesalahan: ` + errorThrown + `
                    </div>
                `);
            }
        });
    });
});
