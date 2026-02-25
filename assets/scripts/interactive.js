document.addEventListener('DOMContentLoaded', function () {

    /* ================================================================
       1. VIDEO COMPARISON — Synchronized dual-video player
       ================================================================ */
    document.querySelectorAll('.video-comparison').forEach(function (comp) {
        var videoA = comp.querySelector('.comp-video-a video');
        var videoB = comp.querySelector('.comp-video-b video');
        var seekBar = comp.querySelector('.comp-seek');
        var playBtn = comp.querySelector('.comp-play');
        var timeDisplay = comp.querySelector('.comp-time');
        if (!videoA || !videoB) return;

        var playing = false;

        function formatTime(s) {
            var m = Math.floor(s / 60);
            var sec = Math.floor(s % 60);
            return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
        }

        function syncPlay() {
            playing = true;
            videoA.play();
            videoB.play();
            playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        }

        function syncPause() {
            playing = false;
            videoA.pause();
            videoB.pause();
            playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        }

        playBtn.addEventListener('click', function () {
            if (playing) { syncPause(); } else { syncPlay(); }
        });

        videoA.addEventListener('timeupdate', function () {
            if (!seekBar) return;
            var pct = videoA.duration ? (videoA.currentTime / videoA.duration) * 100 : 0;
            seekBar.value = pct;
            seekBar.style.setProperty('--progress', pct + '%');
            if (timeDisplay) {
                timeDisplay.textContent = formatTime(videoA.currentTime) + ' / ' + formatTime(videoA.duration || 0);
            }
        });

        if (seekBar) {
            seekBar.addEventListener('input', function () {
                var t = (seekBar.value / 100) * (videoA.duration || 0);
                videoA.currentTime = t;
                videoB.currentTime = t;
                seekBar.style.setProperty('--progress', seekBar.value + '%');
            });
        }

        videoA.addEventListener('ended', function () {
            syncPause();
            videoA.currentTime = 0;
            videoB.currentTime = 0;
            if (seekBar) {
                seekBar.value = 0;
                seekBar.style.setProperty('--progress', '0%');
            }
        });
    });


    /* ================================================================
       3. PLAYBACK SPEED CONTROLS — per-video control bars
       ================================================================ */
    document.querySelectorAll('.video-player-controls').forEach(function (ctrl) {
        var container = ctrl.closest('.timeline-video-card') || ctrl.parentElement;
        var video = container.querySelector('video');
        if (!video) return;

        var playBtn = ctrl.querySelector('.vpc-play');
        var slowBtn = ctrl.querySelector('.vpc-slow');
        var fastBtn = ctrl.querySelector('.vpc-fast');
        var restartBtn = ctrl.querySelector('.vpc-restart');
        var speedLabel = ctrl.querySelector('.vpc-speed');
        var scrubBar = ctrl.querySelector('.vpc-scrub');
        var elapsed = ctrl.querySelector('.vpc-elapsed');

        function formatTime(s) {
            var m = Math.floor(s / 60);
            var sec = Math.floor(s % 60);
            return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
        }

        function updateSpeedLabel() {
            if (speedLabel) speedLabel.textContent = video.playbackRate.toFixed(2) + 'x';
        }

        if (playBtn) {
            playBtn.addEventListener('click', function () {
                if (video.paused) {
                    video.play();
                    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                } else {
                    video.pause();
                    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
                }
            });
        }

        if (slowBtn) {
            slowBtn.addEventListener('click', function () {
                video.playbackRate = Math.max(0.25, video.playbackRate * 0.8);
                video.play();
                if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                updateSpeedLabel();
            });
        }

        if (fastBtn) {
            fastBtn.addEventListener('click', function () {
                video.playbackRate = Math.min(4, video.playbackRate / 0.8);
                video.play();
                if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                updateSpeedLabel();
            });
        }

        if (restartBtn) {
            restartBtn.addEventListener('click', function () {
                video.currentTime = 0;
                video.playbackRate = 1.0;
                video.play();
                if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                updateSpeedLabel();
            });
        }

        if (scrubBar) {
            video.addEventListener('timeupdate', function () {
                var pct = video.duration ? (video.currentTime / video.duration) * 100 : 0;
                scrubBar.value = pct;
                scrubBar.style.setProperty('--progress', pct + '%');
                if (elapsed) elapsed.textContent = formatTime(video.currentTime);
            });

            scrubBar.addEventListener('input', function () {
                video.currentTime = (scrubBar.value / 100) * (video.duration || 0);
                scrubBar.style.setProperty('--progress', scrubBar.value + '%');
            });
        }

        // Sync initial speed label
        updateSpeedLabel();
    });


    /* ================================================================
       4. PHASE TIMELINE OVERLAY — clickable phase bar for 30s / 63s
       ================================================================ */
    document.querySelectorAll('.phase-bar').forEach(function (bar) {
        var container = bar.closest('.timeline-video-card') || bar.parentElement;
        var video = container.querySelector('video');
        if (!video) return;

        var indicator = bar.querySelector('.phase-indicator');
        var segments = bar.querySelectorAll('.phase-segment');

        segments.forEach(function (seg) {
            seg.addEventListener('click', function () {
                var startPct = parseFloat(seg.dataset.start);
                var dur = video.duration || 1;
                video.currentTime = (startPct / 100) * dur;
                video.play();
                // update play button if present
                var playBtn = container.querySelector('.vpc-play');
                if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            });
        });

        video.addEventListener('timeupdate', function () {
            if (!indicator || !video.duration) return;
            var pct = (video.currentTime / video.duration) * 100;
            indicator.style.left = pct + '%';
        });
    });


    /* ================================================================
       5. METRIC TOOLTIPS — hover explanations for table headers
       ================================================================ */
    document.querySelectorAll('[data-tooltip]').forEach(function (el) {
        var tip = document.createElement('div');
        tip.className = 'metric-tooltip';
        tip.textContent = el.getAttribute('data-tooltip');
        el.style.position = 'relative';
        el.appendChild(tip);

        el.addEventListener('mouseenter', function () {
            tip.classList.add('visible');
        });
        el.addEventListener('mouseleave', function () {
            tip.classList.remove('visible');
        });
    });

});
