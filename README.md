#HTML elementide optimeeritud animatsioonid

Bakalaureusetöö raames tehtud rakendus testimaks erinevate metoodikatega HTML elementide animatsioonide esitlusjõudlust.

Rakenduse ülesseadmisel on eeldatud, et kasutajal on installeeritud Git ning Node.js

Üles seadmiseks on vaja jooksutada järgnevad sammud käsurealt:
```sh
npm install bower -g
git clone https://github.com/manuelvulp/html-elementide-optimeeritud-animatsioonid
cd html-elementide-optimeeritud-animatsioonid
bower install
```
Edasi tuleks võtta lahti rakenduse juurkataloogis asuv index.html fail. Selleks sobivad pea kõik serverid. Kui server on puudu siis kindel töötav lahendus on http-server. Selle installeerimiseks tuleb jooksutada käsurealt
```sh
npm install http-server -g
```
Edasi tuleb rakenduse juurkataloogis jooksutada käsurealt
```sh
http-server
```
See tekitab Node.js serveri, mis jookseb vaikimisi aadressil http://localhost:8080