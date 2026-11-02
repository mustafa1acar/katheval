# Coolify Canlıya Alma Rehberi (Katheval Platformu)

Bu dokümanda, VPS'inizdeki Coolify ve MySQL servisi (`default` veritabanı) ile projeyi canlıya alma adımları yer almaktadır.

---

## 1. Coolify Environment Variables (Kopyalayıp Yapıştırın)

Coolify panelinde uygulamanızı oluşturduktan sonra **Environment Variables** bölümüne aşağıdaki değerleri doğrudan ekleyebilirsiniz:

### Seçenek 1: Tek Bağlantı URL'si (En Pratik)
```env
PORT=5000
DATABASE_URL=mysql://mysql:kathevalbaniauser099@oi7owvsx6lpvxywuxrtwq4ou:3306/default
ADMIN_PASSWORD=katheval2026!
DOMAIN=katheval.al
WHATSAPP_NUMBER=919733621111
```

### Seçenek 2: Ayrı Değişkenler
```env
PORT=5000
DB_HOST=oi7owvsx6lpvxywuxrtwq4ou
DB_PORT=3306
DB_USER=mysql
DB_PASSWORD=kathevalbaniauser099
DB_NAME=default
ADMIN_PASSWORD=katheval2026!
DOMAIN=katheval.al
WHATSAPP_NUMBER=919733621111
```

*(İsteğe bağlı: `root` kullanıcısı ile bağlanmak isterseniz `DB_USER=root` ve `DB_PASSWORD=kathevalbania099` yazabilirsiniz).*

---

## 2. GitHub'a Push ve Coolify'da Canlıya Alma Adımları

### Adım 1: GitHub'a Push Edin
Terminalinizde sırasıyla şu komutları çalıştırın:
```bash
git add .
git commit -m "feat: coolify deployment & mysql candidates integration ready"
git push origin main
```
> **Güvenlik Notu:** `.gitignore` dosyamız `.env` dosyasını hariç tuttuğu için şifreleriniz GitHub reponuza sızmaz.

### Adım 2: Coolify'da Uygulamayı Ekleyin
1. Coolify kontrol panelinizde projenizi açın.
2. **+ New** -> **Application** -> **Public Repository** veya **Private Repository (GitHub App)** seçin.
3. GitHub reponuzu bağlayın.
4. **Build Pack:** Otomatik olarak **Dockerfile** seçili gelecektir (gelmezse `Dockerfile` seçin).

### Adım 3: Port ve Domain Ayarları
1. **Ports Exposes:** `5000` yazın.
2. **Domains:** Alan adınızı yazın (örn: `https://katheval.al`). Coolify otomatik olarak Let's Encrypt SSL sertifikasını kuracaktır.

### Adım 4: Environment Variables Ekleyin
Yukarıdaki **Seçenek 1** veya **Seçenek 2**'deki ortam değişkenlerini yapıştırıp **Save**'e basın.

### Adım 5: Deploy Edin
**Deploy** butonuna tıklayın.
- Vite frontend optimize edilerek derlenir (`dist`).
- Express backend ayağa kalkar ve `oi7owvsx6lpvxywuxrtwq4ou:3306/default` MySQL sunucusuna bağlanır.
- `candidates`, `employer_requests` ve `jobs` tabloları **otomatik oluşturulur**.

---

## 3. Canlı Test ve Admin Paneli

1. **MySQL Bağlantı Kontrolü:**
   Tarayıcınızdan `https://alanadiniz.com/api/health` adresine gidin:
   ```json
   {
     "status": "online",
     "database": "MySQL Connected",
     "domain": "katheval.al"
   }
   ```
   görmelisiniz.

2. **İş Başvurusu Testi:**
   - Sitenizdeki **Job Openings** sekmesine tıklayın.
   - Herhangi bir pozisyon için **Apply Now** butonuna basın.
   - Pasaport ve CV metin alanlarını doldurup **Submit Application** deyin.
   - Başvuru anında MySQL veritabanınızdaki `candidates` tablosuna yazılır.

3. **Admin Paneli Doğrulaması:**
   - Klavyeden `Ctrl + Shift + A` tuşlarına basın veya tarayıcı adresinizin sonuna `#portal` ekleyin (`https://katheval.al/#portal`).
   - Yönetici Girişi:
     - **Email / Kullanıcı Adı:** `admin@katheval.al` (veya `boss@katheval.al`)
     - **Şifre:** `.env` dosyasında belirlediğiniz şifre (Varsayılan: `katheval2026!`)
   - **Candidates Sekmesi:** MySQL'e kaydedilen tüm başvuru sahiplerini görebilir, **Full Profile** butonuna tıklayarak pasaport ve CV detaylarını inceleyebilir ve adayın durumunu güncelleyebilirsiniz.
   - **Üst Panel:** MySQL'deki toplam aday sayısı, işveren talepleri ve aktif iş ilanları canlı sayaç olarak veritabanından çekilir.
