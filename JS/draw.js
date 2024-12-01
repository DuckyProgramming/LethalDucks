function mainloop(layer){
    clear()
    background(150)
    switch(stage.scene){
        case 'menu':
            for(let a=0,la=3;a<la;a++){
                for(let b=0,lb=a==2?6:4;b<lb;b++){
                    if(a==0&&menu.gaming==b+1||a==1&&menu.diff==b||a==2&&menu.hunt==b&&b<5||a==2&&b==5&&menu.hunt==-1){
                        fill(100,200,100)
                    }else{
                        fill(100)
                    }
                    rect(width/2-lb*100+100+b*200,120+a*70,180,60,10)
                }
            }
            fill(100)
            rect(0.5*width,360,180,60,10)
            fill(0)
            for(let a=0,la=3;a<la;a++){
                for(let b=0,lb=a==2?6:4;b<lb;b++){
                    textSize(20)
                    text([`${b+1} Gaming`,`${['Easy','Medium','Hard','Expert'][b]}`,`${['Standard','Hunt Player 1','Hunt Player 2','Hunt Player 3','Hunt Player 4','Battle Royale'][b]}`][a],width/2-lb*100+100+b*200,120+a*70)
                }
            }
            text('Begin',0.5*width,360)
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
            if(game.hunt==-1){
                if(game.storm>300){
                    game.storm-=0.25
                }
            }
            for(let a=0,la=graphics.main.length;a<la;a++){
                graphics.main[a].push()
                graphics.main[a].translate(graphics.main[a].width/2,graphics.main[a].height/2)
                graphics.main[a].scale(1/key[a])
                graphics.main[a].translate(-effective[a][0],-effective[a][1])
                graphics.main[a].fill(0,5,15)
                if(460>effective[a][1]-graphics.main[a].height*key[a]){
                    graphics.main[a].rect(effective[a][0],230,graphics.main[a].width*key[a],460)
                }
                if(940>effective[a][1]-graphics.main[a].height*key[a]){
                    graphics.main[a].rect(game.edge[0]/2,700,1430,480)
                }
                graphics.main[a].fill(150,0,150,0.1)
                graphics.main[a].stroke(150,0,150)
                graphics.main[a].strokeWeight(4)
                if(game.hunt==-1){
                    if(game.center-game.storm>effective[a][0]-graphics.main[a].height*key[a]){
                        graphics.main[a].rect(game.center-game.edge[0],game.edge[1]/2,game.edge[0]*2-game.storm*2,game.edge[1])
                    }
                    if(game.center+game.storm<effective[a][0]+graphics.main[a].height*key[a]){
                        graphics.main[a].rect(game.center+game.edge[0],game.edge[1]/2,game.edge[0]*2-game.storm*2,game.edge[1])
                    }
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
                            if(a==2){
                                bs[c].push(b)
                            }
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