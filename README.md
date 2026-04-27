Real-Time Chat Application 💬
Bu proje; modern web teknolojileri kullanılarak geliştirilmiş, kullanıcı kimlik doğrulama sistemine sahip, tam kapsamlı (Full-Stack) ve gerçek zamanlı bir mesajlaşma uygulamasıdır. Proje; ölçeklenebilir bir arka plan (backend) mimarisi ile hızlı ve kullanıcı dostu bir ön yüzün (frontend) entegrasyonu üzerine inşa edilmiştir.

🚀 Kullanılan Teknolojiler
Frontend: React.js (Vite), Tailwind CSS
Backend: Node.js, Express.js
Veritabanı: MongoDB (Mongoose)
Anlık İletişim: Socket.io (WebSocket)

✨ Öne Çıkan Özellikler
Kullanıcı Kimlik Doğrulaması (Authentication): JWT tabanlı güvenli kayıt olma (Register) ve giriş yapma (Login) süreçleri.
Gerçek Zamanlı Mesajlaşma: Socket.io entegrasyonu sayesinde sayfayı yenilemeye gerek kalmadan anlık, düşük gecikmeli iletişim.
Modern Tasarım: Tailwind CSS ile geliştirilmiş, tamamen duyarlı (responsive) ve temiz bir arayüz.
Dinamik Veri Akışı: Kullanıcı listesinin ve mesaj geçmişinin veritabanı üzerinden anlık olarak yönetilmesi.

🛠️ Kurulum ve Çalıştırma
Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları sırasıyla uygulayabilirsiniz:

1. Sunucu (Backend) Hazırlığı
# Server klasörüne gidin
cd server

# Gerekli bağımlılıkları yükleyin
npm install

# Sunucuyu başlatın
node index.js

2. İstemci (Frontend) Hazırlığı
# Client klasörüne gidin
cd client

# Gerekli bağımlılıkları yükleyin
npm install

# Uygulamayı geliştirme modunda çalıştırın
npm run dev

📂 Proje Yapısı
Proje, kurumsal standartlara uygun olarak iki ana parçaya ayrılmıştır:
client/: React ve Vite ile geliştirilen, kullanıcı arayüzünü ve soket bağlantılarını yöneten kısım.
server/: API uç noktalarını (routes), veritabanı modellerini ve Socket.io sunucusunu barındıran kısım.
