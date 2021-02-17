class MotionPicture { // main timeline of experience
    constructor() {
        // Set - To prepare the stage for action.
        const canvas = document.getElementById('stage');
        const ctx = canvas.getContext('2D');

        this.mttr = {};
        this.mtnPct = {
            canvas: canvas,
            ctx: ctx,
            width: window.innerWidth,
            height: window.innerHeight
        };

        this.mtnPct.canvas.width = this.mtnPct.width;
        this.mtnPct.canvas.height = this.mtnPct.height;

        // Preload
        // this.preload = new Prealod(this.mtnPct);

        // Window Resize

        // Stage
        this.setStage();

        // Master Timeline
        this.masterTimeline();

        // Renderer
        gsap.ticker.fps(60);
        gsap.ticker.add(()=>{this.render()});
    }

    setStage(){
        this.mttr.engine = Matter.Engine.create({ 
            render:{
                canvas: this.mtnPct.canvas,
                options: {
                    background: 'pink',
                    width: this.mtnPct.width,
                    height: this.mtnPct.height,
                    wireframes: false,
                    showAngleIndicator: true,
                }
            }
        });

        this.mttr.bounds = new SceneBounds({mttr: this.mttr, mtnPc:this.mtnPct});
        // this.mttr.square = new Square({ mttr: this.mttr, x: 100, y:  100, w:  10, h:  10 });

        this.mtnPct.particles = [];
        for (let i = 0; i < 10; i++) {
            this.mtnPct.particles.push(
                new Square({ mttr: this.mttr, x: 100, y:  100, w:  10, h:  10 })
            )
        }


        Matter.World.add(
            this.mttr.engine.world,
            [
                ...this.mttr.bounds,
                ...this.mtnPct.particles
            ]
        );
    }

    masterTimeline(){
        this.mstrTl = gsap.timeline({repeat:1, yoyo:true});
        this.mstrTl.timeScale(2);

        for (let i = 0; i < this.mtnPct.particles.length; i++) {
            this.mstrTl.to(this.mtnPct.particles[i].positionImpulse, {duration:1, x:0.5})
        }
    }

    render(time, deltaTime, frame){
        Matter.Render.world(this.mttr.engine);
        Matter.Engine.update(this.mttr.engine);
    }
}

class Square { // Thingamajig
    constructor(_doofer){
        this.mttr = _doofer.mttr;   
        this.x = _doofer.x;
        this.y = _doofer.y;
        this.w = _doofer.w;
        this.h = _doofer.h;

        return this.rectangle();
    }

    rectangle(){
        return this.square = Matter.Bodies.rectangle(this.x, this.y, this.w, this.h);
    }
}

class SceneBounds { // Evironment
    constructor(_doofer){
        this.mtnPc = _doofer.mtnPc;
        this.mttr = _doofer.mttr;

        return this.setBounds();
    }

    setBounds(){
        this.roof = Matter.Bodies.rectangle(this.mtnPc.width/2, 0, this.mtnPc.width, 10, {isStatic:true, render:{ fillStyle:'#285577'}});
        this.roof.id = 'roof';
        this.floor = Matter.Bodies.rectangle(this.mtnPc.width/2, this.mtnPc.height, this.mtnPc.width, 10, {isStatic:true, render:{ fillStyle:'#285577'}});
        this.floor.id = 'floor';
        this.leftWall = Matter.Bodies.rectangle(0, this.mtnPc.height/2, 10, this.mtnPc.height, {isStatic:true, render:{ fillStyle:'#285577'}});
        this.leftWall.id = 'leftWall';
        this.rightWall = Matter.Bodies.rectangle(this.mtnPc.width, this.mtnPc.height/2, 10, this.mtnPc.height, {isStatic:true, render:{ fillStyle:'#285577'}});
        this.rightWall.id = 'rightWall';
        
        return [this.roof, this.floor, this.leftWall, this.rightWall];
    }
}

window.addEventListener('load', (event) => {new MotionPicture();});