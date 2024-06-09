$(document).ready(function() {
    $('#loginForm').on('submit', function(event) {
        event.preventDefault();
        
        var email = $('#email').val();
        var password = $('#password').val();
        
        $.ajax({
            url: 'http://127.0.0.1:8000/api/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email: email, password: password }),
            success: function(response) {
                if (response.success) {
                    var token = response.data.token;
                    var userName = response.data.user.name;
                    var userRole = response.data.user.role; // Assuming 'role' is returned in the response
                    
                    if (userRole === 'admin') {
                        alert('Selamat datang, ' + userName + '! Anda berhasil login sebagai admin.');
                        localStorage.setItem('token', token);
                        window.location.href = 'admin_homepage.html';
                    } else if (userRole === 'customer') {
                        alert('Selamat datang, ' + userName + '! Anda berhasil login sebagai customer.');
                        localStorage.setItem('token', token);
                        window.location.href = 'customer.html';
                    } else {
                        $('#alertContainer').html(`
                            <div class="alert alert-danger" role="alert">
                                Anda bukan admin.
                            </div>
                        `);
                    }
                } else {
                    $('#alertContainer').html(`
                        <div class="alert alert-danger" role="alert">
                            Login gagal: ` + response.message + `
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
