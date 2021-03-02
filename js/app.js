
let bodyHtml = document.querySelector('body');
let container = document.querySelector('.container')
let topSection = document.querySelector('.top-section')
let secondSection = document.querySelector('.second-section')
let cardContent = document.querySelector('.card-content')
let easyGame = document.getElementById('16K');
let hardGame = document.getElementById('32K');
let subjectValue = document.querySelector('.subject-value');
let starrBtn = document.querySelector('.start-btn')
let warningMessage = document.querySelector('.warning-message')
let popUp = document.querySelector('.third-section')
let playAgain = document.querySelector('.playagain-btn');
let loading = document.querySelector('.loading');
let resetBtn = document.querySelector('.restart-btn');
let scoreContainer = document.querySelector('.score-container');

/*  Här för att hämta kort antal och ämnet på kort  */
let Gamesubject, GameLevel;
let choseLevelAndSubject = new Promise(function (resolve) {
    starrBtn.addEventListener('click', function (event) {
        event.preventDefault();
        Gamesubject = (subjectValue.value).trim();
        if (Gamesubject.length && (easyGame.checked || hardGame.checked)) {
            if (easyGame.checked) {
                GameLevel = easyGame.value; /* Original value  : easyGame.value */
                /* Change value här om du vill ha mindre kort for easy */
            }
            if (hardGame.checked) {
                GameLevel = hardGame.value;  /* Original value  : hardGame.value */
                /* Change value här om du vill ha mindre kort for hard */
                cardContent.style.gridTemplateColumns = 'repeat(8, 1fr)';
                container.style.width = '1240px';
            }
            subjectValue.value = ''
            warningMessage.style.display = 'none';
            resolve();
        }
        else { warningMessage.style.display = 'block' };
    }
    )
})

/*  Här fitchar vi länken för flickr och skapa object for img länken */
let arrayPhoto = [];
let bildUrlforApi = async function () {
    await choseLevelAndSubject;
    console.log(1);
    loading.style.display = 'block';
    console.log(loading);
    topSection.style.visibility = "hidden";
    topSection.style.Width = "0";
    topSection.style.height = "0";

    secondSection.style.visibility = "visible";
    let searchWord = Gamesubject;
    let apiKey = '9588ff16cc05d4e98bcb23ab4b518b05'
    let url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&text=${searchWord}&sort=relevance&safe_search=1&per_page=500&format=json&nojsoncallback=1
 `;
    let fetchLink = fetch(url).then(function (responsiv) {
        return responsiv.json(url);
    });



    await fetchLink.then(function (data) {
        for (let i = 0; i <= 498; i++) {/*  498 - 24 yes!*/ /* vi kör med nummret 498 fär att vi vill att komma varja gång nya bilder för spelet */
            let photosData = function () {
                this.PhotoServer = data.photos.photo[i].server;
                this.PhotoId = data.photos.photo[i].id;
                this.PhotoSecret = data.photos.photo[i].secret;
                this.PhotoSize = 'q';
                this.photoLink = `https://live.staticflickr.com/${this.PhotoServer}/${this.PhotoId}_${this.PhotoSecret}_${this.PhotoSize}.jpg`;
            }
            let thePhoto = new photosData().photoLink;
            arrayPhoto.push(thePhoto);
        }
    }).catch(error => {
        console.log('error', error)
    });
}

// 

/*  ArrayforAllImg kommer vara det sista array där finns bilderna blandade redan på ett rätt sätt  */
let ArrayforAllImg = [];

/*  Denna function för att blandar img så att bli bara två samma img på spelet som hamnar på ett random plats varje gång  */
async function addPhotoTArray() {
    await bildUrlforApi();
    console.log(2)

    loading.style.display = 'none';
    resetBtn.style.display = 'block';
    scoreContainer.style.display = 'flex';

    let photoHtml, theImageRa, randomNumber;
    let ramdomImageArray = []; /* Här ska vi samla unika bilder varja gång från data (halften av kort antal) */
    let duplicateForImageArray = [];
    let kortantal = (GameLevel / 2);
    while (ramdomImageArray.length < kortantal) {
        randomNumber = Math.floor(Math.random() * 499);/* 499 - för att få random nummer img också från de 498 img vi hämtade fr¨ån api*/
        theImageRa = arrayPhoto[randomNumber];  /* Här hämtar vi en random img av arrayPhoto som har 500 bilder vi hämtade från api */
        if (ramdomImageArray.indexOf(theImageRa) === -1) {  /* Här för att kolla om bilden är unik (ny) så lägger vi till den till de andra array vi behöver */
            ramdomImageArray.push(theImageRa);
            ArrayforAllImg.push(theImageRa);
            photoHtml = document.createElement('img');
            photoHtml.src = theImageRa;
        }
    }
    while (duplicateForImageArray.length < kortantal) {     /*  här för att duplicerar de unika bilder vi fick i ramdomImageArray
        och sedan lägger vi till den till de andra array vi behöver   */
        randomNumber = Math.floor(Math.random() * kortantal);
        theImageRa = ramdomImageArray[randomNumber];
        if (duplicateForImageArray.indexOf(theImageRa) === -1) {
            duplicateForImageArray.push(theImageRa);
            ArrayforAllImg.push(theImageRa);
            photoHtml = document.createElement('img');
            photoHtml.src = theImageRa;
        }
    }
}




// Denna async function  för att skapa addEventListener för kort och varje bild och för att matcha kort och vända om dem 

// -------------------------------------


/* Denna funktion för att skapa en unik id för varje img */
let unikIdforImg = [];
function skapaIDFörimg() {
    for (let i = 0; i < ArrayforAllImg.length; i++) {
        unikIdforImg.push(i + ArrayforAllImg[i])
    }
}
// -------------------------------------



let comparecartFunctoin = function () {

    let compareArray = []; /* för att jämfor varje gång länken för de två img som vi öpnnar i spelet */
    let img;
    let tempCompare = []; /* för att koden kommer ihåg vad hade vi för I nummer när vi öppnade kortet */
    let tempCompareForUnik = []; /* (vi behövde den för att jämfor om vi har en unik img, så spelaren får inte trycka på samma kort två gågner */
    skapaImgElementiArray()
    let imgElement = document.querySelectorAll('.img-element')
    skapaEvenetFörKort()
    // ------------------------------------
    /* För att skapa och lägga till class och appendChild  */
    function skapaImgElementiArray() {
        console.log(GameLevel)
        for (let i = 0; i <= (GameLevel - 1); i++) {
            img = document.createElement('img');
            img.src = "/img/memorycard.png"  /* för att lägger till PNG img för kort */
            img.classList.add('img-element');
            cardContent.appendChild(img);

        }

    }

    /* för att skapa addEventListener för varje kort */

    function skapaEvenetFörKort() {
        for (let i = 0; i <= (GameLevel - 1); i++) {   /*GameLevel lika med antalt kort vi har*/
            imgElement[i].addEventListener('click', matchakort)
            function matchakort() {
                if (tempCompareForUnik.indexOf(unikIdforImg[i]) == -1) {   /* vi kollar om bilden är helt unik */
                    mindraÄnTvåBilder();
                    tempCompareForUnik.push(unikIdforImg[i])
                }

                function mindraÄnTvåBilder() {
                    if (compareArray.length < 2) {      /*  Vi kollar om vi har mindra än två url (kort) i compareArray som är tomt */
                        if (compareArray.indexOf(ArrayforAllImg[i]) === -1) { /*  vi kollar om den url som vi fick först från ArrayforAllImg-(där har vi redan bilderna blandade)- inte finns redan i compareArray, */
                            imgElement[i].classList.add('testflip'); /* denna class för att göra transform för kort */
                            imgElement[i].src = ArrayforAllImg[i];
                            tempCompare.push([i]);     /* För att hålla koll på vilket värde här (I) */
                            compareArray.push(ArrayforAllImg[i]); /* lägger till vi den img till compareArray*/

                            // när vi köra detta process igen för nästa kort ,
                            // då om det nya url inte finns i compareArray så det betyder att de är olika kort ,
                            // annars om det nya url finns redan då betyder det att de två url (kort) är lika .
                            tvåOlikaBilder();
                        } else {
                            tvålikaBilder()
                        }
                    }
                }

                function tvåOlikaBilder() {
                    /* Vi kollar om  compareArray har två olika kort med olika url så vänder vi kort igen om 2000s */

                    if (compareArray.length == 2) {
                        bodyHtml.style.background = 'red';
                        setTimeout(
                            function () {
                                subtractScore();  /* för att subtract Score när det är olika kort*/
                                imgElement[tempCompare[0]].classList.remove('testflip');
                                imgElement[tempCompare[1]].classList.remove('testflip');
                                imgElement[tempCompare[0]].src = "/img/memorycard.png"
                                imgElement[tempCompare[1]].src = "/img/memorycard.png"
                                /* Här behöver vi tomma array efter vi var klara med den */
                                tempCompare = [];
                                compareArray = [];
                                tempCompareForUnik = [];
                                bodyHtml.style.background = '#1abc9c';
                            }, 2000
                        );
                    }
                }
                function tvålikaBilder() {
                    /* Här vet vi redam från förra function (mindraÄnTvåBilder) att det nya url finns readan i compareArray,
                          och det betyder att det två url är lika. */
                    tempCompare.push([i]);
                    compareArray.push(ArrayforAllImg[i]);
                    imgElement[i].src = ArrayforAllImg[i];
                    AddScore(); /* för att ha koll på score */
                    allMatched();/* för att ha koll om all kort slut */
                    behandlaDeLikaKort();
                    function behandlaDeLikaKort() {
                        setTimeout(
                            function () {
                                let imgFixat1;
                                let imgFixat2;
                                /* Vi kommer skapa två nya kort exakt samma de som var lika och lägga de på samma plats!;
                                och sedan vi kommer ta bort de gamla två kort  */
                                imgFixat1 = document.createElement('img');
                                imgFixat2 = document.createElement('img');
                                imgFixat1.src = imgElement[tempCompare[0]].src
                                imgFixat2.src = imgElement[tempCompare[1]].src
                                imgFixat1.classList.add('img-element-fixat');
                                imgFixat2.classList.add('img-element-fixat');
                                cardContent.insertBefore(imgFixat1, cardContent.childNodes[(tempCompare[0][0]) + 1]);
                                cardContent.insertBefore(imgFixat2, cardContent.childNodes[(tempCompare[1][0]) + 1]);
                                imgElement[tempCompare[0][0]].remove();
                                imgElement[tempCompare[1][0]].remove();
                                /* Här behöver vi tomma array efter vi är klara med dem */
                                compareArray = [];
                                tempCompare = [];

                            }, 1000
                        );
                    }
                }
            }
        }
    }
}


let score = 0;
let checkFinish = 0;
let ScoreBord = document.querySelector('.pairs-title');

function AddScore() {
    score += 5;   /* vi lägger till 5 poäng när vi har matchade kort varje gång */
    checkFinish++; /* vi lägger till 1  varje gång vi har två lika kort */
    ScoreBord.textContent = 'Score : ' + score;
}


function subtractScore() {
    score -= 1;  /* vi  subtract e poäng varje gång vi har olika kort */
    ScoreBord.textContent = 'Score : ' + score;
}
// All cards matched 
function allMatched() {
    if (checkFinish === ArrayforAllImg.length / 2) {    /* on halften av antalet bilder i det array som har alla bilder är lika med checkFinishs värdet */
        let scoreMessage = document.querySelector('.score-message');
        scoreMessage.textContent = 'You finished the game and your score is : ' + score;
        popUp.style.visibility = "visible";
        secondSection.style.height = "0";
        secondSection.style.width = '0';
    }
}

/* reset knappen  */
resetBtn.addEventListener('click', function () {
    location.reload();
});

// Play again button 
playAgain.addEventListener('click', function () {    /* Play again knappen  */
    secondSection.style.visibility = 'hidden';
    secondSection.style.height = "0";
    secondSection.style.width = '0';
    popUp.style.visibility = 'hidden';
    popUp.style.height = "0";
    popUp.style.width = '0';
    location.reload();
});




/*  funktionen som stratr hela spelet */

async function startTheGame() {
    await addPhotoTArray();
    await skapaIDFörimg();
    comparecartFunctoin();
}

startTheGame()




