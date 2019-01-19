//predkosc pojazdu
var speed=0;
//krok anipacji
var step;
//czas sluzacy do badania
var timeStart;
var timeEnd;
var timeAnimation = 20;
var timeInAnimation=1;
//jest jelen lub nie
var deer=false;
//rozgrywka w czasie rzeczywistym
var game = false;
//Czy pojazd hamuje
var brake = false;
//czas do zderzenia z jeleniem obliczony z predkosci
var timeToDeer;
//interwal sprawdzenia odleglosci do jelenia
var tick = 50;
//wyniki predkosci- do wykorzystania w wersji rozwinietej
var score = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
//osiagniety poziom
var level=0;


function AnimationMove()
{   
    function BorderSet(path) {
        var elements = document.getElementsByClassName("view-border");
        for (i = 0; i < elements.length; i++) {
            elements.item(i).src = path;
    }}
    function Move(){
        if(step)step=false;
        else step=true;
    }

    //poczatek
    step=true;
    time=0;
    //odswierzenie widoku
    setInterval(function AnimationPicture(){
        if(game)  
        if(step)
            BorderSet("Images/tree2.png");  
        else
            BorderSet("Images/tree.png");  
    }, timeAnimation/2);
    //animacja
    setInterval(function AnimationMove(){
        if (timeInAnimation <= 0) {
            timeInAnimation =200-speed;
            Move();
        }
        timeInAnimation -= timeAnimation;
    },timeAnimation+1);
   
}
window.onload = AnimationMove;

//Rozpoczecie testu
function Drive() {
    if (!game)
    {
        //nowy test
        Test(60+(20*level));
        
    }	
}
 
//Test predkosci
function Test(testSpeed) {
    //rozpoczecie
    game = true;
    deer = false;
    speed = 1;
    //czas do zderzenia zalezny od predkosci
	timeToDeer =1000*100/(testSpeed/3.6);
	//auto przyspiesza
    SpeedUp(testSpeed);
    
	//Pseudolosowy czas pojawienia sie jelenia na drodze
	var timeDeer = randomTimer = Math.floor(Math.random() * 5000 + 5000*(testSpeed/60));
	//pojawienie sie jelenia do ustalonym czasie
	setTimeout(function ShowDeer()
	{   //ustawienie jelenia na drodze
        document.getElementById("deer").src = "Images/deer.png";
        //rozpoczecie pomiaru czasu zatrzymania
		timeStart = new Date().getTime();
        deer = true;
        //sprawdzanie polozenia
		setTimeout(function Tick()
		{
			//czas upłynął
            timeToDeer -= tick;
            //Czy pojazd zatrzymany
			if (speed == 0)
                Succes(30);
            //Czy nastąpiło zderzenie
			else if (timeToDeer <= 0)
                Fail(30);
            //Kolejne sprawdzenie
			else
				setTimeout(Tick, tick);						
		}, tick);	
	}, timeDeer);
	
}

//Rozpedzenie pojazdu do zadanej predkosci
function SpeedUp(setSpeed) {
	//Zwiekszenie pradkosci pojazu po czasie
    
    
        setTimeout(function run() {
            //Spowolnienie auta
            speed += 1;
            //Ustawienie predkosci na stronie
            SetSpeed();
            //Czy ma dalej zwalniac
            if (speed < setSpeed && game && !deer && !brake)
                setTimeout(run, 100);
        }, 100);
    		
}	
//Zatrzymanie pojazdu
function Brake() {
    
    if (!deer) {
        alert("za wczesnie");
    } else {
        //Rozpoczecie hamowania
        brake = true;
        if (speed > 0)
            setTimeout(function run() {
                //Spowolnienie auta
                speed -= 5;
                //Ustawienie predkosci na stronie
                SetSpeed();
                //Czy ma dalej zwalniac
                if (speed > 0 && game)
                    setTimeout(run, 100);
            }, 100);
    }
}
//Ustawienie predkosci auta na stronie
function SetSpeed() {
    //Korekta dla bezpieczenstwa
    if (speed < 0) speed = 0;
    
    //Ustawienie
	document.getElementById('speed').innerHTML = speed + ' km/h';
}
//Udalo sie uniknac kolizji
function Succes(speedTested) {
	//koniec pomiaru czasu
    timeEnd = new Date().getTime();
    //reset ustawien
    game = false;
    brake = false;
    speed = 0;
    //Ustawienie predkosci na stronie
    SetSpeed();
    //Dodanie wyniku do tabeli
    score[level] = timeEnd - timeStart;
    UpdateTable();
    //Nastepny poziom
    level++;
    //Komunikat
    alert("Succes, deer is alive");
    //usuniecie jelenia
    deer = false;
    document.getElementById("deer").src = "Images/road_sun.png";
}
//Nie udalo sie uniknac kolizji
function Fail() {
    //reset ustawien
    game = false;
    brake = false;
    speed = 0;
    //Ustawienie predkosci na stronie
    SetSpeed();
    //Komunikat
    alert("Ups! You killed a deer");
    //usuniecie jelenia
    deer = false;
    document.getElementById("deer").src = "Images/road_sun.png";
}
//Aktualizowanie tabeli
function UpdateTable() {
	//Dodanie nowegu wyniuku do tabeli
	document.getElementById("timesTable").innerHTML +=
        '<tr>' +
        //Predkosc
        '<td> ' + (60 + (20 * level)) + ' </td>' +
        //Czas zatrzymania
		'<td> ' + (timeEnd-timeStart) + ' ms </td>' +
		'</tr>';	
}
