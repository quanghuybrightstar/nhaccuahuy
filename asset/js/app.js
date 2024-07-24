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
  blackListRandomSong: [0],
  currentIndex: 0,
  isPlaying: false,
  isScrolled: true,
  isRandom: false,
  isRepeat: false,

  //Kiểm tra các trạng thái repeat song
  songFlowStates: ["repeat", "repeat_one", "shuffle"],
  songFlowIndex: 0,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "There Goes My Baby",
      singer: "d4vd ",
      path: "./asset/music/there_goes_my_baby.mp3",
      image: "https://i.ytimg.com/vi/CEA6GCk87Ko/maxresdefault.jpg",
    },
    {
      name: "BLUE",
      singer: "Billie Eilish",
      path: "./asset/music/billie_eilish_blue.mp3",
      image: "https://i.ytimg.com/vi/B5j6sfDioPw/sddefault.jpg",
    },
    {
      name: "Viva La Vida",
      singer: "Cover By Rosé",
      path: "./asset/music/rose_viva_la_vida.mp3",
      image:
        "https://i1.sndcdn.com/artworks-X4kyxP57EHzlsX4L-aElx2Q-t500x500.jpg",
    },
    {
      name: "Tình Cờ Yêu Em",
      singer: "Kuun Đức Nam ft. Linh Thộn",
      path: "./asset/music/tinh_co_yeu_em.mp3",
      image:
        "https://photo-resize-zmp3.zadn.vn/w600_r1x1_jpeg/cover/7/3/9/c/739cbcae8c54fc34829b41001d93232d.jpg",
    },
    {
      name: "Si Mê You",
      singer: "Obito",
      path: "./asset/music/si_me_you.mp3",
      image:
        "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/12/e7/96/12e796c7-cecc-179d-524f-01e28c6272b4/cover.jpg/400x400bb.webp",
    },
    {
      name: "Ngoại lệ của nhau",
      singer: "Obito",
      path: "./asset/music/ngoai_le_cua_nhau.mp3",
      image: "https://i.ytimg.com/vi/Qaum8t5y_bk/sddefault.jpg",
    },
    {
      name: "Devil's Love",
      singer: "Tobiez ft. Ntyn",
      path: "./asset/music/devils_love.mp3",
      image: "https://i1.sndcdn.com/artworks-000600609521-fhqfm1-t500x500.jpg",
    },
    {
      name: "Tell The Kids I Love Them",
      singer: "Obito ft. Shiki",
      path: "./asset/music/tell_the_kids_i_love_them.mp3",
      image:
        "https://i.ytimg.com/vi/fw3MZm2lEVA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBvtLi0yvd1UBzdmX1_TWggn3jTPA",
    },
    {
      name: "Mây Lang Thang",
      singer: "Tùng TeA & PC",
      path: "./asset/music/may_lang_thang.mp3",
      image:
        "https://i1.sndcdn.com/artworks-tNzKV3cNPD7N3wkX-hMwPzQ-t500x500.jpg",
    },
    {
      name: "Có Một Người, Luôn Cười Khi Anh Đến",
      singer: "Tofu, PC & D.Blue",
      path: "./asset/music/co_mot_nguoi_luon_cuoi_khi_anh_den.mp3",
      image: "https://i.ytimg.com/vi/W07ue_ToXZQ/maxresdefault.jpg",
    },
    {
      name: "Già Cùng Nhau Là Được",
      singer: "Tùng TeA ft. PC",
      path: "./asset/music/gia_cung_nhau_la_duoc.mp3",
      image:
        "https://i1.sndcdn.com/artworks-000439266552-pj6nw1-t1080x1080.jpg",
    },
    {
      name: "EM ON KHONG",
      singer: "HOANG DUYEN COVER",
      path: "./asset/music/em_on_khong.mp3",
      image:
        "https://i.ytimg.com/vi/thIjlttba0E/maxresdefault.jpg",
    },
    {
      name: "1000 Ánh Mắt",
      singer: "Shiki ft. Obito",
      path: "./asset/music/1000_anh_mat.mp3",
      image: "https://i.ytimg.com/vi/AJDEu1-nSTI/maxresdefault.jpg",
    },
    {
      name: "Anh Vẫn Đợi",
      singer: "Shiki",
      path: "./asset/music/anh_van_doi.mp3",
      image: "https://i.ytimg.com/vi/FrKHM7Yie8k/maxresdefault.jpg",
    },
    {
      name: "Có Đôi Điều",
      singer: "Shiki",
      path: "./asset/music/co_doi_dieu.mp3",
      image: "https://i.ytimg.com/vi/xPXgebIDE6M/sddefault.jpg?v=667b9f78",
    },
    {
      name: "Vì Anh Đâu Có Biết",
      singer: "Madihu ft. Vũ",
      path: "./asset/music/vi_anh_dau_co_biet.mp3",
      image: "https://i.scdn.co/image/ab67616d0000b2732461003df8139247949c8a9d",
    },
    {
      name: "NGƯỜI CÓ THƯƠNG ?",
      singer: "DATKAA",
      path: "./asset/music/datkaa_nguoi_co_thuong.mp3",
      image: "https://i.scdn.co/image/ab67616d0000b27356d43cd0de05de88ee177766",
    },
    {
      name: "TÌNH THU SAO HẠ BUỒN",
      singer: "DATKAA",
      path: "./asset/music/tinh_thu_sao_ha_buon_datkaa_prod_qt_beatz.mp3",
      image: "https://i.scdn.co/image/ab67616d00001e02dafea3235193a34a8da9842b",
    },
    {
      name: "CHIỀU THU HỌA BÓNG NÀNG",
      singer: "DATKAA x QT BEATZ",
      path: "./asset/music/chieu_thu_hoa_bong_nang_datkaa_x_qt_beatz.mp3",
      image: "https://i.scdn.co/image/ab67616d0000b2734f3263b06756b88e8918bcaf",
    },
    {
      name: "LỆCH",
      singer: "Tọi",
      path: "./asset/music/lech.mp3",
      image: "https://i.ytimg.com/vi/m7boBs4zNys/maxresdefault.jpg",
    },
    {
      name: "KHI EM LỚN (Rap version)",
      singer: "Tọi",
      path: "./asset/music/khi_em_lon_rap.mp3",
      image: "https://i.ytimg.com/vi/NgAXVHAa7-Q/maxresdefault.jpg",
    },
    {
      name: "NÉM CÂU YÊU VÀO KHÔNG TRUNG",
      singer: "Hoàng Dũng",
      path: "./asset/music/hoang_dung_nem_cau_yeu_vao_khong_trung.mp3",
      image:
        "https://avatar-ex-swe.nixcdn.com/song/2022/08/26/7/9/f/5/1661496737079_640.jpg",
    },
    {
      name: "QUERRY",
      singer: "QNT x TRUNG TRẦN ft. RPT MCK",
      path: "./asset/music/querry_qnt_x_trung_tran_ft_rpt_mck.mp3",
      image: "https://i.scdn.co/image/ab67616d00001e0229920f5d50112ec6f72efe39",
    },
    {
      name: "EM CÓ THỂ",
      singer: "OSAD x VRT",
      path: "./asset/music/em_co_the_osad_x_vrt.mp3",
      image: "https://i.scdn.co/image/ab67616d00001e024a0a30b34c7e307d1667e8dc",
    },
    {
      name: "THICHTHICH",
      singer: "Phương Ly",
      path: "./asset/music/thichthich_phuong_ly.mp3",
      image: "https://i.scdn.co/image/ab67616d00001e02ad5d0332d6438843cd287992",
    },
    {
      name: "Can't Help Falling in Love",
      singer: "Cover By Alyssa Baker",
      path: "./asset/music/can_t_help_falling_in_love_cover_by_alyssa_baker.mp3",
      image:
        "https://i.ytimg.com/vi/QT18QfowCFI/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBKMWs6XoRMLj0BktmNlPj2xYFKQw",
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
      image:
        "https://i.ytimg.com/vi/lar8IBF_4II/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBE_DlB15Wxat_3llVqZX1NtAF0vw",
    },
    {
      name: "Đi Theo Bóng Mặt Trời",
      singer: "Đen ft. Tăng Ngân Hà",
      path: "./asset/music/den_di_theo_bong_mat_troi_ft_tang_ngan_ha.mp3",
      image: "https://i.scdn.co/image/ab67616d00001e022fb6442b420a851093bd3282",
    },
    {
      name: "Ai muốn nghe không",
      singer: "Đen",
      path: "./asset/music/den_ai_muon_nghe_khong.mp3",
      image: "https://i.scdn.co/image/ab67616d0000b27365896c6baea3e99f033ed03d",
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
          index === app.currentIndex
            ? strokes
            : app.timerFormat(playlistDuration.duration);
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
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 13000,
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
      playBtn.innerText = "pause_circle";
      cdThumbAnimate.play();
      setTimeout(() => {
        _this.isPlaying = true;
      }, 500);
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
          audio.volume >= 0.5
            ? "volume_up"
            : audio.volume < 0.05
            ? "volume_mute"
            : "volume_down";
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
      if (_this.songFlowIndex === 2) {
        _this.playRandomSong();
      }
      if (_this.currentIndex === _this.songs.length - 1) {
        _this.setchangeSong(0);
      } else {
        _this.setchangeSong(_this.currentIndex + 1);
      }
    };

    //Khi prev song
    prevBtn.onclick = function () {
      if (_this.songFlowIndex === 2) {
        _this.playRandomSong();
      }
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
    const songCount = this.songs.length;
    do {
      newIndex = Math.floor(Math.random() * songCount);
    } while (
      newIndex === this.currentIndex ||
      this.blackListRandomSong.includes(newIndex)
    );

    this.blackListRandomSong.push(newIndex);

    // Nếu cần giới hạn số lượng bài hát trong danh sách đen để tránh mảng quá lớn
    if (this.blackListRandomSong.length >= songCount) {
      this.blackListRandomSong.shift(); // Xóa chỉ số đầu tiên để không bị tràn bộ nhớ
    }

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
