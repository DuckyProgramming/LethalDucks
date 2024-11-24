function mainloop(layer){
    clear()
    background(150)
    switch(stage.scene){
        case 'menu':
            for(let a=0,la=4;a<la;a++){
                for(let b=0,lb=2;b<lb;b++){
                    if(b==0&&menu.gaming==a+1||b==1&&menu.diff==a){
                        fill(100,200,100)
                    }else{
                        fill(100)
                    }
                    rect(((a+0.5)/la*0.6+0.2)*width,120+b*70,200,60,10)
                }
            }
            fill(100)
            rect(0.5*width,280,200,60,10)
            fill(0)
            for(let a=0,la=4;a<la;a++){
                for(let b=0,lb=2;b<lb;b++){
                    textSize(20)
                    text(b==0?`${a+1} Gaming`:b==1?`${['Easy','Medium','Hard','Expert'][a]}`:``,((a+0.5)/la*0.6+0.2)*width,80+b*70+(b>=2?20:0)+(b>=3?20:0)+(b>=4?20:0)+40)
                }
            }
            text('Begin',0.5*width,280)
        break
        case 'main':
            let effective=[]
            let key=[]
            let bs=[]
            for(let c=0,lc=game.gaming;c<lc;c++){
                graphics.main[c].background(30)
                key.push(dev.sight?10:entities.players[c].parachute?4:entities.players[c].weaponType==6||entities.players[c].weaponType==12||entities.players[c].weaponType==92||entities.players[c].weaponType==93?2:1)
                if(game.level==11){
                    key[c]/=2
                }
                bs.push([])
                effective.push([constrain(entities.players[c].position.x,graphics.main[c].width/2*key[c],game.edge[0]-graphics.main[c].width/2*key[c]),constrain(entities.players[c].position.y,graphics.main[c].height/2*key[c],game.edge[1]-graphics.main[c].height/2*key[c])])
            }
            for(let a=0,la=graphics.main.length;a<la;a++){
                graphics.main[a].push()
                graphics.main[a].translate(graphics.main[a].width/2,graphics.main[a].height/2)
                graphics.main[a].scale(1/key[a])
                graphics.main[a].translate(-effective[a][0],-effective[a][1])
                graphics.main[a].fill(0,5,15)
                if(460>effective[a][1]-graphics.main[a].height*0.5){
                    graphics.main[a].rect(effective[a][0],230,graphics.main[a].width*key[a],460)
                }
                if(940>effective[a][1]-graphics.main[a].height*0.5){
                    graphics.main[a].rect(game.edge[0]/2,700,1430,480)
                }
            }
            for(let c=0,lc=game.gaming;c<lc;c++){
                for(let a=0,la=run.fore.length;a<la;a++){
                    for(let b=0,lb=run.fore[a].length;b<lb;b++){
                        if(
                            run.fore[a][b].position.x+run.fore[a][b].width>effective[c][0]-graphics.main[c].width*key[c]*0.6&&
                            run.fore[a][b].position.x-run.fore[a][b].width<effective[c][0]+graphics.main[c].width*key[c]*0.6&&
                            run.fore[a][b].position.y+run.fore[a][b].height>effective[c][1]-graphics.main[c].height*key[c]*0.6&&
                            run.fore[a][b].position.y-run.fore[a][b].height<effective[c][1]+graphics.main[c].height*key[c]*0.6
                        ){
                            run.fore[a][b].display(graphics.main[c])
                            bs[c].push(b)
                        }
                    }
                }
            }
            for(let a=0,la=bs.length;a<la;a++){
                for(let b=0,lb=bs[a].length;b<lb;b++){
                    run.fore[2][bs[a][b]].displayOver(graphics.main[a])
                }
            }
            for(let c=0,lc=game.gaming;c<lc;c++){
                for(let a=0,la=run.info.length;a<la;a++){
                    for(let b=0,lb=run.info[a].length;b<lb;b++){
                        if(
                            run.info[a][b].position.x+run.info[a][b].width>effective[c][0]-graphics.main[c].width*key[c]*0.6&&
                            run.info[a][b].position.x-run.info[a][b].width<effective[c][0]+graphics.main[c].width*key[c]*0.6&&
                            run.info[a][b].position.y+run.info[a][b].height>effective[c][1]-graphics.main[c].height*key[c]*0.6&&
                            run.info[a][b].position.y-run.info[a][b].height<effective[c][1]+graphics.main[c].height*key[c]*0.6
                        ){
                            run.info[a][b].displayInfo(graphics.main[c])
                        }
                    }
                }
            }
            for(let a=0,la=graphics.main.length;a<la;a++){
                graphics.main[a].pop()
            }
            if(display.anim>0){
                display.anim-=0.01
            }
            if(display.win>0){
                display.win-=0.01
            }
            displayMain(graphics.main,graphics.over,effective,key)
            for(let a=0,la=run.update.length;a<la;a++){
                for(let b=0,lb=run.update[a].length;b<lb;b++){
                    run.update[a][b].update()
                    if(run.update[a][b].remove){
                        run.update[a].splice(b,1)
                        b--
                        lb--
                    }
                }
            }
            checkEnd(levels[game.level],graphics.main[0])
            inputs.tap=[[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]]
        break
    }
    game.time++
}
function draw(){
    mainloop(graphics.main)
}