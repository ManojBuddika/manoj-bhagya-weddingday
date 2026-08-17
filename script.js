/* ==========================================================================
   Sri Lankan Traditional Kandyan Wedding Invitation JavaScript Engine
   Theme Palette: Dusty Rose (#C88A75), Rosebud (#9E4F63), Medium Lavender (#8B729E), & Gold (#D4AF37)
   Features: Direct Music Playback, Royal Envelope Opening, Sparkle Burst,
   Wall of Love Guestbook (Clean with no sample data), Google Calendar / iCal Generators, & Particle Physics.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const waxSealBtn = document.getElementById('waxSealBtn');
  const invitationMain = document.getElementById('invitationMain');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const replayEnvelopeBtn = document.getElementById('replayEnvelopeBtn');
  const toastMsg = document.getElementById('toastMsg');
  const wishesBoard = document.getElementById('wishesBoard');
  const wishForm = document.getElementById('wishForm');
  const downloadIcalBtn = document.getElementById('downloadIcalBtn');

  // State Variables
  let isAudioPlaying = false;
  let bgAudio = null;

  // Initialize Background Traditional Audio Player using assets/Traditional song.MP3
  try {
    bgAudio = new Audio('assets/Traditional song.MP3');
    bgAudio.loop = true;
    bgAudio.volume = 0.85;
  } catch (e) {
    console.log('Audio init notice:', e);
  }

  // Attempt direct audio playback on page load
  function attemptDirectAudioPlay() {
    if (!bgAudio || isAudioPlaying) return;
    bgAudio.play().then(() => {
      isAudioPlaying = true;
      if (musicToggleBtn) {
        musicToggleBtn.classList.add('playing');
        musicToggleBtn.setAttribute('title', 'Pause Music');
      }
    }).catch(err => {
      // Browser autoplay policy might block audio until user click
      console.log('Direct autoplay waiting for interaction:', err);
    });
  }

  attemptDirectAudioPlay();

  // Play audio directly on first user interaction anywhere on screen
  const enableAudioOnInteraction = () => {
    attemptDirectAudioPlay();
    document.removeEventListener('click', enableAudioOnInteraction);
    document.removeEventListener('touchstart', enableAudioOnInteraction);
  };
  document.addEventListener('click', enableAudioOnInteraction, { once: true });
  document.addEventListener('touchstart', enableAudioOnInteraction, { once: true });

  // Target Date: Nov 12, 2026 10:04:00 AM (Poruwa Ceremony Nekatha)
  const weddingDate = new Date('November 12, 2026 10:04:00').getTime();

  /* ==========================================================================
     1. Sparkle Burst Effect on Wax Seal Click
     ========================================================================== */
  function triggerSealSparkleBurst() {
    const canvas = document.getElementById('seal-burst-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = envelopeWrapper.clientWidth;
    canvas.height = envelopeWrapper.clientHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const particles = [];
    const colors = ['#D4AF37', '#C88A75', '#9E4F63', '#8B729E', '#F7E49A', '#FFFFFF'];

    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: Math.random() * 5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0
      });
    }

    function animateBurst() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        if (p.alpha > 0.01) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.15; // gravity
          p.alpha *= 0.94;
          p.life++;

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      if (alive) {
        requestAnimationFrame(animateBurst);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    animateBurst();
  }

  /* ==========================================================================
     2. Royal Envelope Opening & Direct Music Trigger
     ========================================================================== */
  function openEnvelope() {
    if (envelopeWrapper.classList.contains('animating') || envelopeWrapper.classList.contains('opened')) return;

    // Visual sparkle burst
    triggerSealSparkleBurst();

    // Trigger CSS Envelope opening split
    envelopeWrapper.classList.add('animating');

    // Direct Music Playback
    playMusic();

    // After animation steps complete, smoothly show main page
    setTimeout(() => {
      envelopeWrapper.classList.add('opened');
      invitationMain.classList.add('visible');
      startPetalCanvas();
      showToast('🌸 Welcome to Manoj & Bhagya\'s Traditional Wedding Invitation!');
    }, 1100);
  }

  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', openEnvelope);
    waxSealBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      openEnvelope();
    }, { passive: false });
  }

  if (replayEnvelopeBtn) {
    replayEnvelopeBtn.addEventListener('click', () => {
      invitationMain.classList.remove('visible');
      envelopeWrapper.classList.remove('opened', 'animating');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     3. Background Music Player Control
     ========================================================================== */
  function playMusic() {
    if (!bgAudio) return;
    
    bgAudio.play().then(() => {
      isAudioPlaying = true;
      if (musicToggleBtn) {
        musicToggleBtn.classList.add('playing');
        musicToggleBtn.setAttribute('title', 'Pause Music');
      }
    }).catch(err => {
      console.log('Autoplay restriction, user interaction required:', err);
    });
  }

  function toggleMusic() {
    if (!bgAudio) return;

    if (isAudioPlaying) {
      bgAudio.pause();
      isAudioPlaying = false;
      if (musicToggleBtn) {
        musicToggleBtn.classList.remove('playing');
        musicToggleBtn.setAttribute('title', 'Play Music');
      }
      showToast('🎵 Music paused');
    } else {
      bgAudio.play().then(() => {
        isAudioPlaying = true;
        if (musicToggleBtn) {
          musicToggleBtn.classList.add('playing');
          musicToggleBtn.setAttribute('title', 'Pause Music');
        }
        showToast('🎵 Playing Traditional Wedding Music');
      }).catch(err => {
        showToast('🎵 Tap screen to play music');
      });
    }
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', toggleMusic);
  }

  /* ==========================================================================
     4. Real-Time Countdown Timer
     ========================================================================== */
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      document.getElementById('days').innerText = '00';
      document.getElementById('hours').innerText = '00';
      document.getElementById('minutes').innerText = '00';
      document.getElementById('seconds').innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = String(days).padStart(2, '0');
    document.getElementById('hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  /* ==========================================================================
     5. Wall of Love (Guestbook with Sample Data Removed)
     ========================================================================== */
  // Sample data removed completely per request
  const defaultWishes = [];

  function loadWishes() {
    if (!wishesBoard) return;
    let saved = localStorage.getItem('wedding_wishes_mb');
    let wishes = saved ? JSON.parse(saved) : defaultWishes;

    wishesBoard.innerHTML = '';

    if (wishes.length === 0) {
      wishesBoard.innerHTML = `
        <p style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 14px 10px; font-style: italic;">
          Be the first to leave your warm blessings for Manoj & Bhagya! 🌸
        </p>
      `;
      return;
    }

    wishes.forEach(w => {
      const card = document.createElement('div');
      card.className = 'wish-card';
      card.innerHTML = `
        <div class="wish-card-header">
          <span class="wish-author">${escapeHtml(w.name)}</span>
          <span class="wish-time"><i class="fas fa-heart" style="color: #9E4F63;"></i> Wish</span>
        </div>
        <div class="wish-text">${escapeHtml(w.message)}</div>
      `;
      wishesBoard.appendChild(card);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
  }

  if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('wishName').value.trim();
      const message = document.getElementById('wishMessage').value.trim();

      if (!name || !message) return;

      let saved = localStorage.getItem('wedding_wishes_mb');
      let wishes = saved ? JSON.parse(saved) : [];

      wishes.unshift({ name, message });
      localStorage.setItem('wedding_wishes_mb', JSON.stringify(wishes));

      loadWishes();
      wishForm.reset();
      showToast('💌 Thank you for leaving your wish on our Wall of Love!');
    });
  }

  loadWishes();

  /* ==========================================================================
     6. Calendar & Share Actions
     ========================================================================== */
  const addToCalendarBtn = document.getElementById('addToCalendarBtn');
  if (addToCalendarBtn) {
    addToCalendarBtn.addEventListener('click', () => {
      const gCalUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
        "&text=" + encodeURIComponent("Manoj & Bhagya's Traditional Kandyan Wedding") +
        "&dates=20261112T033000Z/20261112T113000Z" +
        "&details=" + encodeURIComponent("14 Years of Love - Guest Arrival 9:00 AM | Poruwa Ceremony 10:04 AM | Ring Exchange 10:16 AM | Jayamangala Gatha 10:45 AM | Kiri Bath Blessing 10:55 AM | Lunch 12:30 PM | Going Away 4:30 PM. Location: https://share.google/Jmm8KmMtpkvWBadur") +
        "&location=" + encodeURIComponent("https://share.google/Jmm8KmMtpkvWBadur");
      window.open(gCalUrl, '_blank');
    });
  }

  if (downloadIcalBtn) {
    downloadIcalBtn.addEventListener('click', () => {
      const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Manoj & Bhagya Traditional Wedding Invitation//EN
BEGIN:VEVENT
SUMMARY:Manoj & Bhagya Traditional Kandyan Wedding (Poruwa Ceremony)
DESCRIPTION:14 Years of Love - Poruwa Ceremony at 10:04 AM, Ring Exchange at 10:16 AM, Jayamangala Gatha at 10:45 AM, Kiri Bath Blessing at 10:55 AM.
LOCATION:https://share.google/Jmm8KmMtpkvWBadur
DTSTART:20261112T033000Z
DTEND:20261112T113000Z
END:VEVENT
END:VCALENDAR`;

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Manoj_Bhagya_Traditional_Wedding.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('📅 Apple Calendar (.ics) downloaded!');
    });
  }

  const shareWhatsappBtn = document.getElementById('shareWhatsappBtn');
  if (shareWhatsappBtn) {
    shareWhatsappBtn.addEventListener('click', () => {
      const shareText = encodeURIComponent("💌 You are cordially invited to celebrate the Traditional Kandyan Wedding of Manoj & Bhagya!\n\n✨ 14 Years of Love\n⏰ Event Hours: 9:00 AM - 5:00 PM\n⏰ Poruwa Ceremony (Nekatha): 10:04 AM\n⏰ Ring Exchange (Nekatha): 10:16 AM\n⏰ Jayamangala Gatha: 10:45 AM\n⏰ Kiri Bath Blessing: 10:55 AM\n📅 Date: Thursday, November 12, 2026\n📍 Location: https://share.google/Jmm8KmMtpkvWBadur\n📝 Confirm RSVP Google Form: https://forms.gle/p1BcPYw2XSjJ6oFF6\n📞 Contact: Manoj (0717900456) / Bhagya (0706666456)");
      window.open("https://api.whatsapp.com/send?text=" + shareText, '_blank');
    });
  }

  /* ==========================================================================
     7. Floating Jasmine & Gold Dust Particle Physics
     ========================================================================== */
  function startPetalCanvas() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const particleCount = 38;
    const colors = ['#C88A75', '#9E4F63', '#8B729E', '#D4AF37', '#F7E49A', '#FFFFFF'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 3,
        speedY: Math.random() * 1.1 + 0.4,
        speedX: Math.random() * 0.8 - 0.4,
        angle: Math.random() * 360,
        spin: Math.random() * 2 - 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.65 + 0.35,
        isStar: Math.random() > 0.6
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.angle += p.spin;

        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.globalAlpha = p.alpha;

        if (p.isStar) {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size / 2.2, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  /* ==========================================================================
     8. Toast Notification Utility
     ========================================================================== */
  function showToast(message) {
    if (!toastMsg) return;
    toastMsg.innerText = message;
    toastMsg.classList.add('show');

    setTimeout(() => {
      toastMsg.classList.remove('show');
    }, 3200);
  }
});
