document.addEventListener('DOMContentLoaded', function() {
    // Elementleri seçme
    const elements = {
        googleLogin: document.getElementById('googleLogin'),
        discordLogin: document.getElementById('discordLogin'),
        googleRegister: document.getElementById('googleRegister'),
        discordRegister: document.getElementById('discordRegister'),
        loginBtn: document.getElementById('loginBtn'),
        registerBtn: document.getElementById('registerBtn'),
        showLogin: document.getElementById('showLogin'),
        showRegister: document.getElementById('showRegister'),
        loginUsernameOrEmail: document.getElementById('loginUsernameOrEmail'), // Güncellendi
        loginPassword: document.getElementById('loginPassword')
    };

    // Form Geçişleri
    elements.showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginForm').classList.add('active');
        document.getElementById('registerForm').classList.remove('active');
    });

    elements.showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('registerForm').classList.add('active');
        document.getElementById('loginForm').classList.remove('active');
    });

    // OAuth Fonksiyonu
    async function handleOAuth(provider, isRegister) {
        const button = isRegister ? elements[`${provider}Register`] : elements[`${provider}Login`];
        const originalText = button.innerHTML;
        
        try {
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yönlendiriliyor...';
            button.disabled = true;
            
            const response = await fetch(`http://localhost:3000/api/auth/${provider}?register=${isRegister}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            window.location.href = data.url;
            
        } catch (error) {
            console.error(`${provider} Hatası:`, error);
            button.innerHTML = originalText;
            button.disabled = false;
            showError(`${provider} girişi başarısız oldu. Lütfen tekrar deneyin.`);
        }
    }

    // OAuth Event Listeners
    elements.googleLogin.addEventListener('click', (e) => handleOAuth('google', false));
    elements.discordLogin.addEventListener('click', (e) => handleOAuth('discord', false));
    elements.googleRegister.addEventListener('click', (e) => handleOAuth('google', true));
    elements.discordRegister.addEventListener('click', (e) => handleOAuth('discord', true));

    // Giriş Yap Butonu (GÜNCELLENDİ)
    elements.loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const usernameOrEmail = elements.loginUsernameOrEmail.value.trim();
        const password = elements.loginPassword.value;

        if (!usernameOrEmail || !password) {
            showError('Lütfen kullanıcı adı/email ve şifre girin!');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    usernameOrEmail, // Artık hem email hem kullanıcı adı kabul ediyor
                    password 
                }),
                credentials: 'include'
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Giriş başarısız');
            
            showSuccess('Giriş başarılı! Yönlendiriliyorsunuz...');
            setTimeout(() => window.location.href = '/kasaacma/spin.html', 1500);
        } catch (error) {
            showError(error.message.includes('Kullanıcı') 
                ? 'Kullanıcı adı/email veya şifre hatalı!' 
                : error.message);
        }
    });

    // Kayıt Ol Butonu
    elements.registerBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const username = document.getElementById('regUsername').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regConfirm').value;

        if (!username || !email || !password) {
            showError('Lütfen tüm alanları doldurun!');
            return;
        }

        if (password !== confirm) {
            showError('Şifreler eşleşmiyor');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
                credentials: 'include'
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Kayıt başarısız');
            
            showSuccess('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
            setTimeout(() => document.getElementById('showLogin').click(), 1500);
        } catch (error) {
            showError(error.message.includes('E11000') 
                ? 'Bu kullanıcı adı/email zaten kullanımda!' 
                : error.message);
        }
    });

    // Toast Mesajları
    function showError(message) {
        const toast = document.createElement('div');
        toast.className = 'error-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }

    function showSuccess(message) {
        const toast = document.createElement('div');
        toast.className = 'success-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }

    // URL'deki hata mesajlarını kontrol et
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('auth')) {
        const errorType = urlParams.get('auth');
        if (errorType === 'google_failed') showError('Google girişi başarısız oldu');
        else if (errorType === 'discord_failed') showError('Discord girişi başarısız oldu');
    }
});
if (window.location.search.includes('discord_success')) {
    window.location.href = '/kasaacma/spin.html'; // Yönlendirme
  }