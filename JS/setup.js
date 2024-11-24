function setup(){
    createCanvas(windowWidth-40,windowHeight-40)
    setupGraphics()
}
function windowResized(){
    resizeCanvas(windowWidth-40,windowHeight-40)
}
function mouseClicked(){
    updateMouse(graphics.main[0])
    switch(stage.scene){
        case 'menu':
            for(let a=0,la=4;a<la;a++){
                for(let b=0,lb=2;b<lb;b++){
                    if(inPointBox({position:inputs.mouse},{position:{x:((a+0.5)/la*0.6+0.2)*width,y:80+b*70+(b>=2?20:0)+(b>=3?20:0)+(b>=4?20:0)+40},width:200,height:60})){
                        if(b==0){
                            menu.gaming=a+1
                        }else if(b==1){
                            menu.diff=a
                        }
                    }
                }
            }
            if(inPointBox({position:inputs.mouse},{position:{x:0.5*width,y:280},width:200,height:60})){
                game.players=game.level==11?menu.gaming:menu.players
                game.gaming=menu.gaming
                game.level=menu.level
                game.diff=menu.diff
                game.ammoMult=game.level==11?1:2
                game.lives=game.level==11?ceil(game.gaming/2):0
                entities.players=[]
                initialGraphics()
                newLoop()
                stage.scene='main'
            }
        break
    }
}
function keyPressed(){
    switch(key){
        case 'ArrowLeft': inputs.keys[0][0]=true;inputs.tap[0][0]=true; break
        case 'ArrowRight': inputs.keys[0][1]=true;inputs.tap[0][1]=true; break
        case 'ArrowUp': inputs.keys[0][2]=true;inputs.tap[0][2]=true; break
        case 'ArrowDown': inputs.keys[0][3]=true;inputs.tap[0][3]=true; break
        case 'a': case 'A': inputs.keys[1][0]=true;inputs.tap[1][0]=true; break
        case 'd': case 'D': inputs.keys[1][1]=true;inputs.tap[1][1]=true; break
        case 'w': case 'W': inputs.keys[1][2]=true;inputs.tap[1][2]=true; break
        case 's': case 'S': inputs.keys[1][3]=true;inputs.tap[1][3]=true; break
        case 'j': case 'J': inputs.keys[2][0]=true;inputs.tap[2][0]=true; break
        case 'l': case 'L': inputs.keys[2][1]=true;inputs.tap[2][1]=true; break
        case 'i': case 'I': inputs.keys[2][2]=true;inputs.tap[2][2]=true; break
        case 'k': case 'K': inputs.keys[2][3]=true;inputs.tap[2][3]=true; break
        case 'f': case 'F': inputs.keys[3][0]=true;inputs.tap[3][0]=true; break
        case 'h': case 'H': inputs.keys[3][1]=true;inputs.tap[3][1]=true; break
        case 't': case 'T': inputs.keys[3][2]=true;inputs.tap[3][2]=true; break
        case 'g': case 'G': inputs.keys[3][3]=true;inputs.tap[3][3]=true; break
    }
}
function keyReleased(){
    switch(key){
        case 'ArrowLeft': inputs.keys[0][0]=false; break
        case 'ArrowRight': inputs.keys[0][1]=false; break
        case 'ArrowUp': inputs.keys[0][2]=false; break
        case 'ArrowDown': inputs.keys[0][3]=false; break
        case 'a': case 'A': inputs.keys[1][0]=false; break
        case 'd': case 'D': inputs.keys[1][1]=false; break
        case 'w': case 'W': inputs.keys[1][2]=false; break
        case 's': case 'S': inputs.keys[1][3]=false; break
        case 'j': case 'J': inputs.keys[2][0]=false; break
        case 'l': case 'L': inputs.keys[2][1]=false; break
        case 'i': case 'I': inputs.keys[2][2]=false; break
        case 'k': case 'K': inputs.keys[2][3]=false; break
        case 'f': case 'F': inputs.keys[3][0]=false; break
        case 'h': case 'H': inputs.keys[3][1]=false; break
        case 't': case 'T': inputs.keys[3][2]=false; break
        case 'g': case 'G': inputs.keys[3][3]=false; break
    }
}