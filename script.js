'use strict';

class AnimatedValue {
    constructor (value, onChange) {
        if (!AnimatedValue.__list) {
            AnimatedValue.__list = [];
            AnimatedValue.__frame = 0;
        }

        this.Set(value);
        this.onChange = onChange;
        this.easing = AnimatedValue.Linear;
    }

    AnimateTo(value, duration, delay = 0, easing = null) {
        if (!this.ended) {
        }
        this.startValue = this.value;
        this.goal = value;
        this.startTime = (AnimatedValue.__lastTick || Date.now()) + delay;
        this.duration = duration;
        this.ended = false;
        if (easing) {
            this.easing = easing;
        }

        this.AddToList();
        this.waitingFrame = 0;
    }

    Set(value) {
        this.value = value;
        this.startValue = value;
        this.goal = value;
        this.startTime = 0;
        this.duration = 0;
        this.ended = true;

        this.AddToList();
    }

    AddToList() {
        AnimatedValue.__list.push(this);
        if (!AnimatedValue.__frame) {
            AnimatedValue.__frame = requestAnimationFrame(AnimatedValue.__tick);
        }
    }
}

// AnimatedValue init
(function () {
    AnimatedValue.Linear = function (t) { return t; }
    AnimatedValue.easeIn = function (t) {
        return t*t*t;
    }

    AnimatedValue.easeOut = function (t) {
        t = 1 - t;
        return 1 - t * t * t;
    }

    AnimatedValue.__lastTick = 0;

    AnimatedValue.__tick = function () {
        let currentTime = Date.now();
        console.log('draw');

        for (let value of AnimatedValue.__list) {
            if (value.ended) {
                continue;
            }

            let t = (currentTime - value.startTime) / value.duration;
            if (isNaN(t)) {
                value.ended = true;
                continue;
            }

            if (t < 0) {
                continue;
            }
            if (t >= 1) {
                value.value = value.goal;
                value.ended = true;
            }
            else {
                value.value = (value.goal - value.startValue) * value.easing(t) + value.startValue;
            }
        }

        for (let value of AnimatedValue.__list) {
            if (value.onChange instanceof Function) {
                value.onChange.call(value, value.value, currentTime);
            }
        }

        AnimatedValue.__list = AnimatedValue.__list.filter((v) => !v.ended);
        if (AnimatedValue.__list.length) {
            AnimatedValue.__frame = requestAnimationFrame(AnimatedValue.__tick);
            AnimatedValue.__lastTick = currentTime;
        }
        else {
            AnimatedValue.__frame = 0;
            AnimatedValue.__lastTick = 0;
        }

    }
})()

class Biu {
    constructor(cxt, width = 480, height = 480) {
        this.cxt = cxt;
        this.bodyColor = '#FEE6A0';
        this.bellyColor = '#FFFFFF';
        this.eyeColor = '#533522';
        this.strockColor = '#442416';

        let lastUpdate = 0;
        let drawIfNecessery = (value, time) => {
            if (time != lastUpdate) {
                this.Draw();
                lastUpdate = time;
            }
        };

        this.scale = { x : width / 100.0, y : height / 100.0 };
        this.lookAt = {
            x : new AnimatedValue(0.5, drawIfNecessery),
            y : new AnimatedValue(0.5, drawIfNecessery)
        };
    }

    Draw() {
        this.cxt.resetTransform();
        this.cxt.scale(this.scale.x, this.scale.y);
        this.cxt.clearRect(0, 0, 100, 100);

        this.TailDraw();
        this.RightEarDraw();
        this.LeftEarDraw();
        this.BodyDraw();
        this.BellyDraw();
        this.FaceDraw();
        this.RightHandDraw();
        this.LeftHandDraw();
    }

    TailDraw() {
        let cxt = this.cxt;

        cxt.fillStyle = this.bodyColor;
        cxt.strokeStyle = this.strockColor;

        cxt.beginPath();
        cxt.moveTo(50, 58);
        cxt.bezierCurveTo(50, 47, 59, 37, 76, 40);
        cxt.bezierCurveTo(93, 43, 97, 54, 97, 64);
        cxt.bezierCurveTo(97, 74, 91, 79, 74, 79);
        cxt.bezierCurveTo(52, 79, 50, 68, 50, 58);

        cxt.fill();
        cxt.stroke();
    }

    RightEarDraw() {
        let cxt = this.cxt;
        let lookX = (this.lookAt.x.value - 0.5) * 2;
        let lookY = (this.lookAt.y.value - 0.5) * 2;

        cxt.fillStyle = this.bodyColor;
        cxt.strokeStyle = this.strockColor;

        cxt.save();
        cxt.translate(-(lookX > 0 ? lookX * 6 : lookX * 3), 0);
        cxt.beginPath();
        cxt.moveTo(73, 40);
        cxt.bezierCurveTo(73, 40 + lookY * -1, 81, 41 + lookY * -2, 81, 45 + lookY * -3);
        cxt.bezierCurveTo(81, 49 + lookY * -2, 74, 48 + lookY * -1, 74, 48);
        cxt.restore();

        cxt.fill();
        cxt.stroke();
    }

    LeftEarDraw() {
        let cxt = this.cxt;
        let lookX = (this.lookAt.x.value - 0.5) * 2;
        let lookY = (this.lookAt.y.value - 0.5) * 2;

        cxt.fillStyle = this.bodyColor;
        cxt.strokeStyle = this.strockColor;

        cxt.save();
        cxt.translate(-(lookX > 0 ? lookX * 3 : lookX * 6), 0);
        cxt.beginPath();
        cxt.moveTo(28, 40);
        cxt.bezierCurveTo(28, 40 + lookY * -1, 21, 40 + lookY * -2, 21, 45 + lookY * -3);
        cxt.bezierCurveTo(21, 50 + lookY * -2, 28, 47 + lookY * -1, 28, 47);
        cxt.restore();

        cxt.fill();
        cxt.stroke();
    }

    BodyDraw() {
        let cxt = this.cxt;

        cxt.fillStyle = this.bodyColor;
        cxt.strokeStyle = this.strockColor;

        cxt.beginPath();
        cxt.moveTo(51, 16);
        cxt.bezierCurveTo(62, 16, 73, 22, 75, 33);
        cxt.bezierCurveTo(75, 51, 78, 48, 79, 73);
        cxt.bezierCurveTo(79, 76, 75, 80, 71, 80);
        cxt.bezierCurveTo(67, 80, 31, 80, 27, 80);
        cxt.bezierCurveTo(23, 80, 19, 76, 19, 72);
        cxt.bezierCurveTo(19, 55, 25, 51, 25, 46);
        cxt.bezierCurveTo(25, 45, 25, 43, 25, 37);
        cxt.bezierCurveTo(25, 27, 35, 16, 51, 16);

        cxt.fill();
        cxt.stroke();
    }

    BellyDraw() {
        let cxt = this.cxt;

        cxt.fillStyle = this.bellyColor;

        cxt.beginPath();
        cxt.moveTo(68, 79);
        cxt.bezierCurveTo(75, 80, 72, 51, 50, 51);
        cxt.bezierCurveTo(28, 51, 25, 80, 32, 79);

        cxt.fill();
    }

    RightHandDraw() {
        let cxt = this.cxt;
        let lookX = this.lookAt.x.value;
        let lookY = (this.lookAt.y.value - 0.5) * 2;

        cxt.fillStyle = this.bodyColor;
        cxt.strokeStyle = this.strockColor;

        cxt.beginPath();
        cxt.moveTo(74, 49);
        cxt.bezierCurveTo(
                56 + (lookX - 0.5) * 6, 27 + (lookY > 0 ? lookY * 14 * lookX : 0),
                35 + (lookX - 0.5) * 4, 73 + ((lookY > 0 ? lookY * 6 * lookX : 0)),
                72, 74);

        cxt.fill();
        cxt.stroke();
    }

    LeftHandDraw() {
        let cxt = this.cxt;
        let lookX = this.lookAt.x.value;
        let lookY = (this.lookAt.y.value - 0.5) * 2;

        cxt.fillStyle = this.bodyColor;
        cxt.strokeStyle = this.strockColor;

        cxt.beginPath();
        cxt.moveTo(28, 47);
        cxt.bezierCurveTo(
                49 + (lookX - 0.5) * 6, 33 + (lookY > 0 ? lookY * 14 * (1 - lookX) : 0),
                60 + (lookX - 0.5) * 4, 70 + (lookY > 0 ? lookY * 6 * (1 - lookX) : 0),
                28, 76);

        cxt.fill();
        cxt.stroke();
    }

    FaceDraw() {
        let cxt = this.cxt;
        let lookX = (this.lookAt.x.value - 0.5) * 2;
        let lookY = (this.lookAt.y.value - 0.5) * 2;

        cxt.fillStyle = this.eyeColor;
        cxt.strockColor = this.strockColor;

        // right eye
        cxt.save();
        cxt.translate(64 + (lookX > 0 ? lookX * 6 : lookX * 12), 37 + lookY * 3 * (1 - lookX * 0.4));
        cxt.scale(lookX > 0 ? (1 - lookX * 0.2) : 1, 1 - Math.abs(lookY) * 0.1);
        cxt.beginPath();
        cxt.arc(0, 0, 4, 0, Math.PI * 2, true);
        cxt.fill();
        cxt.restore();

        // left eye
        cxt.save();
        cxt.translate(36 + (lookX > 0 ? lookX * 12 : lookX * 6), 37 + lookY * 3 * (1 + lookX * 0.4));
        cxt.scale(lookX < 0 ? (1 + lookX * 0.2) : 1, 1 - Math.abs(lookY) * 0.1);
        cxt.beginPath();
        cxt.arc(0, 0, 4, 0, Math.PI * 2, true);
        cxt.fill();
        cxt.restore();

        // mouth
        cxt.beginPath();
        cxt.moveTo(47 + (lookX > 0 ? lookX * 11 : lookX * 9), 41 + lookY * 5 * (0.8 + lookX * 0.1));
        cxt.lineTo(50 + lookX * 11, 35 + (lookY > 0 ? lookY * 7 : lookY * 4) * 0.8);
        cxt.lineTo(54 + (lookX > 0 ? lookX * 9 : lookX * 11), 41 + lookY * 5 * (0.8 - lookX * 0.1));
        cxt.stroke();
    }

    LookAt(x, y) {
        this.lookAt.x.Set(x);
        this.lookAt.y.Set(y);
    }

    LookTo(x, y, duration = 100, delay = 0) {
        this.lookAt.x.AnimateTo(x, duration, delay, AnimatedValue.easeOut);
        this.lookAt.y.AnimateTo(y, duration, delay, AnimatedValue.easeOut);
    }
}

(function () {
    let cxt = document.getElementById('biu').getContext('2d');
    let biu = new Biu(cxt);

    biu.Draw();

    let offset = $('#biu').offset();
    $('#biu').on('mousemove', function (e) {
        console.log('move');
        let x = (e.pageX - offset.left) / 480;
        let y = (e.pageY - offset.top) / 480;
        biu.LookTo(x, y);
    }).on('mouseleave', function (e) {
        biu.LookTo(0.5, 0.5, 200, 300);
    })
})();

