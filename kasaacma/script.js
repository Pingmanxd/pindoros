// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Kullanıcı bakiye bilgisi
    let userBalance = 0;
    
    // DOM Elementleri
    const balanceLink = document.getElementById('balanceLink');
    const appContent = document.getElementById('app-content');
    const caseModal = document.getElementById('caseModal');
    const closeModal = document.querySelector('.close');
    const modalTitle = document.getElementById('modalTitle');
    const itemsContainer = document.querySelector('.items-container');
    const wonItem = document.querySelector('.won-item');
    const wonAmount = document.getElementById('wonAmount');
    const claimBtn = document.getElementById('claimBtn');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Valorant temalı itemler
    const valorantItems = [
        { type: 'VP', value: 10, color: '#ff4655', rarity: 'common' },
        { type: 'VP', value: 25, color: '#ff4655', rarity: 'uncommon' },
        { type: 'VP', value: 50, color: '#ff8f9e', rarity: 'rare' },
        { type: 'VP', value: 100, color: '#ff4655', rarity: 'epic' },
        { type: 'VP', value: 250, color: '#ff8f9e', rarity: 'legendary' },
        { type: 'Skin', value: 'Phoenix', color: '#ff9c54', rarity: 'rare' },
        { type: 'Skin', value: 'Jett', color: '#7ad0ff', rarity: 'epic' },
        { type: 'Skin', value: 'Reyna', color: '#c77dff', rarity: 'legendary' }
    ];
    
    // Sayfa yüklendiğinde ana sayfayı göster
    showHomePage();
    
    // Navigation linkleri için event listener'lar
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            
            // Aktif linki güncelle
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // İlgili sayfayı göster
            switch(page) {
                case 'home':
                    showHomePage();
                    break;
                case 'cases':
                    showCasesPage();
                    break;
                case 'balance':
                    showBalancePage();
                    break;
            }
        });
    });
    
    // Bakiye yükleme fonksiyonu
    balanceLink.addEventListener('click', function() {
        const amount = prompt('Yüklemek istediğiniz VP miktarını girin:', '100');
        if (amount && !isNaN(amount)) {
            userBalance += parseInt(amount);
            updateBalance();
            showSuccess(`${amount} VP yüklendi!`);
        }
    });
    
    // Modal kapatma butonu
    closeModal.addEventListener('click', function() {
        caseModal.style.display = 'none';
    });
    
    // Ödülü alma butonu
    claimBtn.addEventListener('click', function() {
        const amount = parseInt(wonAmount.textContent);
        if (!isNaN(amount)) {
            userBalance += amount;
            updateBalance();
        }
        caseModal.style.display = 'none';
        showSuccess(`Tebrikler! ${wonAmount.textContent} kazandınız!`);
    });
    
    // Ana sayfa içeriği
    function showHomePage() {
        appContent.innerHTML = `
            <section class="hero">
                <div class="hero-content">
                    <h1>VALORANT VP KAZAN</h1>
                    <p>Kasaları aç, ödülleri kazan ve hesabına VP yükle!</p>
                    <button class="btn open-cases-btn">Kasaları Gör</button>
                </div>
            </section>
            <section class="features">
                <div class="feature-card">
                    <i class="fas fa-gem"></i>
                    <h3>VP Kazan</h3>
                    <p>Şansını dene ve Valorant Point kazan</p>
                </div>
                <div class="feature-card">
                    <i class="fas fa-box-open"></i>
                    <h3>Özel Kasalar</h3>
                    <p>Eşsiz skinler ve ödüller</p>
                </div>
                <div class="feature-card">
                    <i class="fas fa-bolt"></i>
                    <h3>Hızlı Yükleme</h3>
                    <p>Kazandığın VP'ler anında hesabında</p>
                </div>
            </section>
        `;
        
        // Kasaları gör butonu
        document.querySelector('.open-cases-btn')?.addEventListener('click', showCasesPage);
    }
    
    // Kasalar sayfası
    function showCasesPage() {
        appContent.innerHTML = `
            <section class="cases-section">
                <h2>VALORANT KASALARI</h2>
                <div class="cases-grid">
                    <div class="case-card" data-case-type="basic">
                        <div class="case-image" style="background: linear-gradient(135deg, #ff4655, #0f1923);">
                            <i class="fas fa-box-open"></i>
                        </div>
                        <h3>Standart Kasa</h3>
                        <p>10-100 VP arası ödüller</p>
                        <button class="btn open-case-btn" data-case-type="basic">50 VP - AÇ</button>
                    </div>
                    <div class="case-card" data-case-type="premium">
                        <div class="case-image" style="background: linear-gradient(135deg, #ff8f9e, #1a2a3a);">
                            <i class="fas fa-gem"></i>
                        </div>
                        <h3>Premium Kasa</h3>
                        <p>25-250 VP arası ödüller</p>
                        <button class="btn open-case-btn" data-case-type="premium">100 VP - AÇ</button>
                    </div>
                    <div class="case-card" data-case-type="legendary">
                        <div class="case-image" style="background: linear-gradient(135deg, #ff9c54, #2a3a4a);">
                            <i class="fas fa-crown"></i>
                        </div>
                        <h3>Efsanevi Kasa</h3>
                        <p>Skinler ve 50-250 VP</p>
                        <button class="btn open-case-btn" data-case-type="legendary">200 VP - AÇ</button>
                    </div>
                </div>
            </section>
        `;
        
        // Kasa açma butonları
        document.querySelectorAll('.open-case-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const caseType = this.getAttribute('data-case-type');
                openCase(caseType);
            });
        });
    }
    
    // Bakiye yükleme sayfası
    function showBalancePage() {
        appContent.innerHTML = `
            <section class="balance-section">
                <h2>BAKİYE YÜKLE</h2>
                <div class="balance-options">
                    <div class="balance-card" data-amount="100">
                        <h3>100 VP</h3>
                        <p>₺10.00</p>
                        <button class="btn balance-btn">YÜKLE</button>
                    </div>
                    <div class="balance-card" data-amount="250">
                        <h3>250 VP</h3>
                        <p>₺22.50</p>
                        <button class="btn balance-btn">YÜKLE</button>
                    </div>
                    <div class="balance-card" data-amount="500">
                        <h3>500 VP</h3>
                        <p>₺40.00</p>
                        <button class="btn balance-btn">YÜKLE</button>
                    </div>
                    <div class="balance-card" data-amount="1000">
                        <h3>1000 VP</h3>
                        <p>₺75.00</p>
                        <button class="btn balance-btn">YÜKLE</button>
                    </div>
                </div>
            </section>
        `;
        
        // Bakiye yükleme butonları
        document.querySelectorAll('.balance-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const amount = parseInt(this.parentElement.getAttribute('data-amount'));
                userBalance += amount;
                updateBalance();
                showSuccess(`${amount} VP yüklendi!`);
            });
        });
    }
    
    // Kasa açma fonksiyonu
    function openCase(caseType) {
        // Kasa ücretini kontrol et
        let caseCost = 0;
        switch(caseType) {
            case 'basic': caseCost = 50; break;
            case 'premium': caseCost = 100; break;
            case 'legendary': caseCost = 200; break;
        }
        
        if (userBalance < caseCost) {
            showError(`Yeterli VP'niz yok! Bakiye yükleyin.`);
            return;
        }
        
        // Kasa açma işlemi
        userBalance -= caseCost;
        updateBalance();
        
        // Modalı hazırla
        caseModal.style.display = 'flex';
        modalTitle.textContent = `${caseType === 'basic' ? 'Standart' : caseType === 'premium' ? 'Premium' : 'Efsanevi'} Kasa Açılıyor...`;
        itemsContainer.innerHTML = '';
        wonItem.classList.remove('visible');
        
        // Rastgele ödül seç
        let possibleItems = [];
        switch(caseType) {
            case 'basic':
                possibleItems = valorantItems.filter(item => 
                    (item.type === 'VP' && item.value <= 100) || item.rarity === 'common');
                break;
            case 'premium':
                possibleItems = valorantItems.filter(item => 
                    (item.type === 'VP' && item.value <= 250) || item.rarity !== 'legendary');
                break;
            case 'legendary':
                possibleItems = [...valorantItems];
                break;
        }
        
        const wonPrize = possibleItems[Math.floor(Math.random() * possibleItems.length)];
        
        // Animasyon için itemleri oluştur (30 adet)
        for (let i = 0; i < 30; i++) {
            const randomItem = possibleItems[Math.floor(Math.random() * possibleItems.length)];
            const itemElement = document.createElement('div');
            itemElement.className = 'item';
            itemElement.style.borderColor = randomItem.color;
            itemElement.style.color = randomItem.color;
            itemElement.innerHTML = randomItem.type === 'VP' ? 
                `${randomItem.value} VP` : randomItem.value;
            itemsContainer.appendChild(itemElement);
        }
        
        // Animasyonu başlat
        setTimeout(() => {
            const itemWidth = 120; // item genişliği + margin
            const targetPosition = -(15 * itemWidth) + (Math.random() * 10 * itemWidth);
            
            itemsContainer.style.transform = `translateX(${targetPosition}px) translateY(-50%)`;
            
            // Ödülü göster
            setTimeout(() => {
                wonAmount.textContent = wonPrize.type === 'VP' ? 
                    `${wonPrize.value} VP` : `${wonPrize.value} Skin`;
                wonAmount.style.color = wonPrize.color;
                wonItem.classList.add('visible');
                modalTitle.textContent = 'TEBRİKLER!';
            }, 1500);
        }, 100);
    }
    
    // Bakiye güncelleme
    function updateBalance() {
        balanceLink.textContent = `Bakiye: ${userBalance} VP`;
    }
    
    // Başarı mesajı
    function showSuccess(message) {
        const toast = document.createElement('div');
        toast.className = 'toast success';
        toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // Hata mesajı
    function showError(message) {
        const toast = document.createElement('div');
        toast.className = 'toast error';
        toast.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // Sayfa yüklendiğinde rastgele bullet animasyonları oluştur
    function createBulletAnimations() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const bullet = document.createElement('div');
                bullet.className = 'valorant-bullet';
                bullet.style.left = `${Math.random() * 100}%`;
                bullet.style.top = `${Math.random() * 100}%`;
                bullet.style.animationDuration = `${2 + Math.random() * 3}s`;
                document.body.appendChild(bullet);
                
                bullet.addEventListener('animationend', () => bullet.remove());
            }, i * 800);
        }
    }
    
    // Başlangıçta ve belli aralıklarla bullet animasyonu oluştur
    createBulletAnimations();
    setInterval(createBulletAnimations, 5000);
});

// CSS Animasyonları için dinamik stil ekleme
const style = document.createElement('style');
style.textContent = `
    /* Toast mesajları */
    .toast {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease-out;
    }
    
    .toast i {
        font-size: 18px;
    }
    
    .success {
        background-color: #2ecc71;
        box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
    }
    
    .error {
        background-color: #ff4655;
        box-shadow: 0 4px 12px rgba(255, 70, 85, 0.3);
    }
    
    .fade-out {
        animation: fadeOut 0.3s ease-out forwards;
    }
    
    /* Animasyonlar */
    @keyframes slideIn {
        from { top: -50px; opacity: 0; }
        to { top: 20px; opacity: 1; }
    }
    
    @keyframes fadeOut {
        to { opacity: 0; }
    }
    
    /* Valorant bullet animasyonu */
    .valorant-bullet {
        position: fixed;
        width: 4px;
        height: 4px;
        background-color: #ff4655;
        border-radius: 50%;
        opacity: 0;
        z-index: -1;
        animation: bulletTrail 3s linear forwards;
    }
    
    @keyframes bulletTrail {
        0% {
            transform: translate(0, 0);
            opacity: 1;
        }
        100% {
            transform: translate(100vw, 100vh);
            opacity: 0;
        }
    }
    
    /* Hero section */
    .hero {
        text-align: center;
        padding: 60px 20px;
        position: relative;
        overflow: hidden;
    }
    
    .hero::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(255,70,85,0.1) 0%, rgba(15,25,35,0) 70%);
        z-index: -1;
    }
    
    .hero h1 {
        font-family: 'Anton', sans-serif;
        font-size: 48px;
        color: #ff4655;
        margin-bottom: 20px;
        letter-spacing: 2px;
    }
    
    .hero p {
        font-size: 18px;
        max-width: 600px;
        margin: 0 auto 30px;
    }
    
    /* Features grid */
    .features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
    }
    
    .feature-card {
        background-color: rgba(26, 42, 58, 0.5);
        border: 1px solid #2a3a4a;
        border-radius: 8px;
        padding: 30px 20px;
        text-align: center;
        transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .feature-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        border-color: #ff4655;
    }
    
    .feature-card i {
        font-size: 40px;
        color: #ff4655;
        margin-bottom: 20px;
    }
    
    .feature-card h3 {
        color: #ff4655;
        margin-bottom: 10px;
    }
    
    /* Cases grid */
    .cases-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
        margin-top: 40px;
    }
    
    .case-card {
        background-color: rgba(26, 42, 58, 0.5);
        border: 1px solid #2a3a4a;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        transition: all 0.3s;
    }
    
    .case-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(255, 70, 85, 0.1);
        border-color: #ff4655;
    }
    
    .case-image {
        width: 100%;
        height: 150px;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
        font-size: 50px;
        color: white;
    }
    
    /* Balance options */
    .balance-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-top: 40px;
    }
    
    .balance-card {
        background-color: rgba(26, 42, 58, 0.5);
        border: 1px solid #2a3a4a;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
    }
    
    .balance-card h3 {
        color: #ff4655;
        margin-bottom: 5px;
    }
    
    .balance-card p {
        margin-bottom: 15px;
        font-size: 14px;
    }
`;
document.head.appendChild(style);

