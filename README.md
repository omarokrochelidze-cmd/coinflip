# 🪙 ქოინფლიპი (Coinflip)

**🌍 ენა / Language / Язык:** [ქართული](#-ქართული) · [English](#-english) · [Русский](#-русский)

---

## 🇬🇪 ქართული

მონეტის გადაგდების სანაძლეო თამაში — აშენებული სუფთა HTML/CSS/JavaScript-ით, **ფრეიმვორქის, build-ის და დამოკიდებულებების გარეშე**.

მოთამაშე ირჩევს მხარეს (A ან B), დებს ფსონს (საწყისი ბალანსი 1000 ₾) და აგდებს 3D-ანიმაციით მონეტას. ინტერფეისი მრავალენოვანია — ქართული (ნაგულისხმევი), ინგლისური და რუსული.

### ▶️ გაშვება

დამატებითი ხელსაწყოები არ სჭირდება. უბრალოდ:

- გახსენი `index.html` პირდაპირ ბრაუზერში, **ან**
- გაუშვი ლოკალური სერვერი საქაღალდიდან:
  ```bash
  python -m http.server
  ```
  შემდეგ გახსენი `http://localhost:8000`.

### 📁 ფაილები

| ფაილი | აღწერა |
|-------|--------|
| `index.html` | მარკაპი (შეიცავს inline base64 WebP გამოსახულებებს — მონეტის მხარეები) |
| `style.css` | ყველა სტილი, 3D მონეტის სცენა და ანიმაციები |
| `game.js` | თამაშის მთელი ლოგიკა |

### ✨ ფუნქციები

- 🎲 3D-ანიმირებული მონეტის გადაგდება `requestAnimationFrame`-ით
- 💰 ბალანსისა და ფსონების მართვა, ბანკროტობისას ავტომატური განულება/რესტარტი
- 🌍 მრავალენოვანი ინტერფეისი (ka / en / ru)
- 🔊 რეალურ დროში სინთეზირებული ხმოვანი ეფექტები (Web Audio API — აუდიო ფაილების გარეშე)
- 📜 ბოლო 5 რაუნდის ისტორია

### 🛠 ტექნოლოგიები

Vanilla HTML5 · CSS3 · JavaScript (ES6+) · Web Audio API

ყველაფერი მუშაობს `game.js`-ში არსებული გლობალური მდგომარეობით და DOM id-ებით — ცენტრალური render loop-ის გარეშე.

---

## 🇬🇧 English

A single-page coin-flip betting game — built with plain HTML/CSS/JavaScript, **no framework, no build step, no dependencies**.

The player picks a side (A or B), places a bet (starting balance of 1000 ₾), and flips a 3D-animated coin. The UI is multilingual — Georgian (default), English, and Russian.

### ▶️ Running

No extra tooling required. Just:

- Open `index.html` directly in a browser, **or**
- Serve the folder over HTTP:
  ```bash
  python -m http.server
  ```
  then open `http://localhost:8000`.

### 📁 Files

| File | Description |
|------|-------------|
| `index.html` | Markup (contains inline base64 WebP images — the coin faces) |
| `style.css` | All styling, the 3D coin scene and animations |
| `game.js` | All of the game logic |

### ✨ Features

- 🎲 3D-animated coin flip via `requestAnimationFrame`
- 💰 Balance & bet management, with auto-reset/restart on bankruptcy
- 🌍 Multilingual UI (ka / en / ru)
- 🔊 Sound effects synthesized at runtime (Web Audio API — no audio files)
- 📜 History of the last 5 rounds

### 🛠 Tech stack

Vanilla HTML5 · CSS3 · JavaScript (ES6+) · Web Audio API

Everything runs on global state in `game.js` and DOM ids — no central render loop.

---

## 🇷🇺 Русский

Одностраничная игра-ставка на подбрасывание монеты — написана на чистом HTML/CSS/JavaScript, **без фреймворков, сборки и зависимостей**.

Игрок выбирает сторону (A или B), делает ставку (стартовый баланс 1000 ₾) и подбрасывает 3D-анимированную монету. Интерфейс многоязычный — грузинский (по умолчанию), английский и русский.

### ▶️ Запуск

Дополнительные инструменты не нужны. Просто:

- Откройте `index.html` напрямую в браузере, **или**
- Запустите локальный сервер из папки:
  ```bash
  python -m http.server
  ```
  затем откройте `http://localhost:8000`.

### 📁 Файлы

| Файл | Описание |
|------|----------|
| `index.html` | Разметка (содержит встроенные base64 WebP изображения — стороны монеты) |
| `style.css` | Все стили, 3D-сцена монеты и анимации |
| `game.js` | Вся игровая логика |

### ✨ Возможности

- 🎲 3D-анимация подбрасывания монеты через `requestAnimationFrame`
- 💰 Управление балансом и ставками, авто-сброс/перезапуск при банкротстве
- 🌍 Многоязычный интерфейс (ka / en / ru)
- 🔊 Звуковые эффекты, синтезируемые в реальном времени (Web Audio API — без аудиофайлов)
- 📜 История последних 5 раундов

### 🛠 Технологии

Vanilla HTML5 · CSS3 · JavaScript (ES6+) · Web Audio API

Всё работает на глобальном состоянии в `game.js` и DOM-идентификаторах — без центрального цикла отрисовки.
