import { MusicPlayer } from "./MusicPlayer.js" ;

const playBtn = document.querySelector('.pause');
const timeline = document.querySelector('.timeline-bar input[type=range]');
const currentTimeElement = document.querySelector('.time-current');
const durationTimeElement = document.querySelector('.time-duration');
const arm = document.querySelector('.arm-wrapper');

const musics = [
    {
        musicFile: "DK47-Sem_final_feliz.mp3",
        albumFile: "o_contador_de_historias.jpg",
        name: "Sem final feliz",
        performer: "DK47"
    },
    {
        musicFile: "BK-Pessoas.mp3",
        albumFile: "lider_em_movimento.jpg",
        name: "Pessoas",
        performer: "BK"
    },
    {
        musicFile: "Criolo-Boca_de_lobo.mp3",
        albumFile: "boca_de_lobo.jpg",
        name: "Boca de lobo",
        performer: "Criolo"
    },
    {
        musicFile: "FBC-Nao_Duvide.mp3",
        albumFile: "nao_duvide.jpg",
        name: "Não duvide",
        performer: "FBC feat Lord"
    },
    {
        musicFile: "Ricon_Sapiencia-Ponta_de_lanca.mp3",
        albumFile: "ponta_de_lanca.jpg",
        name: "Ponta de lança",
        performer: "Ricon Sapiência"
    },
    {
        musicFile: "Ricon_Sapiencia-Tem_que_ta_veno.mp3",
        albumFile: "tem_que_ta_veno.jpg",
        name: "Tem que tá veno",
        performer: "Ricon Sapiência"
    }

];


const MyPlayer = new MusicPlayer(musics);

function setAttributesOfAudio() {
    const duration = MusicPlayer.audio.duration;
    timeline.min = 0;
    timeline.max = duration;
    timeline.defaultValue = 0;
    timeManipulation();
    durationTimeElement.innerHTML = convertSecondsToMinutes(duration);
};

MusicPlayer.audio.ondurationchange = setAttributesOfAudio;
document.addEventListener('DOMContentloaded', setAttributesOfAudio);

function handleLike(element) {
    if(!element.classList.contains('like-active'))
        element.classList.add('like-active')
    
    else
    element.classList.remove('like-active');
}

document.addEventListener('click', function(e) {
    const element = e.target;
    const classList = element.classList;
    const stateBtnPlay = playBtn.classList.contains('btn-active');

    if(classList.contains('bx-pause') || classList.contains('btx-play')) MyPlayer.handlePlayPause(element);
    if(element.id === 'like-icon') handleLike(element);
    if(element.id = 'volume-icon') MyPlayer.handleVolume(element);
    if(classList.contains('bx-skip-next')) MyPlayer.next(stateBtnPlay);
    if(classList.contains('bx-skip-previous')) MyPlayer.prev(stateBtnPlay);
});

function convertSecondsToMinutes(seconds = 0) {
    const time = new Date(seconds * 1000);
    return time.toLocaleTimeString('pt-BR', {
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'UTF'
    });
};

function timeManipulation(currentTime) {
    currentTimeElement.innerHTML = convertSecondsToMinutes(currentTime);
};

function finished() {
    playBtn.classList.remove('btn-active');
    playBtn.children[0].classList.replace('bx-pause', 'bx-play');
    MusicPlayer.audio.currentTime = 0;
    MusicPlayer.audio.pause();
    arm.classList.add('initialPosition');
};

timeline.addEventListener('input', function(e) {
    MusicPlayer.audio.currentTime = e.target.value;
});

MusicPlayer.audio.ontimeupdate = () => {
    const currentTime = parseFloat(MusicPlayer.audio.currentTime);

    timeline.value = currentTime;
    timeManipulation(currentTime);
    MyPlayer.armDisplacement(currentTime);
    MyPlayer.rotateDisc(currentTime * 10);

    if(parseInt(timeline.value) >= parseInt(timeline.max)) {
        MyPlayer.next(playBtn.classList.contains('btn-active'));
    };
};


MusicPlayer.volume.addEventListener('input', function(e) {
    const volumeIcon = e.target.nextElementSibling;
    const volumeChange = e.target.value;
    MusicPlayer.audio.volume = volumeChange;

    MyPlayer.handleVolumeIcon(volumeChange, volumeIcon);
});