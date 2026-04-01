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

// ✅ 核心：票裂开 → 退场 → 显示天空云朵
// ✅ 核心：票裂开 → 退场 → 显示天空 → 8秒后向上淡出 → 显示渐变背景
function initAutoExit() {
  const ticket = document.getElementById("ticket");
  const wrapper = document.querySelector(".exhibition-wrapper");
  const sky = document.querySelector(".sky");

  let isExiting = false;

  ticket.addEventListener("mouseenter", () => {
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
  });
}
function initClouds() {
  const scene = document.querySelector('.sky');
  if (!scene) return;

  // 👇 这里改成 6～8 就会变少，你可以自己调
  const numClouds = 6;

  // 👇 像素风云朵 SVG（超可爱 8bit 风格）
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

  // 生成云朵
  for (let i = 0; i < numClouds; i++) {
    scene.innerHTML += cloudTemplate;
  }

  // 给每个云朵设置随机大小、速度、位置
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

// 云朵飘动动画
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

  // 表单提交
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Your question has been submitted");
  });

  // 菜单切换
  function checkState() {
    dropdown.classList.toggle("closed");
  }

  toggleDropdown.addEventListener('click', checkState);

  // 点击菜单关闭下拉框
  dropdownItems.forEach((item) => {
    item.addEventListener('click', checkState);
  });
}

// 等待场景显示后再初始化
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

// 等待 final-scene 显示后启动
const portfolioInterval = setInterval(() => {
  const final = document.querySelector('.final-scene.show');
  if (final) {
    initPortfolioPixel();
    clearInterval(portfolioInterval);
  }
}, 300);

// =========================================
// 把新功能加到启动列表
// =========================================
window.onload = function () {
  updateDate();
  updateTime();
  setInterval(updateTime, 60000);
  initAutoExit();
  initClouds();
};