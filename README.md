# Autorzy
Paweł Rogóż 318714\
Milan Wróblewski 313611\
Projekt jest adapracją symulacji płynów stworzonej przez tenMinutePhysics:
[oryginał](tenMinutePhysics/17-fluidSim.html)

# Obsługa programu
## Krok 1. Pobranie repozytorium
```sh
git clone [https://gitlab-stud.elka.pw.edu.pl/mwroblew/fo-hospital-airflow.git](https://github.com/Saremist/Hospital-Airflow.git)
```
## Krok 2. Uruchomienie programu
Korzystając z rozrzerzenia liveserver do vscode umozliwić przeglądarce na dostęp do przygoptowanej aplikacji pod adresem localhost

# Dodawanie obrazów
Aplikacja umożliwia dynamiczne dodawanie obrazów i ich wybór przy użyciu slidera w lewym górnym rogu strony
## Wymagania
Aby aplikacja uznała dany piksel za przeszkodę, musi być on w kolorze niebieskim (0,0,255)\
Preferowany format pliku: **png**\
Preferowane wymiary pliku: **1600x900**
## Umieszczenie pliku
Utworzony plik należy umieścić w folderze **pngs**\
Należy również dodać następujący kod w pliku **main.js**
```JavaScript
case X: //X -> liczba, zgodnie z którą będzie wyświetlany obraz
    img.src = "./pngs/nazwa_pliku.png"; //nazwa_pliku -> nazwa wgranego obrazu
    break;
```


![Przykład 1](examples/hospital_smoke.png)
![Przykład 2](examples/mieszkanie_smoke2.png)
![Przykład 3.1](examples/tesla_closed.png)
![Przykład 3.2](examples/tesla_open.png)
![Przykład 4](examples/vortex_sheading.png)
![Przykład 5.1](examples/wing_smoke.png)
![Przykład 5.2](examples/wing_pressure.png)
