/** TO-DO LIST
 * 1. Render songs
 * 2. Scroll top
 * 3. Play/ Pause/ Seek
 * 4. CS Rotate
 * 5. Next / Prev
 * 6. Repeat
 * 7. Next/ Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "QUANGHUY_PLAYER";
const player = $(".player");

// Playlist elements
const playlist = $(".playlist");
const playlistWrapper = $(".playlist__wrapper");

// Song info elements
const cd = $(".cd");
const nameSong = $(".song__name");
const singerSong = $(".song__singer");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");

// Control elements
const playBtn = $("#btn-toggle-play");
const progressBar = $(".progress__bar");
const volumeBar = $(".volume__bar");
const volumeIcon = $("#volume-icon");
const nextBtn = $("#btn-next");
const prevBtn = $("#btn-prev");
const repeatBtn = $("#btn-repeat");
const openPlaylist = $("#open-playlist");
const closePlaylist = $("#close-playlist");

// Kiểm tra trạng thái giữ chuột cho progress và volume bar
let isHoldingProgress = false;
let isHoldingVolume = false;

//Sound wave strokes -> tạo chuyển động cho song đang playing
const strokes = `
<span class = "stroke"></span>
<span class = "stroke"></span>
<span class = "stroke"></span>
<span class = "stroke"></span>
<span class = "stroke"></span>
`;

const app = {
    currentIndex: 0,
    isPlaying: false,
    isScrolled: true,
    isRandom: false,
    isRepeat: false,

    //Kiểm tra các trạng thái repeat song
    songFlowStates: ["repeat", "repeat_one", "shuffle"],
    songFlowIndex: 0,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [{
            name: "Viva La Vida",
            singer: "Cover By Rosé",
            path: "./asset/music/rose_viva_la_vida.mp3",
            image: "https://i1.sndcdn.com/artworks-X4kyxP57EHzlsX4L-aElx2Q-t500x500.jpg",
        },
        {
            name: "Gone",
            singer: "Rosé",
            path: "./asset/music/rose_gone.mp3",
            image: "https://i.scdn.co/image/ab67616d0000b273fdec91537c467efa0cd75e2f",
        },
        {
            name: "On The Ground",
            singer: "Rosé",
            path: "./asset/music/rose_on_the_ground.mp3",
            image: "https://upload.wikimedia.org/wikipedia/vi/d/d0/Ros%C3%A9%E2%80%93On_the_Ground.jpg",
        },
        {
            name: "Vì Anh Đâu Có Biết",
            singer: "Madihu ft Vũ",
            path: "./asset/music/vi_anh_dau_co_biet.mp3",
            image: "https://avatar-ex-swe.nixcdn.com/song/share/2022/08/05/a/9/1/b/1659667076562.jpg",
        },
        {
            name: "NGƯỜI ĐÁNG THƯƠNG LÀ ANH",
            singer: "OnlyC ft Nguyễn Phúc Thiện",
            path: "./asset/music/nguoi_dang_thuong_la_anh.mp3",
            image: "https://i.scdn.co/image/ab67616d00001e02d6186b7d1cd7e073469bd866",
        },
        {
            name: "NGƯỜI CÓ THƯƠNG ?",
            singer: "DATKAA",
            path: "./asset/music/datkaa_nguoi_co_thuong.mp3",
            image: "https://i.scdn.co/image/ab67616d0000b27356d43cd0de05de88ee177766",
        },
        {
            name: "CHIỀU THU HỌA BÓNG NÀNG",
            singer: "DATKAA x QT Beatz",
            path: "./asset/music/chieu_thu_hoa_bong_nang_datkaa_x_qt_beatz.mp3",
            image: "https://i.scdn.co/image/ab67616d0000b2734f3263b06756b88e8918bcaf",
        },
        {
            name: "Chán Gái 707",
            singer: "LowG",
            path: "./asset/music/chan_gai_707.mp3",
            image: "https://i.scdn.co/image/ab67616d0000b27357bd65ba8b168a6dda7936ed",
        },
        {
            name: "EM CÓ THỂ",
            singer: "OSAD x VRT",
            path: "./asset/music/em_co_the_osad_x_vrt.mp3",
            image: "https://i.scdn.co/image/ab67616d00001e024a0a30b34c7e307d1667e8dc",
        },
        {
            name: "THICHTHICH",
            singer: "PHƯƠNG LY",
            path: "./asset/music/thichthich_phuong_ly.mp3",
            image: "https://i.scdn.co/image/ab67616d00001e02ad5d0332d6438843cd287992",
        },
        {
            name: "Can't Help Falling in Love",
            singer: "Cover By Alyssa Baker",
            path: "./asset/music/can_t_help_falling_in_love_cover_by_alyssa_baker.mp3",
            image: "https://i.ytimg.com/vi/QT18QfowCFI/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBKMWs6XoRMLj0BktmNlPj2xYFKQw",
        },
        {
            name: "Runaway",
            singer: "AURORA",
            path: "./asset/music/runaway_aurora.mp3",
            image: "https://i.scdn.co/image/ab67616d0000b27365a472593611a55c50bc0f8f",
        },
        {
            name: "double take",
            singer: "dhruv",
            path: "./asset/music/double_take_dhruv.mp3",
            image: "https://i.ytimg.com/vi/lar8IBF_4II/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBE_DlB15Wxat_3llVqZX1NtAF0vw",
        },
    ],

    //Định dạng đúng form thời gian
    timerFormat: function (duration) {
        const rounded = Math.floor(duration);
        return `${
      Math.floor(rounded / 60) >= 10
        ? Math.floor(rounded / 60)
        : "0" + Math.floor(rounded / 60)
    }:${rounded % 60 >= 10 ? rounded % 60 : "0" + (rounded % 60)}`;
    },

    //set config cho localStorage để khi reload lại thì dữ liệu về repeat song vẫn trong storage
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function () {
        const htmls = this.songs.map((song) => {
            return `
             <div  class="playlist-item">
                  <div class="playlist-item__thumb"
                      style="background-image: url('${song.image}')">
                  </div>
                  <div class="playlist-item__info">
                      <h3 class="playlist-item__name">${song.name}</h3>
                      <p class="playlist-item__singer">${song.singer}</p></p>
                  </div>
                  <audio class = "playlist-duration" preload = "metadata" src = "${song.path}"></audio>
                  <div class = "wave"></div>
              </div>`;
        }); //${index === this.currentIndex?'active' : ''}" data-index = "${index}"
        playlistWrapper.innerHTML = htmls.join("");

        const playlistDurations = $$(".playlist-duration");
        const wave = $$(".wave");

        playlistDurations.forEach(function (playlistDuration, index) {
            playlistDuration.onloadedmetadata = () => {
                wave[index].innerHTML =
                    index === app.currentIndex ?
                    strokes :
                    app.timerFormat(playlistDuration.duration);
            };
        });
    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },

    //Chạy và thay đổi bài hát mọi lúc
    setchangeSong: function (newIndex) {
        $$(".wave")[this.currentIndex].innerHTML = this.timerFormat(
            $$(".playlist-duration")[this.currentIndex].duration
        );
        this.currentIndex = newIndex;
        $$(".wave")[this.currentIndex].innerHTML = strokes;
        this.loadCurrentSong();
        this.isScrolled = false;
        audio.play();
    },

    handleEvent: function () {
        const _this = this;
        // const cdWidth = cd.offsetWidth;

        //Xử lý cd quay và dừng
        const cdThumbAnimate = cdThumb.animate(
            [{
                transform: "rotate(360deg)",
            }, ], {
                duration: 10000,
                iterations: Infinity,
            }
        );
        cdThumbAnimate.pause();

        //Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        //Khi song được play
        audio.onplay = function () {
            _this.isPlaying = true;
            playBtn.innerText = "pause_circle";
            cdThumbAnimate.play();
        };

        //Khi song bi pause
        audio.onpause = function () {
            _this.isPlaying = false;
            playBtn.innerText = "play_circle";
            cdThumbAnimate.pause();
        };

        //Hiện thời gian của song
        audio.onloadedmetadata = function () {
            $("#begin").innerText = _this.timerFormat(audio.currentTime);
            $("#end").innerText = _this.timerFormat(audio.duration);
        };

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            let progressPercent = (audio.currentTime / audio.duration) * 100;
            $("#begin").innerText = _this.timerFormat(audio.currentTime);

            $(".progress").style.width = `${progressPercent}%`;
        };

        //Khi thay đổi volume
        audio.onvolumechange = function () {
            if (audio.muted) {
                volumeIcon.innerHTML = "volume_off";
            } else {
                volumeIcon.innerText =
                    audio.volume >= 0.5 ?
                    "volume_up" :
                    audio.volume < 0.05 ?
                    "volume_mute" :
                    "volume_down";
            }
            $(".volume").style.width = `${audio.volume * 100}%`;
        };

        //Xử lý open playlist
        openPlaylist.onclick = () => {
            playlist.classList.add("active");

            if (!_this.isScrolled) {
                _this.scollToPlayingSong();
            }

            _this.isScrolled = true;
        };

        // Xử lý close playlist
        closePlaylist.onclick = () => {
            playlist.classList.remove("active");
        };

        //Khi next song
        nextBtn.onclick = function () {
            if (_this.currentIndex === _this.songs.length - 1) {
                _this.setchangeSong(0);
            } else {
                _this.setchangeSong(_this.currentIndex + 1);
            }
        };

        //Khi prev song
        prevBtn.onclick = function () {
            if (_this.currentIndex == 0) {
                _this.setchangeSong(_this.songs.length - 1);
            } else {
                _this.setchangeSong(_this.currentIndex - 1);
            }
        };
        //Xử lý repeat song
        repeatBtn.onclick = function () {
            _this.songFlowIndex =
                _this.songFlowIndex + 1 > 2 ? 0 : _this.songFlowIndex + 1;
            repeatBtn.innerText = _this.songFlowStates[_this.songFlowIndex];
            if (_this.songFlowIndex === 1) {
                audio.loop = true;
            } else {
                audio.loop = false;
            }
        };

        //Xử lý next song khi audio ended
        audio.onended = function () {
            if (_this.songFlowIndex === 2) {
                _this.playRandomSong();
            } else {
                nextBtn.click();
            }
            if (playlist.classList.contains("active")) {
                _this.scollToPlayingSong();
            }
        };

        //Xử lý sự kiện click vào list bài hát
        const playlistItems = $$(".playlist-item");
        playlistItems.forEach((playlistItem, index) => {
            playlistItem.onclick = () => {
                _this.setchangeSong(index);
            };
        });

        //Mute volume
        volumeIcon.onclick = function () {
            audio.muted = !audio.muted;
        };

        //Xử lý khi tua song
        progressBar.onmousedown = function (e) {
            isHoldingProgress = true;
            const seektime = (e.offsetX / e.target.offsetWidth) * audio.duration;
            audio.currentTime = seektime;
        };
        progressBar.onmousemove = function (e) {
            if (isHoldingProgress) {
                const seektime = (e.offsetX / e.target.offsetWidth) * audio.duration;
                audio.currentTime = seektime;
            }
        };

        //Xử lý khi chỉnh volume
        volumeBar.onmousedown = function (e) {
            isHoldingVolume = true;
            const seekVolume = e.offsetX / e.target.offsetWidth;
            audio.volume = seekVolume;
        };
        
        volumeBar.onmousemove = function (e) {
            if (isHoldingVolume) {
                const seekVolume = e.offsetX / e.target.offsetWidth;
                audio.volume = seekVolume;
            }
        };

        //Mouseup event in
        window.onmouseup = function () {
            isHoldingProgress = false;
            isHoldingVolume = false;
        };

        // Điều chỉnh progress và volume bar bằng keycode
        window.onkeydown = function (e) {
            switch (e.keyCode) {
                case 32:
                    e.preventDefault();
                    playBtn.click();
                    break;
                case 37:
                    e.preventDefault();
                    audio.currentTime -= 5;
                    break;
                case 38:
                    e.preventDefault();
                    audio.volume + 0.05 > 1 ? (audio.volume = 1) : (audio.volume += 0.05);
                    break;
                case 39:
                    e.preventDefault();
                    audio.currentTime += 5;
                    break;
                case 40:
                    e.preventDefault();
                    audio.volume - 0.05 < 0 ? (audio.volume = 0) : (audio.volume -= 0.05);
                    break;
            }
        };
    },
    loadCurrentSong: function () {
        nameSong.textContent = this.currentSong.name;
        singerSong.textContent = this.currentSong.singer;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        app.setchangeSong(newIndex);
    },
    scollToPlayingSong: function () {
        setTimeout(() => {
            $$(".playlist-item")[this.currentIndex].scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }, 200);
    },
    start: function () {
        //Gán cấu hình từ config vào ứng dụng
        this.loadConfig();

        //Định nghĩa các thuộc tính cho object
        this.defineProperties();

        //Render lại playlist
        this.render();

        //Xử lý các sự kiện
        this.handleEvent();

        //Tải thông tin bài hát đầu tiên vào UI khi chạy
        this.loadCurrentSong();

        //Khởi tạo giá trị ban đầu cho volume là 50%
        audio.volume = 0.5;
    },
};

app.start();