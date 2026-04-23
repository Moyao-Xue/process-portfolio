// 自动更新日期
function updateDate() {
  const now = new Date();
  const monthNames = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  const month = monthNames[now.getMonth()];
  const day = now.getDate();
  document.getElementById("today-date").textContent = `${month} ${day}`;
}

// 自动更新时间
function updateTime() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  hours = hours < 10 ? "0"+hours : hours;
  minutes = minutes < 10 ? "0"+minutes : minutes;
  document.getElementById("today-time").textContent = `${hours}:${minutes}`;
}

// ========================【新增】Loading 点动画 ========================
function startLoadingDots() {
  const text = document.getElementById("loadingText");
  let dots = 0;
  setInterval(() => {
    dots = (dots + 1) % 4; // 0→1→2→3→0 循环
    text.textContent = "Loading" + ".".repeat(dots);
  }, 300); // 每300ms加一个点
}
startLoadingDots();

// ========================【新增】页面加载完隐藏加载页，显示门票 ========================
function hideLoadingScreen() {
  const loading = document.getElementById("loadingScreen");
  setTimeout(() => {
    loading.classList.add("hidden");
  }, 800); // 可自己改加载时间
}
// ======================== 【/新增】Loading 功能 ========================

// ✅ 核心：票裂开 → 退场 → 显示天空 → 8秒后向上淡出 → 显示渐变背景
function initAutoExit() {
  const ticket = document.getElementById("ticket");
  const wrapper = document.querySelector(".exhibition-wrapper");
  const sky = document.querySelector(".sky");

  let isExiting = false;

  // 桌面端：鼠标悬停触发
  ticket.addEventListener("mouseenter", () => {
    triggerExit();
  });

  // 移动端：触摸触发
  ticket.addEventListener("touchstart", (e) => {
    e.preventDefault();
    triggerExit();
  });

  function triggerExit() {
    if (isExiting) return;
    isExiting = true;

    ticket.classList.add("hold-open");

    setTimeout(() => {
      wrapper.classList.add("fade-out");
      sky.classList.add("show");

      // 8秒后 → 全部温柔变化
      setTimeout(() => {
        sky.classList.add("fade-to-light");

        setTimeout(() => {
            sky.style.opacity = 0;
            const finalScene = document.querySelector(".final-scene");
            finalScene.classList.add("show");
          }, 500);
      }, 1000);

    }, 600);
  }
}
function initClouds() {
  const scene = document.querySelector('.sky');
  if (!scene) return;

  const numClouds = 6;

  const cloudTemplate = `
  <div class="cloud">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 64" shape-rendering="crispEdges">
      <rect x="24" y="32" width="16" height="16" fill="#fff"/>
      <rect x="40" y="32" width="16" height="16" fill="#fff"/>
      <rect x="56" y="32" width="16" height="16" fill="#fff"/>
      <rect x="72" y="32" width="16" height="16" fill="#fff"/>
      <rect x="40" y="16" width="16" height="16" fill="#fff"/>
      <rect x="56" y="16" width="16" height="16" fill="#fff"/>
      <rect x="72" y="16" width="16" height="16" fill="#fff"/>
    </svg>
  </div>`;

  for (let i = 0; i < numClouds; i++) {
    scene.innerHTML += cloudTemplate;
  }

  const clouds = document.querySelectorAll('.cloud');
  clouds.forEach(cloud => {
    const size = (Math.random() * 50 + 50) / 100;
    const speed = Math.random() * 50 + 40;
    const top = Math.random() * 75 + 10 + '%';
    const delay = Math.random() * -40;

    cloud.style.cssText = `
      position: absolute;
      width: 120px;
      height: 60px;
      top: ${top};
      transform: scale(${size});
      opacity: ${size * 0.95};
      animation: cloudMove ${speed}s linear ${delay}s infinite;
    `;
  });
}

const style = document.createElement('style');
style.textContent = `
@keyframes cloudMove {
  0% { transform: translateX(-150px); }
  100% { transform: translateX(calc(100vw + 150px)); }
}
`;
document.head.appendChild(style);

// =========================================
// 星露谷官网菜单 + 表单功能（第三场景）
// =========================================
function initStardewUI() {
  let toggleDropdown = document.querySelector('.menu-icon');
  let dropdown = document.querySelector('.dropdown-nav');
  let dropdownItems = document.querySelectorAll('.dropdown-nav a');
  let form = document.getElementById('question');

  if (!form || !toggleDropdown || !dropdown) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Your question has been submitted");
  });

  function checkState() {
    dropdown.classList.toggle("closed");
  }

  toggleDropdown.addEventListener('click', checkState);

  dropdownItems.forEach((item) => {
    item.addEventListener('click', checkState);
  });
}

const waitForScene = setInterval(() => {
  if (document.querySelector(".final-scene.show")) {
    initStardewUI();
    clearInterval(waitForScene);
  }
}, 500);


// ==============================
// PORTFOLIO PIXEL 交互
// ==============================
function initPortfolioPixel() {
  const figmaBtn = document.getElementById('figmaPixelBtn');
  const pixelMockup = document.getElementById('pixelMockup');

  if (!figmaBtn || !pixelMockup) return;

  figmaBtn.addEventListener('click', () => {
    const isOpen = pixelMockup.style.display === 'block';
    pixelMockup.style.display = isOpen ? 'none' : 'block';
    figmaBtn.textContent = isOpen
      ? '🎨 Expand Low-Fi Prototype Demo'
      : '📦 Close Prototype Demo';
  });
}

const portfolioInterval = setInterval(() => {
  const final = document.querySelector('.final-scene.show');
  if (final) {
    initPortfolioPixel();
    clearInterval(portfolioInterval);
  }
}, 300);

// =========================================
// 左侧滚动进度条功能
// =========================================
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgressBar');
  const progressFill = document.getElementById('scrollProgressFill');
  const progressTooltip = document.getElementById('scrollProgressTooltip');

  if (!progressBar || !progressFill || !progressTooltip) return;

  function updateProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    
    progressFill.style.height = `${Math.min(progress, 100)}%`;
    progressTooltip.textContent = `${Math.round(progress)}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientY - rect.top;
    const percentage = clickPosition / rect.height;
    const targetScroll = percentage * (document.documentElement.scrollHeight - window.innerHeight);
    
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  });
}

// 点击图片放大
function openZoom(img) {
  let zoomDiv = document.createElement("div");
  zoomDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.9);
    z-index: 9999999;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: zoom-out;
  `;

  let zoomImg = document.createElement("img");
  zoomImg.src = img.src;
  zoomImg.style.cssText = `
    max-width: 90%;
    max-height: 90%;
    border-radius: 8px;
    border: 3px solid #d4a373;
  `;

  zoomDiv.appendChild(zoomImg);
  document.body.appendChild(zoomDiv);

  zoomDiv.onclick = () => {
    document.body.removeChild(zoomDiv);
  };
}

// =========================================
// 启动：加载动画 + 页面加载完成隐藏
// =========================================
window.onload = function () {   // 【新增】启动 Loading 点
  hideLoadingScreen();   // 【新增】加载完隐藏加载页

  updateDate();
  updateTime();
  setInterval(updateTime, 60000);
  initAutoExit();
  initClouds();
  initScrollProgress();
};