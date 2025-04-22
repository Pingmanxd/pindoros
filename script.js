// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Elementleri seçme
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const closeAuth = document.querySelector('.close-auth');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const modal = document.getElementById('authModal');

    // Valorant temalı bullet animasyonları oluştur
    function createBulletAnimations() {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const bullet = document.createElement('div');
                bullet.className = 'valorant-bullet';
                bullet.style.left = `${Math.random() * 100}%`;
                bullet.style.top = `${Math.random() * 100}%`;
                bullet.style.animationDuration = `${3 + Math.random() * 4}s`;
                bullet.style.animationDelay = `${Math.random() * 2}s`;
                document.body.appendChild(bullet);
                
                // Animasyon bitince bullet'ı sil
                bullet.addEventListener('animationend', function() {
                    bullet.remove();
                });
            }, i * 600);
        }
    }

    // Sayfa yüklendiğinde ve belli aralıklarla bullet animasyonu oluştur
    createBulletAnimations();
    setInterval(createBulletAnimations, 5000);

    // Form geçişleri
    showRegister.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
    });

    showLogin.addEventListener('click', function(e) {
        e.preventDefault();
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
    });

    // Modalı kapatma
    closeAuth.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Dışarı tıklayınca modalı kapatma
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Giriş butonu işlevi
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!email || !password) {
            showError('Lütfen tüm alanları doldurunuz!');
            return;
        }
        
        // Giriş animasyonu
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Giriş Yapılıyor...';
        loginBtn.disabled = true;
        
        // Simüle edilmiş giriş işlemi
        setTimeout(() => {
            loginBtn.innerHTML = '<i class="fas fa-check"></i> Giriş Başarılı!';
            setTimeout(() => {
                modal.style.display = 'none';
                loginBtn.innerHTML = 'Giriş Yap';
                loginBtn.disabled = false;
                // Burada gerçek giriş işlemi yapılabilir
                window.location.href ='/kasaacma/spin.html';
                alert(`Hoş geldiniz! ${email} ile giriş yapıldı.`);
            }, 1000);
        }, 1500);
    });

    // Kayıt butonu işlevi
    registerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regConfirm').value;
        
        if (!username || !email || !password || !confirm) {
            showError('Lütfen tüm alanları doldurunuz!');
            return;
        }
        
        if (password !== confirm) {
            showError('Şifreler eşleşmiyor!');
            return;
        }
        
        if (password.length < 6) {
            showError('Şifre en az 6 karakter olmalıdır!');
            return;
        }
        
        // Kayıt animasyonu
        registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Kayıt Olunuyor...';
        registerBtn.disabled = true;
        
        // Simüle edilmiş kayıt işlemi
        setTimeout(() => {
            registerBtn.innerHTML = '<i class="fas fa-check"></i> Kayıt Başarılı!';
            setTimeout(() => {
                registerForm.classList.remove('active');
                loginForm.classList.add('active');
                registerBtn.innerHTML = 'Kayıt Ol';
                registerBtn.disabled = false;
                
                // Formları temizle
                document.getElementById('regUsername').value = '';
                document.getElementById('regEmail').value = '';
                document.getElementById('regPassword').value = '';
                document.getElementById('regConfirm').value = '';
                
                // Kullanıcıyı bilgilendir
                document.getElementById('loginEmail').value = email;
                showSuccess(`${username} kullanıcı adıyla kayıt başarılı! Giriş yapabilirsiniz.`);
            }, 1000);
        }, 1500);
    });

    // Hata mesajı gösterme fonksiyonu
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #ff4655;
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(255, 70, 85, 0.3);
            z-index: 1001;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                errorDiv.remove();
            }, 300);
        }, 3000);
    }

    // Başarı mesajı gösterme fonksiyonu
    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #2ecc71;
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
            z-index: 1001;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                successDiv.remove();
            }, 300);
        }, 3000);
    }

    // CSS animasyonları için style ekleme
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { top: -50px; opacity: 0; }
            to { top: 20px; opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        .error-message i, .success-message i {
            margin-right: 8px;
        }
    `;
    document.head.appendChild(style);
});

    // Sosyal giriş butonları
    const googleLogin = document.getElementById('googleLogin');
    const discordLogin = document.getElementById('discordLogin');
    const googleRegister = document.getElementById('googleRegister');
    const discordRegister = document.getElementById('discordRegister');

    // ... diğer fonksiyonlar aynı ...

    // Modalı kapatma
    closeAuth.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Dışarı tıklayınca modalı kapatma
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Google giriş işlevi
    googleLogin.addEventListener('click', function(e) {
        e.preventDefault();
        googleLogin.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Google ile giriş yapılıyor...';
        googleLogin.disabled = true;
        
        setTimeout(() => {
            showSuccess('Google ile giriş başarılı!');
            setTimeout(() => {
                modal.style.display = 'none';
                googleLogin.innerHTML = '<i class="fab fa-google"></i> Google ile Giriş Yap';
                googleLogin.disabled = false;
                window.location.href = '/kasaacma/spin.html';
            }, 1000);
        }, 1500);
    });

    // Discord giriş işlevi
    discordLogin.addEventListener('click', function(e) {
        e.preventDefault();
        discordLogin.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Discord ile giriş yapılıyor...';
        discordLogin.disabled = true;
        
        setTimeout(() => {
            showSuccess('Discord ile giriş başarılı!');
            setTimeout(() => {
                modal.style.display = 'none';
                discordLogin.innerHTML = '<i class="fab fa-discord"></i> Discord ile Giriş Yap';
                discordLogin.disabled = false;
                window.location.href = '/kasaacma/spin.html';
            }, 1000);
        }, 1500);
    });

    // Google kayıt işlevi
    googleRegister.addEventListener('click', function(e) {
        e.preventDefault();
        googleRegister.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Google ile kayıt olunuyor...';
        googleRegister.disabled = true;
        
        setTimeout(() => {
            showSuccess('Google ile kayıt başarılı!');
            setTimeout(() => {
                modal.style.display = 'none';
                googleRegister.innerHTML = '<i class="fab fa-google"></i> Google ile Kayıt Ol';
                googleRegister.disabled = false;
                window.location.href = '/kasaacma/spin.html';
            }, 1000);
        }, 1500);
    });

    // Discord kayıt işlevi
    discordRegister.addEventListener('click', function(e) {
        e.preventDefault();
        discordRegister.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Discord ile kayıt olunuyor...';
        discordRegister.disabled = true;
        
        setTimeout(() => {
            showSuccess('Discord ile kayıt başarılı!');
            setTimeout(() => {
                modal.style.display = 'none';
                discordRegister.innerHTML = '<i class="fab fa-discord"></i> Discord ile Kayıt Ol';
                discordRegister.disabled = false;
                window.location.href = '/kasaacma/spin.html';
            }, 1000);
        }, 1500);
    });

    // ... diğer kodlar aynı ...
