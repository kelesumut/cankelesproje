const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
const port = 5000; // Dilediğiniz başka bir portu seçebilirsiniz

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
host: 'localhost',
user: 'root',
password: '',
database: 'umutcan_proje'
});

db.connect((err) => {
if (err) {
console.log('Veritabanına bağlanılamadı: ', err);
} else {
console.log('Veritabanına başarıyla bağlandı');
}
});

app.get('/register', (req, res) => {
res.render('register');
});

app.post('/register', (req, res) => {
const { name, username, email, password } = req.body;

const query = 'INSERT INTO kayit_olma (name, username, email, password) VALUES (?, ?, ?, ?)';
db.query(query, [name, username, email, password], (err, result) => {
if (err) {
console.error('Kayıt sırasında bir hata oluştu:', err);
res.send('Kayıt sırasında bir hata oluştu.');
} else {
console.log('Kullanıcı başarıyla kaydedildi');
res.redirect('/login'); // Kayıt başarıyla tamamlandığında login sayfasına yönlendir
}
});
});

app.get('/login', (req, res) => {
res.render('login');
});

app.post('/login', (req, res) => {
const { username, password } = req.body;

const query = 'SELECT * FROM kayit_olma WHERE username = ? AND password = ?';
db.query(query, [username, password], (err, result) => {
if (err) {
console.error('Giriş sırasında bir hata oluştu:', err);
res.render('login', { message: 'Giriş sırasında bir hata oluştu.' });
} else {
if (result.length > 0) {
console.log('Giriş başarılı');
res.redirect('/anasayfa'); // Giriş başarılıysa anasayfaya yönlendir
} else {
console.log('Giriş başarısız');
res.render('login', { message: 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.' });
}
}
});
});

//app.get('/anasayfa', (req, res) => {
// res.render('anasayfa');
// });

//app.get('/gostergeler', (req, res) => {
// res.render('gostergeler');
//});

//app.get('/aracgrafikleri', (req, res) => {
// res.render('aracgrafikleri');
// });

//app.get('/magazalar', (req, res) => {
// res.render('magazalar');
//});

//app.get('/depolar', (req, res) => {
// res.render('depolar');
//});

//app.get('/marka-model-grafikleri', (req, res) => {
// res.render('marka-model-grafikleri');
//});

app.get('/anasayfa', (req, res) => {
// Mağaza sayısı göstergesi için veri çekme
const queryMagazalar = 'SELECT COUNT(*) AS magazaSayisi FROM magazalar';
db.query(queryMagazalar, (errMagazalar, resultMagazalar) => {
if (errMagazalar) {
console.error('Mağaza sayısı çekilirken bir hata oluştu:', errMagazalar);
res.render('anasayfa', { magazaSayisi: 'Hata' });
} else {
const magazaSayisi = resultMagazalar[0].magazaSayisi;

  // Depo sayısı göstergesi için veri çekme
  const queryDepolar = 'SELECT COUNT(*) AS depoSayisi FROM depolar';
  db.query(queryDepolar, (errDepolar, resultDepolar) => {
    if (errDepolar) {
      console.error('Depo sayısı çekilirken bir hata oluştu:', errDepolar);
      res.render('anasayfa', { magazaSayisi, depoSayisi: 'Hata' });
    } else {
      const depoSayisi = resultDepolar[0].depoSayisi;

      // Araç sayısı göstergesi için veri çekme
      const queryAraclar = 'SELECT COUNT(*) AS aracSayisi FROM araclar';
      db.query(queryAraclar, (errAraclar, resultAraclar) => {
        if (errAraclar) {
          console.error('Araç sayısı çekilirken bir hata oluştu:', errAraclar);
          res.render('anasayfa', { magazaSayisi, depoSayisi, aracSayisi: 'Hata' });
        } else {
          const aracSayisi = resultAraclar[0].aracSayisi;

          res.render('anasayfa', { magazaSayisi, depoSayisi, aracSayisi });
        }
      });
    }
  });
}
});
});

app.get('/magazalar', (req, res) => {
res.render('magazalar');
});

app.post('/magazalar', (req, res) => {
const { magaza_id, magaza_ad, ilce_id } = req.body;

const query = 'INSERT INTO magazalar (magaza_id, magaza_ad, ilce_id) VALUES (?, ?, ?)';
db.query(query, [magaza_id, magaza_ad, ilce_id], (err, result) => {
if (err) {
console.error('Mağaza eklenirken bir hata oluştu:', err);
res.render('magazalar', { message: 'Mağaza eklenirken bir hata oluştu.' });
} else {
console.log('Mağaza başarıyla eklendi');
res.render('magazalar', { message: 'Mağaza başarıyla eklendi.' });
}
});
});

app.get('/depolar', (req, res) => {
res.render('depolar');
});

app.post('/depolar', (req, res) => {
const { depo_id, depo_ad, ilce_id } = req.body;

const query = 'INSERT INTO depolar (depo_id, depo_ad, ilce_id) VALUES (?, ?, ?)';
db.query(query, [depo_id, depo_ad, ilce_id], (err, result) => {
if (err) {
console.error('Depo eklenirken bir hata oluştu:', err);
res.render('depolar', { message: 'Depo eklenirken bir hata oluştu.' });
} else {
console.log('Depo başarıyla eklendi');
res.render('depolar', { message: 'Depo başarıyla eklendi.' });
}
});
});

/*

app.get('/marka-model-grafikleri', (req, res) => {
// 'depolar' tablosundan depo_ad değerlerini çek
const depoQuery = 'SELECT depo_ad FROM depolar';
db.query(depoQuery, (depoErr, depoResult) => {
if (depoErr) {
console.error('Depolar çekilirken bir hata oluştu:', depoErr);
res.render('error', { message: 'Depolar çekilirken bir hata oluştu.' });
return;
}

// 'magazalar' tablosundan magaza_ad değerlerini çek
const magazaQuery = 'SELECT magaza_ad FROM magazalar';
db.query(magazaQuery, (magazaErr, magazaResult) => {
  if (magazaErr) {
    console.error('Magazalar çekilirken bir hata oluştu:', magazaErr);
    res.render('error', { message: 'Magazalar çekilirken bir hata oluştu.' });
    return;
  }

  // 'araclar' tablosundan arac_plaka değerlerini çek
  const aracQuery = 'SELECT arac_plaka FROM araclar';
  db.query(aracQuery, (aracErr, aracResult) => {
    if (aracErr) {
      console.error('Araçlar çekilirken bir hata oluştu:', aracErr);
      res.render('error', { message: 'Araçlar çekilirken bir hata oluştu.' });
      return;
    }

    // 'soforler' tablosundan deneyim_duzeyi değerlerini çek
    const soforQuery = 'SELECT deneyeim_duzeyi FROM soforler';
    db.query(soforQuery, (soforErr, soforResult) => {
      if (soforErr) {
        console.error('Şoförler çekilirken bir hata oluştu:', soforErr);
        res.render('error', { message: 'Şoförler çekilirken bir hata oluştu.' });
        return;
      }

      res.render('marka-model-grafikleri', {
        depoList: depoResult,
        magazaList: magazaResult,
        aracPlakaList: aracResult,
        soforDeneyimList: soforResult
      });
    });
  });
});
});
});

app.post('/marka-model-grafikleri', (req, res) => {
// Form verilerini işleme al
const { depoAd, magazaAd, tedarikYolu, tedarikTonaj, aracPlaka, soforDeneyim } = req.body;

// İşlemleri gerçekleştir ve sonucu ekrana gönder
res.send(Depo: ${depoAd}, Mağaza: ${magazaAd}, Yol: ${tedarikYolu}, Tonaj: ${tedarikTonaj}, Araç: ${aracPlaka}, Şoför Deneyim: ${soforDeneyim});
});

*/

app.get('/marka-model-grafikleri', (req, res) => {
res.render('marka-model-grafikleri');
});

app.get('/araclar/:tedarikTonaj', (req, res) => {
const tedarikTonaj = req.params.tedarikTonaj;
const aracQuery = SELECT arac_plaka, max_ton FROM araclar WHERE max_ton >= ${tedarikTonaj};
db.query(aracQuery, (aracErr, aracResult) => {
if (aracErr) {
console.error('Araçlar çekilirken bir hata oluştu:', aracErr);
res.status(500).json({ error: 'Araçlar çekilirken bir hata oluştu.' });
} else {
const filteredAracList = aracResult.map(arac => ({ arac_plaka: arac.arac_plaka }));
res.json(filteredAracList);
}
});
});

app.get('/aracgrafikleri', (req, res) => {
// Veritabanından araç plakalarını al
const query = 'SELECT arac_plaka FROM araclar';
db.query(query, (err, result) => {
if (err) {
console.error('Araç plakalarını çekerken bir hata oluştu:', err);
res.render('aracgrafikleri', { aracPlakalari: [] });
} else {
const aracPlakalari = result.map(item => item.arac_plaka);
res.render('aracgrafikleri', { aracPlakalari });
}
});
});

app.post('/aracgrafikleri', (req, res) => {
const { aracPlaka, aracKilometre } = req.body;

// Araç plakası ve kilometreyi kullanarak veritabanını güncelle
const updateQuery = 'UPDATE araclar SET kat_edilen_km = kat_edilen_km + ? WHERE arac_plaka = ?';
db.query(updateQuery, [aracKilometre, aracPlaka], (updateErr, updateResult) => {
if (updateErr) {
console.error('Veritabanını güncellerken bir hata oluştu:', updateErr);
res.redirect('/aracgrafikleri'); // Hata durumunda aynı sayfaya yönlendir
} else {
console.log('Veritabanı başarıyla güncellendi');
res.redirect('/aracgrafikleri'); // İşlem başarılıysa aynı sayfaya yönlendir
}
});
});

/* SADECE TEDARİK TONAJINI ÇALIŞTIRABİLEN KOD AMA HEPSİ BİRARADA!!!!!!!!!!!!!!!!!!!!!!!!!!!1

app.get('/marka-model-grafikleri', (req, res) => {
// Veritabanından araç plakalarını al
const query = 'SELECT arac_plaka FROM araclar';
db.query(query, (err, result) => {
if (err) {
console.error('Araç plakalarını çekerken bir hata oluştu:', err);
res.render('marka-model-grafikleri', { aracPlakalari: [] });
} else {
const aracPlakalari = result.map(item => item.arac_plaka);
res.render('marka-model-grafikleri', { aracPlakalari });
}
});
});

app.post('/marka-model-grafikleri', (req, res) => {
const { aracPlaka, aracKilometre, ilk, ikinci, üçüncü } = req.body;

if (ilk) {
// 'ilk' butonuna tıklanmışsa yapılacak işlemler
// Araç plakası ve kilometreyi kullanarak veritabanını güncelle
const updateQuery = 'UPDATE araclar SET kat_edilen_km = kat_edilen_km + ? WHERE arac_plaka = ?';
db.query(updateQuery, [aracKilometre, aracPlaka], (updateErr, updateResult) => {
if (updateErr) {
console.error('Veritabanını güncellerken bir hata oluştu:', updateErr);
res.redirect('/marka-model-grafikleri'); // Hata durumunda aynı sayfaya yönlendir
} else {
console.log('Veritabanı başarıyla güncellendi');
res.redirect('/marka-model-grafikleri'); // İşlem başarılıysa aynı sayfaya yönlendir
}
});
} else if (ikinci) {
// 'ikinci' butonuna tıklanmışsa yapılacak işlemler
// Diğer işlemler...
} else if (üçüncü) {
// 'üçüncü' butonuna tıklanmışsa yapılacak işlemler
// Diğer işlemler...
}
});

app.get('/araclar/:tedarikTonaj', (req, res) => {
const tedarikTonaj = req.params.tedarikTonaj;
const aracQuery = SELECT arac_plaka, max_ton FROM araclar WHERE max_ton >= ${tedarikTonaj};
db.query(aracQuery, (aracErr, aracResult) => {
if (aracErr) {
console.error('Araçlar çekilirken bir hata oluştu:', aracErr);
res.status(500).json({ error: 'Araçlar çekilirken bir hata oluştu.' });
} else {
const filteredAracList = aracResult.map(arac => ({ arac_plaka: arac.arac_plaka }));
res.json(filteredAracList);
}
});
});

*/

/GRAFİK KODLARI!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.get('/gostergeler', (req, res) => {
const query = 'SELECT arac_plaka, kat_edilen_km FROM araclar';
db.query(query, (err, result) => {
if (err) {
console.error('Veri çekme hatası:', err);
res.send('Veri çekme hatası');
} else {
res.render('gostergeler', { data: Array.from(result) });
}
});
});
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!/

// Veritabanından Mağaza Adları

/*!!!!!!!!!!!!!!!!!!!!!!!!!!!EN SON BU !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.get('/gostergeler', (req, res) => {
const query = 'SELECT arac_plaka, kat_edilen_km FROM araclar';
db.query(query, (err, result) => {
if (err) {
console.error('Veri çekme hatası:', err);
res.send('Veri çekme hatası');
} else {
res.render('gostergeler', { data: Array.from(result) });
}
});
});

app.get('/araclar-ekle', (req, res) => {
res.render('araclar-ekle');
});

app.post('/araclar-ekle', (req, res) => {
const { arac_id, arac_plaka, magaza_id, km_basina_yakit, model_id, kat_edilen_km, min_ton, max_ton } = req.body;

// Yeni sütunları ekledik
const query = 'INSERT INTO araclar (arac_id, arac_plaka, magaza_id, km_basina_yakit, model_id, kat_edilen_km, min_ton, max_ton) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

// Veritabanına ekleme işlemi
db.query(query, [arac_id, arac_plaka, magaza_id, km_basina_yakit, model_id, kat_edilen_km, min_ton, max_ton], (err, result) => {
if (err) {
console.error('Veri ekleme hatası:', err);
res.send('Veri ekleme hatası');
} else {
console.log('Veri başarıyla eklendi');
res.redirect('/gostergeler');
}
});
});
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!EN SON BU!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/

app.get('/gostergeler', (req, res) => {
const queryAraclar = 'SELECT arac_plaka, kat_edilen_km FROM araclar';
db.query(queryAraclar, (errAraclar, resultAraclar) => {
if (errAraclar) {
console.error('Araç verileri çekme hatası:', errAraclar);
res.send('Araç verileri çekme hatası');
} else {
const queryMagazalar = 'SELECT magaza_id, magaza_ad FROM magazalar';
db.query(queryMagazalar, (errMagazalar, resultMagazalar) => {
if (errMagazalar) {
console.error('Mağaza verileri çekme hatası:', errMagazalar);
res.send('Mağaza verileri çekme hatası');
} else {
const queryModeller = 'SELECT model_id, model_ad FROM modeller';
db.query(queryModeller, (errModeller, resultModeller) => {
if (errModeller) {
console.error('Model verileri çekme hatası:', errModeller);
res.send('Model verileri çekme hatası');
} else {
res.render('gostergeler', {
dataAraclar: Array.from(resultAraclar),
dataMagazalar: Array.from(resultMagazalar),
dataModeller: Array.from(resultModeller),
});
}
});
}
});
}
});
});

app.get('/araclar-ekle', (req, res) => {
res.render('araclar-ekle');
});

app.post('/araclar-ekle', (req, res) => {
const { arac_id, arac_plaka, magaza_id, km_basina_yakit, model_id, kat_edilen_km, min_ton, max_ton } = req.body;

const query = 'INSERT INTO araclar (arac_id, arac_plaka, magaza_id, km_basina_yakit, model_id, kat_edilen_km, min_ton, max_ton) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

db.query(query, [arac_id, arac_plaka, magaza_id, km_basina_yakit, model_id, kat_edilen_km, min_ton, max_ton], (err, result) => {
if (err) {
console.error('Veri ekleme hatası:', err);
res.send('Veri ekleme hatası');
} else {
console.log('Veri başarıyla eklendi');
res.redirect('/gostergeler');
}
});
});

/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!! SAAT 16.53 İTİBARİYLE EN SON BUNU TARİH 18 ARALIK
app.get('/gostergeler', (req, res) => {
const queryAraclar = 'SELECT arac_plaka, kat_edilen_km FROM araclar';
db.query(queryAraclar, (errAraclar, resultAraclar) => {
if (errAraclar) {
console.error('Araç verileri çekme hatası:', errAraclar);
res.send('Araç verileri çekme hatası');
} else {
const queryMagazalar = 'SELECT magaza_id, magaza_ad FROM magazalar';
db.query(queryMagazalar, (errMagazalar, resultMagazalar) => {
if (errMagazalar) {
console.error('Mağaza verileri çekme hatası:', errMagazalar);
res.send('Mağaza verileri çekme hatası');
} else {
res.render('gostergeler', {
dataAraclar: Array.from(resultAraclar),
dataMagazalar: Array.from(resultMagazalar),
});
}
});
}
});
});

app.get('/araclar-ekle', (req, res) => {
res.render('araclar-ekle');
});

app.post('/araclar-ekle', (req, res) => {
const { arac_id, arac_plaka, magaza_id, km_basina_yakit, model_id, kat_edilen_km, min_ton, max_ton } = req.body;

const query = 'INSERT INTO araclar (arac_id, arac_plaka, magaza_id, km_basina_yakit, model_id, kat_edilen_km, min_ton, max_ton) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

db.query(query, [arac_id, arac_plaka, magaza_id, km_basina_yakit, model_id, kat_edilen_km, min_ton, max_ton], (err, result) => {
if (err) {
console.error('Veri ekleme hatası:', err);
res.send('Veri ekleme hatası');
} else {
console.log('Veri başarıyla eklendi');
res.redirect('/gostergeler');
}
});
});

!!!!!!!!!!!!!!!!!!!!!!!!!!!!! SAAT 16.53 İTİBARİYLE EN SON BUNU TARİH 18 ARALIK*/

/*

app.get('/marka-model-grafikleri', (req, res) => {
// Veritabanından araç plakalarını al
const query = 'SELECT arac_plaka FROM araclar';
db.query(query, (err, result) => {
if (err) {
console.error('Araç plakalarını çekerken bir hata oluştu:', err);
res.render('marka-model-grafikleri', { aracPlakalari: [] });
} else {
const aracPlakalari = result.map(item => item.arac_plaka);
res.render('marka-model-grafikleri', { aracPlakalari });
}
});
});

app.post('/marka-model-grafikleri', (req, res) => {
const { aracPlaka, aracKilometre, ilk, ikinci, üçüncü } = req.body;

if (ilk) {
// 'ilk' butonuna tıklanmışsa yapılacak işlemler
// Araç plakası ve kilometreyi kullanarak veritabanını güncelle
const updateQuery = 'UPDATE araclar SET kat_edilen_km = kat_edilen_km + ? WHERE arac_plaka = ?';
db.query(updateQuery, [aracKilometre, aracPlaka], (updateErr, updateResult) => {
if (updateErr) {
console.error('Veritabanını güncellerken bir hata oluştu:', updateErr);
res.redirect('/marka-model-grafikleri'); // Hata durumunda aynı sayfaya yönlendir
} else {
console.log('Veritabanı başarıyla güncellendi');
res.redirect('/marka-model-grafikleri'); // İşlem başarılıysa aynı sayfaya yönlendir
}
});
} else if (ikinci) {
// 'ikinci' butonuna tıklanmışsa yapılacak işlemler
// Diğer işlemler...
} else if (üçüncü) {
// 'üçüncü' butonuna tıklanmışsa yapılacak işlemler
// Diğer işlemler...
}
});

app.get('/araclar/:tedarikTonaj', (req, res) => {
const tedarikTonaj = req.params.tedarikTonaj;
const aracQuery = SELECT arac_plaka, max_ton FROM araclar WHERE max_ton >= ${tedarikTonaj};
db.query(aracQuery, (aracErr, aracResult) => {
if (aracErr) {
console.error('Araçlar çekilirken bir hata oluştu:', aracErr);
res.status(500).json({ error: 'Araçlar çekilirken bir hata oluştu.' });
} else {
const filteredAracList = aracResult.map(arac => ({ arac_plaka: arac.arac_plaka }));
res.json(filteredAracList);
}
});
});

*/

/*HEPSİNİ BİR ARADA TUTAN !!!!!!!!!!!!!!!!!!!!!!!!

app.get('/marka-model-grafikleri', (req, res) => {
// Veritabanından araç plakalarını al
const query = 'SELECT arac_plaka FROM araclar';
db.query(query, (err, result) => {
if (err) {
console.error('Araç plakalarını çekerken bir hata oluştu:', err);
res.render('marka-model-grafikleri', { aracPlakalari: [] });
} else {
const aracPlakalari = result.map(item => item.arac_plaka);
res.render('marka-model-grafikleri', { aracPlakalari });
}
});
});

app.post('/marka-model-grafikleri', (req, res) => {
const { aracPlaka, aracKilometre } = req.body;

// Araç plakası ve kilometreyi kullanarak veritabanını güncelle
const updateQuery = 'UPDATE araclar SET kat_edilen_km = kat_edilen_km + ? WHERE arac_plaka = ?';
db.query(updateQuery, [aracKilometre, aracPlaka], (updateErr, updateResult) => {
if (updateErr) {
console.error('Veritabanını güncellerken bir hata oluştu:', updateErr);
res.redirect('/marka-model-grafikleri'); // Hata durumunda aynı sayfaya yönlendir
} else {
console.log('Veritabanı başarıyla güncellendi');
res.redirect('/marka-model-grafikleri'); // İşlem başarılıysa aynı sayfaya yönlendir
}
});
});

app.get('/araclar/:tedarikTonaj', (req, res) => {
const tedarikTonaj = req.params.tedarikTonaj;
const aracQuery = SELECT arac_plaka, max_ton FROM araclar WHERE max_ton >= ${tedarikTonaj};
db.query(aracQuery, (aracErr, aracResult) => {
if (aracErr) {
console.error('Araçlar çekilirken bir hata oluştu:', aracErr);
res.status(500).json({ error: 'Araçlar çekilirken bir hata oluştu.' });
} else {
const filteredAracList = aracResult.map(arac => ({ arac_plaka: arac.arac_plaka }));
res.json(filteredAracList);
}
});
});

*/

/*

app.get('/marka-model-grafikleri', (req, res) => {
// Veritabanından araç plakalarını al
const query = 'SELECT arac_plaka FROM araclar';
db.query(query, (err, result) => {
if (err) {
console.error('Araç plakalarını çekerken bir hata oluştu:', err);
res.render('marka-model-grafikleri', { aracPlakalari: [] });
} else {
const aracPlakalari = result.map(item => item.arac_plaka);
res.render('marka-model-grafikleri', { aracPlakalari });
}
});
});

app.post('/marka-model-grafikleri', (req, res) => {
const { aracPlaka, aracKilometre } = req.body;

// Araç plakası ve kilometreyi kullanarak veritabanını güncelle
const updateQuery = 'UPDATE araclar SET kat_edilen_km = kat_edilen_km + ? WHERE arac_plaka = ?';
db.query(updateQuery, [aracKilometre, aracPlaka], (updateErr, updateResult) => {
if (updateErr) {
console.error('Veritabanını güncellerken bir hata oluştu:', updateErr);
res.redirect('/marka-model-grafikleri'); // Hata durumunda aynı sayfaya yönlendir
} else {
console.log('Veritabanı başarıyla güncellendi');
res.redirect('/marka-model-grafikleri'); // İşlem başarılıysa aynı sayfaya yönlendir
}
});
});

*/

/*

app.get('/aracgrafikleri', (req, res) => {
// Veritabanından araç plakalarını al
const query = 'SELECT arac_plaka FROM araclar';
db.query(query, (err, result) => {
if (err) {
console.error('Araç plakalarını çekerken bir hata oluştu:', err);
res.render('aracgrafikleri', { aracPlakalari: [] });
} else {
const aracPlakalari = result.map(item => item.arac_plaka);
res.render('aracgrafikleri', { aracPlakalari });
}
});
});

app.post('/aracgrafikleri', (req, res) => {
const { aracPlaka, aracKilometre } = req.body;

// Burada araç plakası ve kilometreyi kullanarak veritabanını güncelleyeceksiniz
// Güncelleme işlemleri burada gerçekleştirilmeli

// İşlem tamamlandıktan sonra kullanıcıyı başka bir sayfaya yönlendirin
res.redirect('/aracgrafikleri');
});

*/

app.listen(port, () => {
console.log(Server listening at http://localhost:${port});
});