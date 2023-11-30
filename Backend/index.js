//http szerver létrehozása
const express = require('express');
const app = express();
//Kéréseink más domainekről is elfogadhatóak legyenek
const cors = require('cors');
//
const fs = require('fs');
//JSON alapú http kérések feldolgozása
app.use(express.json());
//Más domainről származó kliens kéréseinek fogadása, válaszolása
app.use(cors());
//http kérések testének (body) feldolgozása --- 'body-parser' már az 'express' beépített része
app.use(express.urlencoded({ extended: false }));


//Adatbázis elérése
const mysql = require('mysql');
const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tagdij'
});
database.connect((err) => {
    if (err) throw err;
    console.log("Sikeres kapcsolódás!");
});


// Ezen keresztül elérheted a kliensoldali fájlokat (pl. .html, .css, .js) a 'Frontend' könyvtárból
app.use('/Frontend', express.static('Frontend'));

// Az összes ügyfél lekérdezése
app.get('/osszesUgyfel', (req, res) => {
    let osszesUgyfel = 'SELECT * FROM `ugyfel`';

    database.query(osszesUgyfel, (err, rows) => {
        if (err) {
            throw err;
        }

        console.log('Lekérdezett sorok:', rows);

        const tableRows = rows.map(row => {
            return `
                <tr>
                    <td>${row.azon}</td>
                    <td>${row.nev}</td>
                    <td>${row.szulev}</td>
                    <td>${row.irszam}</td>
                    <td>${row.orsz}</td>
                </tr>
            `;
        }).join('');

        res.send(tableRows); // Csak az ügyfelek táblázatát küldjük vissza
    });
});
// Kliensoldali kód (pl. index.html)
fetch('http://127.0.0.1:5500/Frontend/osszesUgyfel.html')
    .then(response => response.text())
    .then(data => {
        // Itt manipulálhatod a kliensoldali tartalmat, például feltöltheted a táblázatot az adatokkal
        document.getElementById('tableBody').innerHTML = data;
    })
    .catch(error => console.error('Hiba történt:', error));





//Port
const port = 3000;
app.listen(port, () =>{
    console.log(`A szerver fut a ${port} porton.`);
});