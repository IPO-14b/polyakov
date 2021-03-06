/**
 * API-интерфейс браузера для получения плавной анимации
 */
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

/**
 * Отмена запроса
 */
window.cancelRequestAnimFrame = (function() {
    return window.cancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
        clearTimeout
})();

/**
 *
 * Инициализация холста и переменных
 *
 *@var object ctx
 *@var int W ширина
 *@var int H высота холста
 *@var int particles частицы
 *@var object ball шар
 *@var int paddles вёсла
 *@var object mouse мыши
 *@var int points очки
 *@var int fps фпс
 *@var int particlesCount количество частиц
 *@var int flag флаг игры
 *@var object particlePos позиция частиц
 *@var object startBtn кнопка старта
 *@var object restartBtn кнопка рестарта
 *@var int over конец игры
 *@var int init анимация
 */
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    W = window.innerWidth,
    H = window.innerHeight,
    particles = [],
    ball = {},
    paddles = [2],
    mouse = {},
    points = 0,
    fps = 60,
    particlesCount = 20,
    flag = 0,
    particlePos = {},
    startBtn = {},
    restartBtn = {},
    over = 0,
    init,
    paddleHit;

canvas.addEventListener("mousemove", trackPosition, true);
canvas.addEventListener("mousedown", btnClick, true);

/**
 * Инициализация звука столкновения
 */
collision = document.getElementById("collide");

/**
 * Присваинвание ширины и высоты холста в полноэкранном режиме.
 */
canvas.width = W;
canvas.height = H;

/**
 * Функция рисования холста
 */
function paintCanvas() {
    fillStyle = "black";
    ctx.fillRect(0, 0, W, H);
}

/**
 * Функция создания весла
 *
 * @var int h высота
 * @var int w ширина
 * @var int y позиция по y
 * @var int x позиция по x
 */
function Paddle(pos) {
    this.h = 5;
    this.w = 150;
    this.x = W / 2 - this.w / 2;
    this.y = (pos == "top") ? 0 : H - this.h;
}

paddles.push(new Paddle("bottom"));
paddles.push(new Paddle("top"));

/**
 * Объект Ball
 *
 *@var int x позиция
 *@var int y позиция
 *@var int r радиус
 *@var object c цвет
 *@var int vx вектор скорости
 *@var int vy вектор скорости
 */
ball = {
    x: 50,
    y: 50,
    r: 5,
    c: "white",
    vx: 4,
    vy: 8,

    /**
     * Функция рисования шара на холсте
     */
    draw: function() {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        ctx.fill();
    }
};

/**
 * Объект Button
 *
 *@var int w ширина
 *@var int h высота
 *@var int x позиция по x
 *@var int y позиция по y
 */
startBtn = {
    w: 100,
    h: 50,
    x: W / 2 - 50,
    y: H / 2 - 25,

    draw: function() {
        ctx.strokeStyle = "white";
        ctx.lineWidth = "2";
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        ctx.font = "18px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStlye = "white";
        ctx.fillText("Старт", W / 2, H / 2);
    }
};

/**
 * Объект Restart Button
 *
 *@var int w ширина
 *@var int h высота
 *@var int x позиция
 *@var int y позиция
 */
restartBtn = {
    w: 100,
    h: 50,
    x: W / 2 - 50,
    y: H / 2 - 50,

    draw: function() {
        ctx.strokeStyle = "white";
        ctx.lineWidth = "2";
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        ctx.font = "18px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStlye = "white";
        ctx.fillText("Рестарт", W / 2, H / 2 - 25);
    }
};

/**
 * Функция создания объекта частиц
 *
 *@var int x позиция
 *@var int y позиция
 *@var int vx вектор скорости
 *@var int vy вектор скорости
 */
function createParticles(x, y, m) {
    this.x = x || 0;
    this.y = y || 0;
    this.radius = 1.2;
    this.vx = -1.5 + Math.random() * 3;
    this.vy = m * Math.random() * 1.5;
}

/**
 * Рисуем все на холсте
 */
function draw() {
    paintCanvas();
    for (var i = 0; i < paddles.length; i++) {
        p = paddles[i];
        ctx.fillStyle = "white";
        ctx.fillRect(p.x, p.y, p.w, p.h);
    }
    ball.draw();
    update();
}

/**
 * Функция увеличения скорости после каждых 5 ударов
 */
function increaseSpd() {
    if (points % 4 == 0) {
        if (Math.abs(ball.vx) < 15) {
            ball.vx += (ball.vx < 0) ? -1 : 1;
            ball.vy += (ball.vy < 0) ? -2 : 2;
        }
    }
}

/**
 * Отслеживание положения курсора мыши
 */
function trackPosition(e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
}

/**
 * Функция для обновления позиций, оценки и всего.
 * В принципе, основная логика игры определена здесь.
 */
function update() {

    /**
     * Обновлять счёт
     */
    updateScore();

    /**
     * Перемещение весла при перемещении мыши
     */
    if (mouse.x && mouse.y) {
        for (var i = 1; i < paddles.length; i++) {
            p = paddles[i];
            p.x = mouse.x - p.w / 2;
        }
    }

    /**
     * Перемещение мяча
     */
    ball.x += ball.vx;
    ball.y += ball.vy;

    /**
     * Столкновение с веслами
     */
    p1 = paddles[1];
    p2 = paddles[2];

    /**
     * Если мяч ударяется о весло,
     * инвертируем вектор скорости y шара,
     * увеличиваем очки, воспроизводим звук столкновения,
     * сохраняем позицию столкновения,
     * Исходя из этой позиции, установите переменную флага,
     * и изменим множитель
     */
    if (collides(ball, p1)) {
        collideAction(ball, p1);
    } else if (collides(ball, p2)) {
        collideAction(ball, p2);
    } else {

        /**
         * Столкновение со стенами, Если мяч попадает в верхнюю / нижнюю часть,
         * стены, запускаем функцию gameOver ()
         */

        if (ball.y + ball.r > H) {
            ball.y = H - ball.r;
            gameOver();
        } else if (ball.y < 0) {
            ball.y = ball.r;
            gameOver();
        }

        /**
         * Если мяч ударяет по вертикальным стенкам, инвертируем
         * вектор скорости x шара
         */
        if (ball.x + ball.r > W) {
            ball.vx = -ball.vx;
            ball.x = W - ball.r;
        } else if (ball.x - ball.r < 0) {
            ball.vx = -ball.vx;
            ball.x = ball.r;
        }
    }

    if (flag == 1) {
        for (var k = 0; k < particlesCount; k++) {
            particles.push(new createParticles(particlePos.x, particlePos.y, multiplier));
        }
    }

    /**
     * Излучение частиц / искр
     */
    emitParticles();

    /**
     * сброс флага
     */
    flag = 0;
}

/**
 * Функция проверки столкновения шара с одним из
 * весла
 */
function collides(b, p) {
    if (b.x + ball.r >= p.x && b.x - ball.r <= p.x + p.w) {
        if (b.y >= (p.y - p.h) && p.y > 0) {
            paddleHit = 1;
            return true;
        } else if (b.y <= p.h && p.y == 0) {
            paddleHit = 2;
            return true;
        } else return false;
    }
}

/**
 * Делаем это если столкновение == true
 */
function collideAction(ball, p) {
    ball.vy = -ball.vy;

    if (paddleHit == 1) {
        ball.y = p.y - p.h;
        particlePos.y = ball.y + ball.r;
        multiplier = -1;
    } else if (paddleHit == 2) {
        ball.y = p.h + ball.r;
        particlePos.y = ball.y - ball.r;
        multiplier = 1;
    }

    points++;
    increaseSpd();

    if (collision) {
        if (points > 0) {
            collision.pause();
		}

        collision.currentTime = 0;
        collision.play();
    }

    particlePos.x = ball.x;
    flag = 1;
}

/**
 * Функция для излучения частиц
 */
function emitParticles() {
    for (var j = 0; j < particles.length; j++) {
        par = particles[j];

        ctx.beginPath();
        ctx.fillStyle = "white";
        if (par.radius > 0) {
            ctx.arc(par.x, par.y, par.radius, 0, Math.PI * 2, false);
        }
        ctx.fill();

        par.x += par.vx;
        par.y += par.vy;

        /**
         * Уменьшаем радиус, чтобы частицы погибали через несколько секунд
         */
        par.radius -= 0.05;

    }
}

/**
 * Функция обновления шара
 */
function updateScore() {
    ctx.fillStlye = "white";
    ctx.font = "16px Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Очки: " + points, 20, 20);
}

/**
 * Функция запускается при игре
 */
function gameOver() {
    ctx.fillStlye = "white";
    ctx.font = "20px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Вы проиграли - Ваш счет " + points + "!", W / 2, H / 2 + 25);

    /**
     * Остановка анимации
     */
    cancelRequestAnimFrame(init);

    /**
     * Установка флаг over
     */
    over = 1;

    /**
     * Показать кнопку перезапуска
     */
    restartBtn.draw();
}

/**
 * Функция для запуска всей анимации
 */
function animloop() {
    init = requestAnimFrame(animloop);
    draw();
}

/**
 * Функция создание начального экрана
 */
function startScreen() {
    draw();
    startBtn.draw();
}

/**
 * Нажатие кнопки (перезагрузка и запуск)
 */
function btnClick(e) {

    /**
     * Переменные для хранения позиции мыши при нажатии
     */
    var mx = e.pageX,
        my = e.pageY;

    /**
     * Нажмите кнопку «Пуск»
     */
    if (mx >= startBtn.x && mx <= startBtn.x + startBtn.w) {
        animloop();

        /**
         * Удалите кнопку запуска после нажатия
         */
        startBtn = {};
    }

    /**
     * Если игра закончилась, и нажата кнопка перезапуска
     */
    if (over == 1) {
        if (mx >= restartBtn.x && mx <= restartBtn.x + restartBtn.w) {
            ball.x = 20;
            ball.y = 20;
            points = 0;
            ball.vx = 4;
            ball.vy = 8;
            animloop();
            over = 0;
        }
    }
}

/**
 * Показать начальный экран
 */
startScreen();