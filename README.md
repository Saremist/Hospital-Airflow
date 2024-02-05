# Autorzy
Paweł Rogóż 318714\
Milan Wróblewski 313611

# Obsługa programu
## Krok 1. Pobranie repozytorium
```sh
git clone [https://gitlab-stud.elka.pw.edu.pl/mwroblew/fo-hospital-airflow.git](https://github.com/Saremist/Hospital-Airflow.git)
```
## Krok 2. Uruchomienie programu
Otworzenie pliku index.html w przeglądarce internetowej

# Dodawanie obrazów
Aplikacja umożliwia dynamiczne dodawanie obrazów i ich wybór przy użyciu slidera w lewym górnym rogu strony
## Wymagania
Aby aplikacja uznała dany piksel za przeszkodę, musi być on w kolorze niebieskim (0,0,255)\
Preferowany format pliku: **png**\
Preferowane wymiary pliku: **1600x900**
## Umieszczenie pliku
Utworzony plik należy umieścić w folderze **pngs**\
Należy również dodać następujący kod w pliku **main.js**
```sh
case X: //X -> liczba, zgodnie z którą będzie wyświetlany obraz
    img.src = "./pngs/nazwa_pliku.png"; //nazwa_pliku -> nazwa wgranego obrazu
    break;
```
# Dodane obrazy
## tesla.png
Plik obrazujący działanie zaworu tesli
## hospital.png
Plik przedstawia jeden z pawilonów w Szpitalu Bocheńskim
