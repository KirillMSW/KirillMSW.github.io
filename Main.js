let planets = []
planetNum = 2
aimMode = true
targetNum=1
var button_w
var button_h

function setup() { //функция, задающая начальные условия игры
    createCanvas(window.innerWidth, window.innerHeight);
    frameRate(60);
    let cue = new Planet(Math.random() * window.innerWidth, //создание битка
                            Math.random() * window.innerHeight,
                            300, false,0)
    planets.push(cue)

    let regular = new Planet(Math.random() * window.innerWidth, //создание обычного шара
                            Math.random() * window.innerHeight,
                            300, false,1)
    planets.push(regular)

    for (let i = 0; i < targetNum; ++i){ //создание мишеней
        let pl = new Planet(Math.random() * window.innerWidth, 
        Math.random() * window.innerHeight,
        300, false,3)
        planetNum++
        planets.push(pl)
    }
   
    while (are_coliding())
        generate()


    planets[0].velocity=createVector(5, 5)


    button_w=min(window.innerWidth/5,144)

    button_h=min(window.innerHeight*0.10,40)

    plus_button = createButton('+'); //создание кнопок интерфейса
    plus_button.position((window.innerWidth ) / 2-2.5*button_w, window.innerHeight-button_h);
    plus_button.style('color', 'white')
    plus_button.style('background', '#1a1b26')
    plus_button.size(button_w,button_h)
    plus_button.mousePressed(plus);

    minus_button = createButton('-');
    minus_button.position((window.innerWidth ) / 2-1.5*button_w, window.innerHeight-button_h);
    minus_button.style('color', 'white')
    minus_button.style('background', '#1a1b26')
    minus_button.size(button_w,button_h)
    minus_button.mousePressed(minus);

    shot_button = createButton('Пуск');
    shot_button.position((window.innerWidth ) / 2-0.5*button_w, window.innerHeight-button_h);
    shot_button.style('color', 'white')
    shot_button.style('background', '#1a1b26')
    shot_button.size(button_w,button_h)
    shot_button.mousePressed(shot);

    left_button = createButton('↺');
    left_button.position((window.innerWidth ) / 2+0.5*button_w, window.innerHeight-button_h);
    left_button.style('color', 'white')
    left_button.style('background', '#1a1b26')
    left_button.size(button_w,button_h)
    left_button.mousePressed(left);

    right_button = createButton('↻');
    right_button.position((window.innerWidth ) / 2+1.5*button_w, window.innerHeight-button_h);
    right_button.style('color', 'white')
    right_button.style('background', '#1a1b26')
    right_button.size(button_w,button_h)
    right_button.mousePressed(right);

}


function draw() { //функция отрисовки поля
    const dt = 1 / frameRate() * 60
    angleMode(DEGREES);
    background("#1a1b26")
    var all_hit=true
    for (let i = 0; i < planetNum; ++i){
        for (let j = i + 1; j < planetNum; ++j){
            Planet.react(planets[i], planets[j])
        }
        Planet.wallCollide(planets[i])
        if (planets[i].type==3)
            all_hit=false
    }
    if (all_hit){
        are_moving=false
        for (let i = 0; i < planetNum; ++i){
            planets[i].move=false
        }
        alert("Вы выиграли!")
        generate()
        aimMode=true
    }
    
    var are_moving=false
    for (let i = planetNum-1; i >=0; --i){
        planets[i].update(dt)
        planets[i].render()
        if (planets[i].velocity.mag()>=0.1){
            are_moving=true
        }

    }
    if(!(aimMode)){
        if(!(are_moving)){
            aimMode=true
            for (let i = 0; i < planetNum; ++i){
                planets[i].move=false
            }
            planets[0].velocity=createVector(5, 5)
        }
    }
   
    
}


function are_coliding() { //функция, проыеряющая коллизии шаров в начальный момент времени
    for (let i = 0; i < planetNum; ++i){
        for (let j = i + 1; j < planetNum; ++j){
            var r = planets[i].position.dist(planets[j].position)
            if (r < planets[i].radius + planets[j].radius){
                console.log(i,j)
                return true

            }
        }
    }
    return false
    
}

function generate() { //функция повтороной генерации игрового поля
    planets=[]
    planetNum = 2

    let cue = new Planet(Math.random() * window.innerWidth, 
                            Math.random() * window.innerHeight,
                            300, false,0)
    planets.push(cue)

    let regular = new Planet(Math.random() * window.innerWidth, 
                            Math.random() * window.innerHeight,
                            300, false,1)
    planets.push(regular)

    for (let i = 0; i < targetNum; ++i){
        let pl = new Planet(Math.random() * window.innerWidth, 
        Math.random() * window.innerHeight,
        300, false,3)
        planetNum++
        planets.push(pl)
    }
   
    
    planets[0].velocity=createVector(5, 5)
    
}



function plus() { //функция, увеличивающая силу удара
    if (aimMode){
        const magnitude = planets[0].velocity.mag()
        planets[0].velocity.setMag(magnitude+2)
    }
}

function minus() { //функция, уменьшающая силу удара
    if (aimMode){
        const magnitude = planets[0].velocity.mag()
        if (magnitude>5)
            planets[0].velocity.setMag(magnitude-2)
    }
}

function shot() { //функция удара по битку
    if (aimMode){
        aimMode=false
        for (let i = 0; i < planetNum; ++i){
            planets[i].move=true
        }
    }
}

function left() { //отклонение направления удара битком против часовой стрелки
    if (aimMode){
    planets[0].velocity.rotate(-5)
    }
}

function right() { //отклонение направления удара битком по часовой стрелке
    if (aimMode){
    planets[0].velocity.rotate(5)
    }
}
