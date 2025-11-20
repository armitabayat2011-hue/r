const input = document.getElementById('numberInput');
const placeBtn = document.getElementById('placeBtn');
const clearBtn = document.getElementById('clearBtn');
const result = document.getElementById('result');
const canvas = document.getElementById('nlCanvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;
const x0 = width / 2; // موقعیت صفر در وسط
const scale = 50; // هر واحد چند پیکسل باشد

// رسم محور عددی
function drawAxis() {
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = '12px Tahoma';
  for (let i = -8; i <= 8; i++) {
    const x = x0 + i * scale;
    ctx.beginPath();
    ctx.moveTo(x, height / 2 - 6);
    ctx.lineTo(x, height / 2 + 6);
    ctx.stroke();
    ctx.fillText(i.toString(), x - 5, height / 2 + 20);
  }
}

// تبدیل ورودی کاربر به عدد
function parseNumber(str) {
  str = str.trim();
  if (!str) return null;

  if (/^[-+]?\\d+\\/\\d+$/.test(str)) {
    const parts = str.split('/');
    return Number(parts[0]) / Number(parts[1]);
  }

  const sqrtMatch = str.match(/^([-+]?)(?:sqrt|√)\\(?([0-9\\.]+)\\)?$/i);
  if (sqrtMatch) {
    const sign = sqrtMatch[1] === '-' ? -1 : 1;
    const val = Math.sqrt(Number(sqrtMatch[2]));
    return sign * val;
  }

  const n = Number(str);
  if (!isNaN(n)) return n;
  return null;
}

// نمایش عدد روی محور
function placeMarker(value) {
  drawAxis();
  const px = x0 + value * scale;

  ctx.beginPath();
  ctx.moveTo(px, height / 2 - 30);
  ctx.lineTo(px, height / 2);
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(px, height / 2 - 34, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#2563eb';
  ctx.fill();

  const label = Number.isInteger(value) ? value.toString() : value.toFixed(2);
  ctx.fillStyle = '#fff';
  ctx.font = '11px Tahoma';
  ctx.fillText(label, px - 10, height / 2 - 32);
}

// رسم نمودار ساده |x|
function showPlot() {
  const plot = document.getElementById('plot');
  const w = 600, h = 150;
  const svgHeader = `<svg viewBox=\"0 0 ${w} ${h}\" width=\"100%\" height=\"150\" xmlns=\"http://www.w3.org/2000/svg\">`;
  const axis = `<line x1=\"0\" y1=\"${h / 2}\" x2=\"${w}\" y2=\"${h / 2}\" stroke=\"#0f172a\" stroke-width=\"1\"/>`;
  const path = `<polyline points=\"0,${h / 2} ${w / 2},0 ${w},${h / 2}\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"3\"/>`;
  plot.innerHTML = svgHeader + axis + path + '</svg>';
}

// رویدادها
placeBtn.addEventListener('click', () => {
  const raw = input.value;
  const val = parseNumber(raw);

  if (val === null) {
    result.textContent = 'ورودی نامعتبر است. مثال: -3، 1/2، sqrt(2)';
    return;
  }

  const abs = Math.abs(val);
  result.textContent = `|${raw}| = ${abs.toFixed(3)}`;
  placeMarker(val);
});

clearBtn.addEventListener('click', () => {
  input.value = '';
  result.textContent = '';
  drawAxis();
});

// اجرا در شروع
drawAxis();
showPlot();
