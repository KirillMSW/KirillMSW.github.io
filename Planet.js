class Planet{
    constructor(x=0, y=0, m=100,mv,type) { //конструктор шара
        this.move = mv
        this.mass = m
        this.acceleration = createVector(0, 0)
        this.velocity = createVector(0, 0)
        this.position = createVector(x, y)
        this.radius = m / 10
        this.g = 6
        this.k = 1
        this.type = type
        if (type==0)
            this.color = color("#FFFFFF")
        else if (type==1)
            this.color = color("#66CDAA")
        else{
            this.color = color("#FF0000")
            this.radius*=3
        }
        

    }

    update(dt){ //метод, обновляющий шар
        const zero_vector=createVector(0, 0)
        this.acceleration.mult(dt)
        this.velocity.add(this.acceleration)
        this.acceleration = createVector(0, 0)
        const dPos = this.velocity.copy().mult(dt)
        if (this.move)
            this.position.add(dPos)
        if ((this.move)){
            const magnitude = this.velocity.mag()
            this.velocity.setMag(magnitude-0.01)
        }
    }

    applyForce(force){ //метод, прикладывющщий к шару силу
        let fc = force.copy()
        fc.div(this.mass)
        this.acceleration.add(fc)
    }

    render(){ //метод отрисовки шара
        fill(this.color)
        noStroke()
        circle(this.position.x, this.position.y, this.radius * 2)
        stroke(color(255, 0, 0));
        strokeWeight(4);

        const dPos=this.position.copy().add(this.velocity.copy().mult(5))
        line(this.position.x,this.position.y, dPos.x,dPos.y)
    }

    static react(pl1, pl2){ //метод взаимодействи с другими шарами
        const r = pl1.position.dist(pl2.position)
        if (r < pl1.radius + pl2.radius){
            if ((pl1.type==3)&&(pl2.type==1)){
                pl1.type=4
                pl1.color="#008000"
            }
            if ((pl2.type==3)&&(pl1.type==1)){
                pl2.type=4
                pl2.color="#008000"
            }
            if ((pl1.type<3)&&(pl2.type<3))
                this.collide(pl1, pl2)
        }
            
        
    }

    static vectorProjection(a, b){ //метод проекции вектора
        let bCopy = b.copy().normalize()
        const sp = a.dot(bCopy)
        bCopy.mult(sp)
        return bCopy
    }

    static collide(pl1, pl2){ //метод коллизии шаров друг с другом
        const tmpDir12 = createVector(pl2.position.x - pl1.position.x, pl2.position.y - pl1.position.y)
        const offset = tmpDir12.mag() - (pl1.radius + pl2.radius)
        pl1.position.add(tmpDir12.copy().normalize().mult(offset / 2))
        pl2.position.add(tmpDir12.copy().normalize().mult(-offset / 2))
        const direction12 = createVector(pl2.position.x - pl1.position.x, pl2.position.y - pl1.position.y)
        const direction21 = createVector(pl1.position.x - pl2.position.x, pl1.position.y - pl2.position.y)
        const pl1ImpFrac = pl2.mass / (pl1.mass + pl2.mass)
        const pl2ImpFrac = pl1.mass / (pl1.mass + pl2.mass)
        const impulse1Dir = this.vectorProjection(pl1.velocity, direction12).mult(pl1.mass)
        const impulse2Dir = this.vectorProjection(pl2.velocity, direction21).mult(pl2.mass)
        const totalImpulse = impulse1Dir.copy().add(impulse2Dir.copy().mult(-1))
        const resImpulse1 = totalImpulse.copy().mult(-pl1ImpFrac).mult(pl1.k * pl2.k)
        const resImpulse2 = totalImpulse.copy().mult(pl2ImpFrac).mult(pl1.k * pl2.k)
        const stop1Force = this.vectorProjection(pl1.velocity, direction12).mult(pl1.mass).mult(-1)
        const stop2Force = this.vectorProjection(pl2.velocity, direction21).mult(pl2.mass).mult(-1)
        pl1.applyForce(stop1Force)
        pl2.applyForce(stop2Force)
        pl1.applyForce(resImpulse1)
        pl2.applyForce(resImpulse2)
    }

    static wallCollide(pl){ //метод коллизии шара со стеной
        if (pl.position.x - pl.radius <= 0 || pl.position.x + pl.radius >= window.innerWidth){
            pl.velocity.x *= -0.7
        }
        if (pl.position.y - pl.radius <= 0 || pl.position.y + pl.radius >= window.innerHeight-button_h)
            pl.velocity.y *= -0.7
        
        if (pl.position.x - pl.radius <= 0)
            pl.position.x=0+pl.radius
        if (pl.position.x + pl.radius >= window.innerWidth)
            pl.position.x=window.innerWidth-pl.radius
        if (pl.position.y - pl.radius <= 0)
            pl.position.y=0+pl.radius
        if (pl.position.y + pl.radius >= window.innerHeight - button_h)
            pl.position.y=window.innerHeight-pl.radius-button_h
       
    }
}