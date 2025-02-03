class player{
    constructor(layer,x,y,id,control,inputs,primary,type,index){
        layer=layer
        this.position={x:x,y:y}
        this.id=id
        this.control=control
        this.inputs=inputs
        this.primary=primary
        this.type=type
        this.index=index
        this.playerData=types.player[this.type]
        this.weaponType=this.playerData.weapon
        this.weaponData=this.weaponType==-1?{name:'None'}:types.weapon[this.weaponType]
        this.selector=0
        this.width=8*((game.level==1||game.level==6)&&this.playerData.sizeBuff>1?this.playerData.sizeBuff*0.1+0.9:this.playerData.sizeBuff)
        this.height=24*((game.level==1||game.level==6)&&this.playerData.sizeBuff>1?this.playerData.sizeBuff*0.1+0.9:this.playerData.sizeBuff)
        this.fade=0
        this.size=0.5*((game.level==1||game.level==6)&&this.playerData.sizeBuff>1?this.playerData.sizeBuff*0.1+0.9:this.playerData.sizeBuff)
        this.life=100*this.playerData.lifeBuff
        if(game.pvp&&this.id>0){
            this.life*=2/3
        }
        if(this.id>=game.gaming+1){
            this.life*=1.5
        }
        this.dead=false
        this.velocity={x:0,y:0}
        this.offset={position:{x:0,y:12*((game.level==1||game.level==6)&&this.playerData.sizeBuff>1?this.playerData.sizeBuff*0.1+0.9:this.playerData.sizeBuff)}}
        this.previous={position:{x:this.position.x,y:this.position.y}}
        this.infoAnim={life:1,ammo:[0,0,0,0],uses:[0,0,0,0],ammoA:[0,0,0,0],usesA:[0,0,0,0],ammoB:[0,0,0,0],usesB:[0,0,0,0]}
        this.jump={time:0,double:0,triple:0,quadruple:0,active:0}
        this.base={life:this.life,position:{x:this.position.x,y:this.position.y},control:0}
        this.collect={life:this.life,time:0}
        this.record={life:this.life}
        this.weapon={ammo:this.weaponData.ammo,cooldown:0,reload:0,uses:(this.weaponData.uses==1?this.weaponData.uses:this.weaponData.uses*game.ammoMult),reloading:false}
        this.DOT={damage:0,active:0}
        this.die={timer:0,killer:"none"}
        this.stats={kills:0,deaths:0,damage:0,bust:0}
        this.invincible=0
        if(this.playerData.name=='Spy'||this.playerData.name=='SpyHealSelf'||this.playerData.name=='RapidSpy'||this.playerData.name=='SpyTank'||this.playerData.name=='CritSpy'||this.playerData.name=='RevolverSpy'||game.randomizer){
            this.copy=floor(random(0,game.players))
        }
        if(this.weaponType==14||this.weaponType==66||this.playerData.name=='HyperPistol'||this.playerData.name=='CritHyperPistol'||this.playerData.name=='BigHyperPistol'||this.playerData.name=='HyperCaffeinePistol'||this.playerData.name=='BigHyperMultiMedic'||this.playerData.name=='HyperTank'||this.playerData.name=='HyperShotgun'||game.randomizer){
            this.active=0
        }
        this.visible=0
        this.setupGraphics()
        this.manage=[0,0,0]
        this.infoAnim.bar=[0,0]
        this.target={position:{x:this.position.x,y:this.position.y},index:0}
        this.time=0
        this.critBuff=0
        this.defendBuff=0
        this.stunTime=0
        this.stuckTime=0
        this.vulnerableTime=0
        this.confuseTime=0
        this.bounceTime=0
        this.dizzyTime=0
        this.chillTime=0
        this.exploded=false
        this.thrown=false
        this.parachute=false
        this.disable=false
        this.attacking=0
        this.construct=false
        this.sidekick=false
        this.inspect=[]
        this.scan=[0,0,0,0,0,0,0,0,0]
        this.firearc=[0,0]
        this.lastingForce=[0,0]
        this.pointer={x:0,y:0,fails:0,hit:false}
        this.free=false
        this.assort={detonate:0}
        this.carryMoney=0
        this.inactive=(this.id==0||this.id!=game.hunt&&game.hunt>0)&&game.level==11

        this.subPlayerAType=0
        this.subPlayerBType=0
        this.subPlayerAData=types.player[this.subPlayerAType]
        this.subPlayerBData=types.player[this.subPlayerBType]
        this.subWeaponAType=0
        this.subWeaponBType=0
        this.subWeaponAData=types.weapon[this.subWeaponAType]
        this.subWeaponBData=types.weapon[this.subWeaponBType]
        this.subWeaponA={ammo:this.subWeaponAData.ammo,cooldown:0,reload:0,uses:(this.subWeaponAData.uses==1?this.subWeaponAData.uses:this.subWeaponAData.uses*game.ammoMult),reloading:false}
        this.subWeaponB={ammo:this.subWeaponBData.ammo,cooldown:0,reload:0,uses:(this.subWeaponBData.uses==1?this.subWeaponBData.uses:this.subWeaponBData.uses*game.ammoMult),reloading:false}

        if(this.id>0&&game.randomizer){
            this.multLife(2)
        }
        if(this.id!=1&&game.assault){
            this.multLife(0.5)
        }
        /*if(this.id==0){
            this.critBuff=999999
            this.multLife(2)
        }*/
    }
    multLife(value){
        this.life*=value
        this.base.life*=value
        this.collect.life*=value
        this.record.life*=value
    }
    setupGraphics(){
        this.direction=(this.position.x<game.edge[0]/2&&entities.players.length<=1||entities.players.length>1&&this.position.x<entities.players[0].position.x)?{main:54,goal:54}:{main:-54,goal:-54}
        this.skin={
            body:{fade:1,display:true,level:-19},
            head:{fade:1,display:true,level:-38},
            legs:[
                {fade:1,display:true,anim:{theta:24,phi:90},length:10,points:{base:{start:{x:3,y:-15},end:{x:0,y:0}},final:{start:{x:0,y:0},end:{x:0,y:0}}}},
                {fade:1,display:true,anim:{theta:24,phi:-90},length:10,points:{base:{start:{x:3,y:-15},end:{x:0,y:0}},final:{start:{x:0,y:0},end:{x:0,y:0}}}}
            ],arms:[
                {fade:1,display:true,anim:{theta:54,phi:90},length:10,points:{base:{start:{x:3,y:-25},end:{x:0,y:0}},final:{start:{x:0,y:0},end:{x:0,y:0}}}},
                {fade:1,display:true,anim:{theta:54,phi:-90},length:10,points:{base:{start:{x:3,y:-25},end:{x:0,y:0}},final:{start:{x:0,y:0},end:{x:0,y:0}}}}
            ]
        }
        this.face={
            beak:{
                main:{fade:1,display:true,level:-33},
                mouth:{fade:1,display:true,level:-33},
                nostril:{fade:1,display:true,level:-34.5}
            },eye:[
                {fade:1,display:true,anim:0,spin:-18,level:-40},
                {fade:1,display:true,anim:0,spin:18,level:-40}
            ]
        }
        this.setColor()
        this.animSet={loop:0,flip:0}
    }
    calculateParts(){
        for(let a=0,la=2;a<la;a++){
            this.skin.legs[a].points.base.end.x=this.skin.legs[a].points.base.start.x+lsin(this.skin.legs[a].anim.theta)*this.skin.legs[a].length
            this.skin.legs[a].points.base.end.y=this.skin.legs[a].points.base.start.y+lcos(this.skin.legs[a].anim.theta)*this.skin.legs[a].length
            this.skin.legs[a].points.final.start.x=this.skin.legs[a].points.base.start.x*lsin(this.skin.legs[a].anim.phi+this.direction.main),
            this.skin.legs[a].points.final.start.y=this.skin.legs[a].points.base.start.y
            this.skin.legs[a].points.final.end.x=this.skin.legs[a].points.base.end.x*lsin(this.skin.legs[a].anim.phi+this.direction.main),
            this.skin.legs[a].points.final.end.y=this.skin.legs[a].points.base.end.y
            this.skin.arms[a].points.base.end.x=this.skin.arms[a].points.base.start.x+lsin(this.skin.arms[a].anim.theta)*this.skin.arms[a].length
            this.skin.arms[a].points.base.end.y=this.skin.arms[a].points.base.start.y+lcos(this.skin.arms[a].anim.theta)*this.skin.arms[a].length
            this.skin.arms[a].points.final.start.x=this.skin.arms[a].points.base.start.x*lsin(this.skin.arms[a].anim.phi+this.direction.main),
            this.skin.arms[a].points.final.start.y=this.skin.arms[a].points.base.start.y
            this.skin.arms[a].points.final.end.x=this.skin.arms[a].points.base.end.x*lsin(this.skin.arms[a].anim.phi+this.direction.main),
            this.skin.arms[a].points.final.end.y=this.skin.arms[a].points.base.end.y
        }
    }
    runAnim(rate){
        this.animSet.loop+=rate
        for(let a=0,la=2;a<la;a++){
            this.skin.legs[a].anim.phi=90*(1-a*2)+lsin((this.animSet.loop+this.animSet.flip)*360)*75
            this.skin.arms[a].anim.phi=90*(1-a*2)+lsin((this.animSet.loop+this.animSet.flip)*360)*60
        }
    }
    displayBack(){
        if(this.primary&&this.id>0){
        }
    }
    displayInfo(layer,offsetX=0,offsetY=0){
        layer.push()
        layer.translate(this.position.x+this.offset.position.x+offsetX,this.position.y-42.5*this.playerData.sizeBuff+this.offset.position.y+offsetY)
        layer.noStroke()
        layer.fill(180,this.fade)
        layer.noStroke()
        layer.textSize(10)
        if(!this.sidekick){
            if(game.newStats){
                if(this.playerData.name=='PlayerSpy'){
                    layer.text('Pistol',0,-17.5)
                }else if(this.id>0&&game.past){
                    layer.text(`Wins: ${game.wins[this.id-1]}`,0,-35)
                    layer.text(this.playerData.name,0,-18.5)
                }else if(this.construct){
                    layer.text(`Damage: ${regNum(this.stats.damage)}`,0,-38)
                }else if(this.playerData.name=='Spy'||this.playerData.name=='SpyHealSelf'||this.playerData.name=='RapidSpy'||this.playerData.name=='SpyTank'||this.playerData.name=='CritSpy'||this.playerData.name=='RevolverSpy'){
                    layer.text(`Damage: ${regNum(entities.players[this.copy].stats.damage)}\nDeaths: ${entities.players[this.copy].stats.deaths}\nWeapon: ${entities.players[this.copy].weaponType==-1?`None`:entities.players[this.copy].weaponData.name}`,0,-35)
                }else if(game.randomizer&&this.id>0){
                    layer.text(`Damage: ${regNum(this.stats.damage)}\nDeaths: ${this.stats.deaths}`,0,-38)
                    layer.text(this.playerData.name,0,-18.5)
                }else if(this.id>0){
                    if(game.level==13){
                        layer.text(`Damage: ${regNum(this.stats.damage)}\nDeaths: ${this.stats.deaths}\nWeapon: ${game.weapon[this.id-1].length}/3`,0,-35)
                    }else if(game.level==14){
                        layer.text(`Damage: ${regNum(this.stats.damage)}\nDeaths: ${this.stats.deaths}\nWeapon: ${game.weapon[this.id-1].length}/${game.peakWeapon?1:4}`,0,-35)
                    }else{
                        layer.text(`Damage: ${regNum(this.stats.damage)}\nDeaths: ${this.stats.deaths}\nWeapon: ${this.weaponType==-1?`None`:this.weaponData.name+(this.playerData.name==`PlayerConglomeration`?`[${this.subWeaponAData.name},${this.subWeaponBData.name}]`:``)}`,0,-35)
                    }
                }else{
                    layer.text(this.playerData.name,0,-17.5)
                }
            }else{
                if(this.playerData.name=='PlayerSpy'){
                    layer.text('Pistol',0,-17.5)
                }else if(this.id>0&&game.past){
                    layer.text(`Wins: ${game.wins[this.id-1]}`,0,-35)
                    layer.text(this.playerData.name,0,-18.5)
                }else if(this.construct){
                    layer.text(`Kills: ${this.stats.kills}`,0,-38)
                }else if(this.playerData.name=='Spy'||this.playerData.name=='SpyHealSelf'||this.playerData.name=='RapidSpy'||this.playerData.name=='SpyTank'||this.playerData.name=='CritSpy'||this.playerData.name=='RevolverSpy'){
                    layer.text(`Kills: ${entities.players[this.copy].stats.kills}\nDeaths: ${entities.players[this.copy].stats.deaths}\nWeapon: ${entities.players[this.copy].weaponType==-1?`None`:entities.players[this.copy].weaponData.name}`,0,-35)
                }else if(game.randomizer&&this.id>0){
                    layer.text(`Kills: ${this.stats.kills}\nDeaths: ${this.stats.deaths}`,0,-38)
                    layer.text(this.playerData.name,0,-18.5)
                }else if(this.id>0){
                    if(game.level==13){
                        layer.text(`Kills: ${this.stats.kills}\nDeaths: ${this.stats.deaths}\nWeapon: ${game.weapon[this.id-1].length}/3`,0,-35)
                    }else if(game.level==14){
                        layer.text(`Kills: ${this.stats.kills}\nDeaths: ${this.stats.deaths}\nWeapon: ${game.weapon[this.id-1].length}/${game.peakWeapon?1:4}`,0,-35)
                    }else{
                        layer.text(`Kills: ${this.stats.kills}\nDeaths: ${this.stats.deaths}\nWeapon: ${this.weaponType==-1?`None`:this.weaponData.name+(this.playerData.name==`PlayerConglomeration`?`[${this.subWeaponAData.name},${this.subWeaponBData.name}]`:``)}`,0,-35)
                    }
                }else{
                    layer.text(this.playerData.name,0,-17.5)
                }
            }
        }
        layer.fill(150,this.fade*this.infoAnim.life)
        layer.rect(0,0,30,4,2)
        if(this.id>0&&this.playerData.name!='PlayerSpy'||this.playerData.name=='Spy'||this.playerData.name=='SpyHealSelf'||this.playerData.name=='RapidSpy'||this.playerData.name=='SpyTank'||this.playerData.name=='CritSpy'||this.playerData.name=='RevolverSpy'){
            if(!game.randomizer){
                if(this.weaponType>=0){
                    if(this.weaponData.ammo>4){
                        layer.rect(0,-14,30,4,2)
                        layer.fill(200,this.fade*this.infoAnim.life)
                        layer.rect(-15+15*this.weapon.ammo/this.weaponData.ammo,-14,30*this.weapon.ammo/this.weaponData.ammo,4,2)
                    }else{
                        for(let a=0,la=this.weapon.ammo;a<la;a++){
                            layer.fill(150,this.fade*this.infoAnim.ammo[a])
                            layer.ellipse(-12+a*8,-14,6)
                            layer.fill(200,this.fade*this.infoAnim.ammo[a])
                            layer.ellipse(-12+a*8,-14,4)
                        }
                    }
                    layer.fill(150,this.fade*this.infoAnim.life)
                    if((this.weaponData.uses*game.ammoMult)>4){
                        layer.rect(0,-7,30,4,2)
                        layer.fill(0,150,255,this.fade*this.infoAnim.life)
                        if(this.weapon.uses>0){
                            layer.rect(-15+15*this.weapon.uses/(this.weaponData.uses*game.ammoMult),-7,30*this.weapon.uses/(this.weaponData.uses*game.ammoMult),4,2)
                        }
                    }else{
                        for(let a=0,la=this.weapon.uses;a<la;a++){
                            layer.fill(0,100,200,this.fade*this.infoAnim.uses[a])
                            layer.ellipse(-12+a*8,-7,6)
                            layer.fill(0,150,255,this.fade*this.infoAnim.uses[a])
                            layer.ellipse(-12+a*8,-7,4)
                        }
                    }
                    if(this.playerData.name=='PlayerConglomeration'){
                        if(this.subWeaponAData.ammo>4){
                            layer.fill(150,this.fade*this.infoAnim.life)
                            layer.rect(-32,-14,30,4,2)
                            layer.fill(200,this.fade*this.infoAnim.life)
                            layer.rect(-47+15*this.subWeaponA.ammo/this.subWeaponAData.ammo,-14,30*this.subWeaponA.ammo/this.subWeaponAData.ammo,4,2)
                        }else{
                            for(let a=0,la=this.subWeaponA.ammo;a<la;a++){
                                layer.fill(150,this.fade*this.infoAnim.ammoA[a])
                                layer.ellipse(-44+a*8,-14,6)
                                layer.fill(200,this.fade*this.infoAnim.ammoA[a])
                                layer.ellipse(-44+a*8,-14,4)
                            }
                        }
                        if(this.subWeaponBData.ammo>4){
                            layer.fill(150,this.fade*this.infoAnim.life)
                            layer.rect(32,-14,30,4,2)
                            layer.fill(200,this.fade*this.infoAnim.life)
                            layer.rect(17+15*this.subWeaponB.ammo/this.subWeaponBData.ammo,-14,30*this.subWeaponB.ammo/this.subWeaponBData.ammo,4,2)
                        }else{
                            for(let a=0,la=this.subWeaponB.ammo;a<la;a++){
                                layer.fill(150,this.fade*this.infoAnim.ammoB[a])
                                layer.ellipse(20+a*8,-14,6)
                                layer.fill(200,this.fade*this.infoAnim.ammoB[a])
                                layer.ellipse(20+a*8,-14,4)
                            }
                        }
                        layer.fill(150,this.fade*this.infoAnim.life)
                        if((this.subWeaponAData.uses*game.ammoMult)>4){
                            layer.fill(150,this.fade*this.infoAnim.life)
                            layer.rect(-32,-7,30,4,2)
                            layer.fill(0,150,255,this.fade*this.infoAnim.life)
                            if(this.subWeaponA.uses>0){
                                layer.rect(-47+15*this.subWeaponA.uses/(this.subWeaponAData.uses*game.ammoMult),-7,30*this.subWeaponA.uses/(this.subWeaponAData.uses*game.ammoMult),4,2)
                            }
                        }else{
                            for(let a=0,la=this.subWeaponA.uses;a<la;a++){
                                layer.fill(0,100,200,this.fade*this.infoAnim.usesA[a])
                                layer.ellipse(-44+a*8,-7,6)
                                layer.fill(0,150,255,this.fade*this.infoAnim.usesA[a])
                                layer.ellipse(-44+a*8,-7,4)
                            }
                        }
                        if((this.subWeaponBData.uses*game.ammoMult)>4){
                            layer.fill(150,this.fade*this.infoAnim.life)
                            layer.rect(32,-7,30,4,2)
                            layer.fill(0,150,255,this.fade*this.infoAnim.life)
                            if(this.subWeaponB.uses>0){
                                layer.rect(17+15*this.subWeaponB.uses/(this.subWeaponBData.uses*game.ammoMult),-7,30*this.subWeaponB.uses/(this.subWeaponBData.uses*game.ammoMult),4,2)
                            }
                        }else{
                            for(let a=0,la=this.subWeaponB.uses;a<la;a++){
                                layer.fill(0,100,200,this.fade*this.infoAnim.usesB[a])
                                layer.ellipse(20+a*8,-7,6)
                                layer.fill(0,150,255,this.fade*this.infoAnim.usesB[a])
                                layer.ellipse(20+a*8,-7,4)
                            }
                        }
                    }
                }
            }else{        
                if(this.weaponType>=0){
                    if(this.weaponData.ammo>4){
                        layer.rect(0,-7,30,4,2)
                        layer.fill(200,this.fade*this.infoAnim.life)
                        layer.rect(-15+15*this.weapon.ammo/this.weaponData.ammo,-7,30*this.weapon.ammo/this.weaponData.ammo,4,2)
                    }else{
                        for(let a=0,la=this.weapon.ammo;a<la;a++){
                            layer.fill(150,this.fade*this.infoAnim.ammo[a])
                            layer.ellipse(-12+a*8,-7,6)
                            layer.fill(200,this.fade*this.infoAnim.ammo[a])
                            layer.ellipse(-12+a*8,-7,4)
                        }
                    }
                }
            }
        }
        if(this.collect.life>=this.life){
            layer.fill(240,0,0,this.fade*this.infoAnim.life)
            layer.rect((max(0,this.collect.life)/this.base.life)*15-15,0,(max(0,this.collect.life)/this.base.life)*30,1+min((max(0,this.collect.life)/this.base.life)*60,3),2)
            layer.fill(min(255,510-max(0,this.life)/this.base.life*510)-max(0,5-max(0,this.life)/this.base.life*30)*25,max(0,this.life)/this.base.life*510,0,this.fade*this.infoAnim.life)
            layer.rect((max(0,this.life)/this.base.life)*15-15,0,(max(0,this.life)/this.base.life)*30,2+min((max(0,this.life)/this.base.life)*60,3),2)
        }else if(this.collect.life<this.life){
            layer.fill(240,0,0,this.fade*this.infoAnim.life)
            layer.rect((max(0,this.life)/this.base.life)*15-15,0,(max(0,this.life)/this.base.life)*30,1+min((max(0,this.life)/this.base.life)*60,3),2)
            layer.fill(min(255,510-max(0,this.collect.life)/this.base.life*510)-max(0,5-max(0,this.collect.life)/this.base.life*30)*25,max(0,this.collect.life)/this.base.life*510,0,this.fade*this.infoAnim.life)
            layer.rect((max(0,this.collect.life)/this.base.life)*15-15,0,(max(0,this.collect.life)/this.base.life)*30,2+min((max(0,this.collect.life)/this.base.life)*60,3),2)
        }
        layer.pop()
    }
    display(layer,offsetX=0,offsetY=0){
        this.calculateParts()
        layer.push()
        layer.translate(this.position.x+this.offset.position.x+offsetX,this.position.y+this.offset.position.y+offsetY)
        if(this.parachute||this.playerData.name=='ParaPistol'||this.playerData.name=='ParaRocketLauncher'||this.playerData.name=='PlayerParaRocketLauncher'||this.playerData.name=='PlayerParaGrenadier'||this.playerData.name=='PlayerStratofortress'||this.playerData.name=='PlayerParachutist'||this.playerData.name=='PlayerDropship'||this.playerData.name=='PlayerApache'){
            layer.noFill()
            layer.stroke(200,this.fade)
            layer.strokeWeight(1)
            layer.line(-25,-90,0,-5)
            layer.line(25,-90,0,-5)
            layer.stroke(160,this.fade)
            layer.strokeWeight(5)
            layer.arc(0,-80,80,20,-165,-15)
        }
        if(this.playerData.name=='MedicShield'||this.playerData.name=='HyperMedicShield'||this.playerData.name=='CritApplyMedicShield'||this.playerData.name=='BigFastRapidMedicShield'||this.playerData.name=='EngineerShield'||this.playerData.name=='BigMedicShield'){
            layer.stroke(255,150,150,this.fade)
            layer.strokeWeight(4)
            if(lsin(this.direction.main)<0){
                layer.line(-80,-70,-80,50)
            }else{
                layer.line(80,-70,80,50)
            }
            layer.noStroke()
            layer.fill(255,150,150,this.fade*0.1)
            if(lsin(this.direction.main)<0){
                layer.triangle(-80,-70,-80,50,0,-10)
            }else{
                layer.triangle(80,-70,80,50,0,-10)
            }
        }
        if(this.playerData.name=='PlayerRearguard'){
            layer.stroke(255,150,150,this.fade)
            layer.strokeWeight(4)
            if(lsin(this.direction.main)<0){
                layer.line(80,-70,80,50)
            }else{
                layer.line(-80,-70,-80,50)
            }
            layer.noStroke()
            layer.fill(255,150,150,this.fade*0.1)
            if(lsin(this.direction.main)<0){
                layer.triangle(80,-70,80,50,0,-10)
            }else{
                layer.triangle(-80,-70,-80,50,0,-10)
            }
        }
        if(this.playerData.name=='PlayerRotary'){
            layer.stroke(255,150,150,this.fade)
            layer.strokeWeight(4)
            layer.line(80,-70,80,50)
            layer.line(-80,-70,-80,50)
            layer.noStroke()
            layer.fill(255,150,150,this.fade*0.1)
            layer.triangle(80,-70,80,50,0,-10)
            layer.triangle(-80,-70,-80,50,0,-10)
        }
        if(this.playerData.name=='PlayerRho'){
            layer.stroke(150,this.fade)
            layer.strokeWeight(2)
            layer.noFill()
            layer.ellipse(0,-10,100)
            layer.noStroke()
            layer.fill(100,this.fade)
            layer.ellipse(50*lsin(this.time),50*lcos(this.time)-10,24)
            layer.ellipse(-50*lsin(this.time),-50*lcos(this.time)-10,24)
            layer.fill(225,this.fade)
            layer.ellipse(50*lcos(this.time),-50*lsin(this.time)-10,12)
            layer.ellipse(-50*lcos(this.time),50*lsin(this.time)-10,12)
            layer.fill(225,25,25,this.fade)
            layer.ellipse(50*lcos(this.time),-50*lsin(this.time)-10,4)
            layer.ellipse(-50*lcos(this.time),50*lsin(this.time)-10,4)
        }
        if(this.playerData.name=='ConstructGuard'){
            layer.stroke(255,150,150,this.fade)
            layer.strokeWeight(4)
            if(lsin(this.direction.main)<0){
                layer.line(-80,-70,-80,50)
            }else{
                layer.line(80,-70,80,50)
            }
            layer.noStroke()
            layer.fill(255,150,150,this.fade*0.1)
            if(lsin(this.direction.main)<0){
                layer.triangle(-80,-70,-80,50,0,-10)
            }else{
                layer.triangle(80,-70,80,50,0,-10)
            }
        }
        if(this.firearc[1]>0){
            layer.stroke(255,50,50,this.fade*this.firearc[1]/15)
            layer.strokeWeight(2)
            layer.line(0,-10,lsin(this.firearc[0])*50,-lcos(this.firearc[0])*50-10)
        }
        layer.scale(this.size)
        layer.noStroke()
        if(this.playerData.crit==1||this.critBuff>0){
            layer.fill(150,255,255,this.fade)
            regStar(layer,0,this.skin.body.level,12,45,45,9,9,0)
        }
        if(this.defendBuff>0){
            layer.fill(255,255,150,this.fade)
            regStar(layer,0,this.skin.body.level,12,45,45,9,9,15)
        }
        if(this.stunTime>0){
            layer.fill(255,255,150,this.fade)
            regStar(layer,0,this.skin.body.level,9,45,45,9,9,0)
        }
        if(this.vulnerableTime>0){
            layer.fill(255,150,150,this.fade)
            regStar(layer,0,this.skin.body.level,9,45,45,9,9,40/3)
        }
        if(this.confuseTime>0){
            layer.fill(255,100,255,this.fade)
            regStar(layer,0,this.skin.body.level,9,45,45,9,9,80/3)
        }
        if(this.dizzyTime>0){
            layer.fill(255,this.fade)
            for(let a=0,la=3;a<la;a++){
                layer.ellipse(18*lsin(this.time*3+a*120),this.skin.head.level-18+4.5*lcos(this.time*3+a*120),3)
            }
        }
        switch(this.weaponType){
            case 6: case 17: case 45: case 75: case 92: case 93: case 132: case 145: case 181: case 237:
            case 249: case 288: case 293: case 299:
                layer.stroke(255,0,0,this.infoAnim.bar[0]*0.5*this.fade)
                layer.strokeWeight(3)
                layer.line(
                    this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.x+constrain(lsin(this.direction.main)*3,-1,1)*10,this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.y,
                    -6000+this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.x+constrain(lsin(this.direction.main)*3,-1,1)*10,this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.y
                )
                layer.stroke(255,0,0,this.infoAnim.bar[1]*0.5*this.fade)
                layer.strokeWeight(3)
                layer.line(
                    this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.x+constrain(lsin(this.direction.main)*3,-1,1)*10,this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.y,
                    6000+this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.x+constrain(lsin(this.direction.main)*3,-1,1)*10,this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.y
                )
            break
            case 191: case 202: case 203: case 204: case 205: case 206: case 209: case 211: case 219: case 220:
            case 226: case 228: case 230: case 247: case 263: case 265: case 266: case 267: case 284: case 285:
            case 302: case 303: case 304: case 305: case 320: case 322: case 323: case 324:
                layer.stroke(0,255,0,this.infoAnim.bar[0]*0.5*this.fade)
                layer.strokeWeight(3)
                layer.line(
                    this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.x+constrain(lsin(this.direction.main)*3,-1,1)*10,this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.y,
                    -900+this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.x+constrain(lsin(this.direction.main)*3,-1,1)*10,this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.y
                )
                layer.stroke(0,255,0,this.infoAnim.bar[1]*0.5*this.fade)
                layer.strokeWeight(3)
                layer.line(
                    this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.x+constrain(lsin(this.direction.main)*3,-1,1)*10,this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.y,
                    900+this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.x+constrain(lsin(this.direction.main)*3,-1,1)*10,this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.y
                )
            break
            case 12: case 69: case 79:
                layer.stroke(255,0,0,this.infoAnim.bar[0]*0.5*this.fade)
                layer.strokeWeight(3)
                layer.line(
                    this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.x+constrain(lsin(this.direction.main)*3,-1,1)*10,this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.y-4,
                    -6000+this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.x+constrain(lsin(this.direction.main)*3,-1,1)*10,this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.y-4
                )
                layer.line(
                    this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.x+constrain(lsin(this.direction.main)*3,-1,1)*10,this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.y+4,
                    -6000+this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.x+constrain(lsin(this.direction.main)*3,-1,1)*10,this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.y+4
                )
                layer.stroke(255,0,0,this.infoAnim.bar[1]*0.5*this.fade)
                layer.strokeWeight(3)
                layer.line(
                    this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.x+constrain(lsin(this.direction.main)*3,-1,1)*10,this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.y-4,
                    6000+this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.x+constrain(lsin(this.direction.main)*3,-1,1)*10,this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.y-4
                )
                layer.line(
                    this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.x+constrain(lsin(this.direction.main)*3,-1,1)*10,this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.y+4,
                    6000+this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.x+constrain(lsin(this.direction.main)*3,-1,1)*10,this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.y+4
                )
            break
            case 54:
                layer.stroke(255,0,0,this.infoAnim.bar[0]*0.5*this.fade)
                layer.strokeWeight(3)
                layer.line(
                    this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.x+constrain(lsin(this.direction.main)*3,-1,1)*10,this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.y,
                    -600+this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.x+constrain(lsin(this.direction.main)*3,-1,1)*10,this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.y
                )
                layer.stroke(255,0,0,this.infoAnim.bar[1]*0.5*this.fade)
                layer.strokeWeight(3)
                layer.line(
                    this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.x+constrain(lsin(this.direction.main)*3,-1,1)*10,this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.y,
                    600+this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.x+constrain(lsin(this.direction.main)*3,-1,1)*10,this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.y
                )
            break
        }
        /*for(let a=0,la=2;a<la;a++){
            if(this.skin.arms[a].display&&a==lsin(this.direction.main)<0?1:0){
                layer.noStroke()
                layer.fill(120,this.fade*this.skin.arms[a].fade)
                layer.rect(this.skin.arms[a].points.final.end.x+constrain(lsin(this.direction.main)*3,-1,1)*10,this.skin.arms[a].points.final.end.y-1,16,3)
                layer.fill(80,this.fade*this.skin.arms[a].fade)
                layer.rect(this.skin.arms[a].points.final.end.x+constrain(lsin(this.direction.main)*3,-1,1)*4,this.skin.arms[a].points.final.end.y+1,8,1)
            }
        }*/
        for(let a=0,la=2;a<la;a++){
            if(this.skin.arms[a].display&&lcos(this.direction.main+this.skin.arms[a].anim.phi)<=0){
                layer.fill(this.color.skin.arms[0]+lcos(this.skin.arms[a].anim.phi+this.direction.main)*20,this.color.skin.arms[1]+lcos(this.skin.arms[a].anim.phi+this.direction.main)*20,this.color.skin.arms[2]+lcos(this.skin.arms[a].anim.phi+this.direction.main)*20,this.fade*this.skin.arms[a].fade)
                layer.noStroke()
                layer.ellipse(this.skin.arms[a].points.final.end.x,this.skin.arms[a].points.final.end.y,12,12)
            }
        }
        for(let a=0,la=2;a<la;a++){
            if(this.skin.legs[a].display&&lcos(this.direction.main+this.skin.legs[a].anim.theta)<=0){
                layer.fill(this.color.skin.legs[0]+lcos(this.skin.legs[a].anim.theta+this.direction.main)*20,this.color.skin.legs[1]+lcos(this.skin.legs[a].anim.theta+this.direction.main)*20,this.color.skin.legs[2]+lcos(this.skin.legs[a].anim.theta+this.direction.main)*20,this.fade*this.skin.legs[a].fade)
                layer.noStroke()
                layer.ellipse(this.skin.legs[a].points.final.end.x,this.skin.legs[a].points.final.end.y,12,12)
            }
        }
        if(this.skin.body.display){
            layer.fill(this.color.skin.body[0],this.color.skin.body[1],this.color.skin.body[2],this.fade*this.skin.body.fade)
            layer.noStroke()
            layer.ellipse(0,this.skin.body.level,14,24)
        }
        for(let a=0,la=2;a<la;a++){
            if(this.skin.legs[a].display&&lcos(this.direction.main+this.skin.legs[a].anim.theta)>0){
                layer.fill(this.color.skin.legs[0]+lcos(this.skin.legs[a].anim.theta+this.direction.main)*20,this.color.skin.legs[1]+lcos(this.skin.legs[a].anim.theta+this.direction.main)*20,this.color.skin.legs[2]+lcos(this.skin.legs[a].anim.theta+this.direction.main)*20,this.fade*this.skin.legs[a].fade)
                layer.noStroke()
                layer.ellipse(this.skin.legs[a].points.final.end.x,this.skin.legs[a].points.final.end.y,12,12)
            }
        }
        if(this.face.beak.main.display){
            layer.fill(this.color.beak.main[0],this.color.beak.main[1],this.color.beak.main[2],this.fade*this.face.beak.main.fade)
            layer.noStroke()
            layer.ellipse(lsin(this.direction.main)*13,this.face.beak.main.level,12+2*lcos(this.direction.main),8)
        }
        if(this.face.beak.mouth.display){
            layer.noFill()
            layer.stroke(this.color.beak.mouth[0],this.color.beak.mouth[1],this.color.beak.mouth[2],this.fade*this.face.beak.mouth.fade)
            layer.strokeWeight(0.5)
            layer.arc(lsin(this.direction.main)*13,this.face.beak.mouth.level,12+2*lcos(this.direction.main),1,0,180)
        }
        if(this.face.beak.nostril.display){
            layer.noFill()
            layer.stroke(this.color.beak.nostril[0],this.color.beak.nostril[1],this.color.beak.nostril[2],this.fade*this.face.beak.nostril.fade)
            layer.strokeWeight(0.5)
            for(let a=0,la=2;a<la;a++){
                layer.line(lsin(this.direction.main-6+a*12)*16,this.face.beak.nostril.level,lsin(this.direction.main-6+a*12)*16,this.face.beak.nostril.level+0.5)
            }
        }
        if(this.skin.head.display){
            layer.fill(this.color.skin.head[0],this.color.skin.head[1],this.color.skin.head[2],this.fade*this.skin.head.fade)
            layer.noStroke()
            layer.ellipse(0,this.skin.head.level,27,27)
        }
        for(let a=0,la=2;a<la;a++){
            if(this.skin.arms[a].display&&lcos(this.direction.main+this.skin.arms[a].anim.phi)>0){
                layer.fill(this.color.skin.arms[0]+lcos(this.skin.arms[a].anim.phi+this.direction.main)*20,this.color.skin.arms[1]+lcos(this.skin.arms[a].anim.phi+this.direction.main)*20,this.color.skin.arms[2]+lcos(this.skin.arms[a].anim.phi+this.direction.main)*20,this.fade*this.skin.arms[a].fade)
                layer.noStroke()
                layer.ellipse(this.skin.arms[a].points.final.end.x,this.skin.arms[a].points.final.end.y,12,12)
            }
            if(this.face.eye[a].display){
                if(this.control==0){
                    layer.stroke(this.color.eye.back[0],this.color.eye.back[1],this.color.eye.back[2],this.fade*this.face.eye[a].fade)
                }else{
                    layer.stroke(255,0,0,this.fade*this.face.eye[a].fade)
                }
                layer.strokeWeight((2.5-this.face.eye[a].anim*1.5)*constrain(lcos(this.face.eye[a].spin+this.direction.main)*5,0,1))
                if(this.face.eye[a].anim==0){
                    layer.point(lsin(this.face.eye[a].spin+this.direction.main)*13-(a*2-1)*lcos(this.face.eye[a].spin+this.direction.main)*this.face.eye[a].anim*2,this.face.eye[a].level)
                    layer.point(lsin(this.face.eye[a].spin+this.direction.main)*13-(a*2-1)*lcos(this.face.eye[a].spin+this.direction.main)*this.face.eye[a].anim*2,this.face.eye[a].level)
                }else{
                    layer.line(lsin(this.face.eye[a].spin+this.direction.main)*13-(a*2-1)*lcos(this.face.eye[a].spin+this.direction.main)*this.face.eye[a].anim*2,this.face.eye[a].level,lsin(this.face.eye[a].spin+this.direction.main)*13+(a*2-1)*lcos(this.face.eye[a].spin+this.direction.main)*this.face.eye[a].anim*2,this.parts.eyeLevel-this.face.eye[a].anim*2)
                    layer.line(lsin(this.face.eye[a].spin+this.direction.main)*13-(a*2-1)*lcos(this.face.eye[a].spin+this.direction.main)*this.face.eye[a].anim*2,this.face.eye[a].level,lsin(this.face.eye[a].spin+this.direction.main)*13+(a*2-1)*lcos(this.face.eye[a].spin+this.direction.main)*this.face.eye[a].anim*2,this.parts.eyeLevel+this.face.eye[a].anim*2)
                }
            }
        }
        if(this.face.beak.main.display&&lcos(this.direction.main)>0){
            layer.fill(this.color.beak.main[0],this.color.beak.main[1],this.color.beak.main[2],this.fade*this.face.beak.main.fade)
            layer.noStroke()
            layer.ellipse(lsin(this.direction.main)*13,this.face.beak.main.level,12+2*lcos(this.direction.main),8)
        }
        if(this.face.beak.mouth.display&&lcos(this.direction.main)>0){
            layer.noFill()
            layer.stroke(this.color.beak.mouth[0],this.color.beak.mouth[1],this.color.beak.mouth[2],this.fade*this.face.beak.mouth.fade)
            layer.strokeWeight(0.5)
            layer.arc(lsin(this.direction.main)*13,this.face.beak.mouth.level,12+2*lcos(this.direction.main),1,0,180)
        }
        if(this.face.beak.nostril.display&&lcos(this.direction.main)>0){
            layer.noFill()
            layer.stroke(this.color.beak.nostril[0],this.color.beak.nostril[1],this.color.beak.nostril[2],this.fade*this.face.beak.nostril.fade)
            layer.strokeWeight(0.5)
            for(let a=0,la=2;a<la;a++){
                layer.line(lsin(this.direction.main-6+a*12)*16,this.face.beak.nostril.level,lsin(this.direction.main-6+a*12)*16,this.face.beak.nostril.level+0.5)
            }
        }
        layer.pop()
    }
    displayOver(layer){
        layer.push()
        layer.translate(this.position.x,this.position.y)
        if(this.inspect.length>0){
            layer.noStroke()
            for(let a=0,la=entities.players.length;a<la;a++){
                if(this.inspect.includes(entities.players[a].index)){
                    let dir=atan2(entities.players[a].position.x-this.position.x,entities.players[a].position.y-this.position.y)
                    let extent=dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)/10+100
                    layer.fill(...entities.players[a].color.skin.body)
                    regTriangle(layer,sin(dir)*extent,cos(dir)*extent,6,6,dir)
                    layer.fill(255)
                    layer.textSize(10)
                    layer.text(entities.players[a].id>0?entities.players[a].weaponData.name:entities.players[a].playerData.name,sin(dir)*extent,cos(dir)*extent+16)
                    layer.fill(150)
                    layer.rect(sin(dir)*extent,cos(dir)*extent+30,30,4,2)
                    layer.fill(240,0,0)
                    layer.rect((max(0,entities.players[a].collect.life)/entities.players[a].base.life)*15-15+sin(dir)*extent,cos(dir)*extent+30,(max(0,entities.players[a].collect.life)/entities.players[a].base.life)*30,1+min((max(0,entities.players[a].collect.life)/entities.players[a].base.life)*60,3),2)
                    layer.fill(min(255,510-max(0,entities.players[a].life)/entities.players[a].base.life*510)-max(0,5-max(0,entities.players[a].life)/entities.players[a].base.life*30)*25,max(0,entities.players[a].life)/entities.players[a].base.life*510,0)
                    layer.rect((max(0,entities.players[a].life)/entities.players[a].base.life)*15-15+sin(dir)*extent,cos(dir)*extent+30,(max(0,entities.players[a].life)/entities.players[a].base.life)*30,2+min((max(0,entities.players[a].life)/entities.players[a].base.life)*60,3),2)
                }
            }
        }
        if(this.playerData.name=='PlayerMinesweeper'||this.playerData.name=='PlayerDegausser'){
            layer.strokeWeight(8*this.size)
            layer.noFill()
            for(let a=0,la=this.scan.length;a<la;a++){
                if(this.scan[a]>0){
                    layer.stroke(40,240,40,this.fade*this.scan[a]/30)
                    layer.arc(0,0,100*this.size,100*this.size,(a-0.5)/la*360+10-90,(a+0.5)/la*360-10-90)
                }
            }
        }
        layer.pop()
    }
    setColor(){
        if(this.playerData.name=='BigMachineGunDamaged'||this.playerData.name=='BigCritRocketLauncherDamaged'){
            this.takeDamage(150)
        }
        if(this.playerData.name=='MachineGunDamaged'||this.playerData.name=='SniperDamaged'||this.playerData.name=='PistolJumpDamaged'){
            this.takeDamage(50)
        }
        if(this.playerData.name=='HeavyShotgunDamaged'){
            this.takeDamage(100)
        }
        if(this.playerData.name=='TankDamaged'){
            this.takeDamage(450)
        }
        switch(this.id){
            case 0:
                if(this.playerData.name=='Buster'){
                    this.color={eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[80,160,200],body:[70,150,190],legs:[60,140,180],arms:[65,145,185]}}
                }else if(this.playerData.name=='Tank'||this.playerData.name=='BallingTank'||this.playerData.name=='PistolingTank'||this.playerData.name=='EngineeringTank'||this.playerData.name=='TankSpawner'||this.playerData.name=='FlamethrowingTank'||this.playerData.name=='HyperTank'||this.playerData.name=='RocketLaunchingTank'||this.playerData.name=='AutoTank'){
                    this.color={eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[160,165,170],body:[150,155,160],legs:[140,145,150],arms:[145,150,155]}}
                }else if(this.playerData.name=='MegaTank'){
                    this.color={eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[220,225,230],body:[210,215,220],legs:[200,205,210],arms:[185,190,195]}}
                }else if(this.playerData.name=='HeavyTank'){
                    this.color={eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[200,205,210],body:[190,195,200],legs:[180,185,190],arms:[185,190,195]}}
                }else if(this.playerData.name=='LightTank'){
                    this.color={eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[130,135,140],body:[120,125,130],legs:[110,115,120],arms:[115,120,125]}}
                }else if(this.playerData.name=='PaperTank'){
                    this.color={eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[255,255,230],body:[255,255,210],legs:[255,255,190],arms:[255,255,200]}}
                }else if(this.playerData.name=='Spy'||this.playerData.name=='SpyHealSelf'||this.playerData.name=='RapidSpy'||this.playerData.name=='SpyTank'||this.playerData.name=='CritSpy'||this.playerData.name=='RevolverSpy'){
                    this.color=[
                        {eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[25,85,255],body:[15,75,255],legs:[0,60,255],arms:[5,65,255]}},
                        {eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[235,25,255],body:[225,15,255],legs:[210,0,255],arms:[215,5,255]}},
                        {eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[55,235,25],body:[55,225,15],legs:[55,210,0],arms:[55,215,5]}},
                        {eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[235,105,25],body:[225,105,15],legs:[210,105,0],arms:[215,105,5]}},
                        {eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[25,245,255],body:[15,235,255],legs:[0,220,255],arms:[5,225,255]}},
                        {eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[135,25,255],body:[125,15,255],legs:[110,0,255],arms:[215,5,255]}}
                    ][this.copy]
                }else if(game.level==6&&this.playerData.sizeBuff>1.25){
                    this.color={eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[255,35,25],body:[255,25,15],legs:[255,10,0],arms:[255,15,5]}}
                }else{
                    this.color={eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[255,235,25],body:[255,225,15],legs:[255,210,0],arms:[255,215,5]}}
                }
            break
            case 1:
                this.color={eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[25,85,255],body:[15,75,255],legs:[0,60,255],arms:[5,65,255]}}
            break
            case 2:
                this.color={eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[235,25,255],body:[225,15,255],legs:[210,0,255],arms:[215,5,255]}}
            break
            case 3:
                this.color={eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[55,235,25],body:[55,225,15],legs:[55,210,0],arms:[55,215,5]}}
            break
            case 4:
                this.color={eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[235,105,25],body:[225,105,15],legs:[210,105,0],arms:[215,105,5]}}
            break
            case 5:
                this.color={eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[25,245,255],body:[15,235,255],legs:[0,220,255],arms:[5,225,255]}}
            break
            case 6:
                this.color={eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[135,25,255],body:[125,15,255],legs:[110,0,255],arms:[215,5,255]}}
            break
            default:
                let a=[floor(random(50,255)),floor(random(50,255)),floor(random(50,255))]
                this.color={eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[a[0],a[1],a[2]],body:[a[0]-10,a[1]-10,a[2]-10],legs:[a[0]-25,a[1]-25,a[2]-25],arms:[a[0]-20,a[1]-20,a[2]-20]}}
            break
        }
        this.base.color={eye:{back:this.color.eye.back},beak:{main:this.color.beak.main,mouth:this.color.beak.mouth,nostril:this.color.beak.nostril},skin:{head:this.color.skin.head,body:this.color.skin.body,legs:this.color.skin.legs,arms:this.color.skin.arms}}
    }
    newWeapon(){
        if(game.randomizer){
            this.type=floor(random(listing[1][listing[1].length-1]+1,types.player.length))
        }else if(game.classicWeapon||this.id>game.gaming){
            let clump=listing[game.peakWeapon?1:floor(random(1.5))]
            this.type=clump[floor(random(0,clump.length))]
        }else if(this.id<=game.weapon.length){
            game.weaponTick[this.id-1]++
            this.type=game.weapon[this.id-1][game.weaponTick[this.id-1]%game.weapon[this.id-1].length]
        }
        this.playerData=types.player[this.type]
        this.weaponType=this.playerData.weapon
        this.weaponData=types.weapon[this.weaponType]
        this.weapon={ammo:this.weaponData.ammo,cooldown:0,reload:0,uses:(this.weaponData.uses==1?this.weaponData.uses:this.weaponData.uses*game.ammoMult)}
        if(game.level==16){
            this.weapon.uses=floor(random(ceil(this.weaponData.uses*game.ammoMult/2),this.weaponData.uses*game.ammoMult))
            this.weapon.ammo=min(this.weapon.ammo,this.weapon.uses)
        }
        this.weapon.cooldown=30
        if(game.randomizer){
            this.width=8*this.playerData.sizeBuff
            this.height=24*this.playerData.sizeBuff
            this.fade=0
            this.size=0.5*this.playerData.sizeBuff
            this.base.life=100*this.playerData.lifeBuff
            this.life=this.base.life
            this.collect.life=this.life
            this.record.life=this.base.life
            this.offset={position:{x:0,y:12*this.playerData.sizeBuff}}
            if(this.id>0){
                this.multLife(2)
            }
            this.setColor()
        }
        this.initialWeapon()
    }
    initialWeapon(){
        switch(this.playerData.name){
            case 'PlayerConglomeration':
                this.newSubWeaponA()
                this.newSubWeaponB()
            break
            case 'PlayerSpy':
                this.color={eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[255,235,25],body:[255,225,15],legs:[255,210,0],arms:[255,215,5]}}
            break
        }
        if(this.playerData.name!='PlayerSpy'){
            this.setColor()
        }
        let crit=constrain(this.playerData.crit+(this.critBuff>0?1:0)+(this.id>0&&floor(random(0,100))==0?1:0),0,1)
        let spawn=[this.position.x+this.offset.position.x+this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.x*this.size+constrain(lsin(this.direction.main)*3,-1,1)*10*this.size,this.position.y+this.offset.position.y+this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.y*this.size]
		switch(this.weaponType){
            case 222:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],134,(lsin(this.direction.main)<0?-90:90)+180,this.id,this.weaponData.damage*this.playerData.damageBuff*10,3600,crit,this.index))
            break
            case 225:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],138,(lsin(this.direction.main)<0?-90:90)+180,this.id,this.weaponData.damage*this.playerData.damageBuff*2,3600,crit,this.index))
            break
            case 227:
                for(let a=0,la=2;a<la;a++){
                    entities.players.push(new player(this.layer,this.position.x,this.position.y,this.id,0,[],false,findName('SidekickGun',types.player),this.index))
                    entities.players[entities.players.length-1].sidekick=true
                    entities.players[entities.players.length-1].direction.goal=this.direction.goal
                    entities.players[entities.players.length-1].lastingForce[0]+=[0.4,-0.4][a]
                }
            break
            case 254:
                for(let a=0,la=2;a<la;a++){
                    entities.players.push(new player(this.layer,this.position.x,this.position.y,this.id,0,[],false,findName('SidekickDoubleAuto',types.player),this.index))
                    entities.players[entities.players.length-1].sidekick=true
                    entities.players[entities.players.length-1].direction.goal=this.direction.goal
                    entities.players[entities.players.length-1].lastingForce[0]+=[0.4,-0.4][a]
                }
            break
            case 256:
                for(let a=0,la=2;a<la;a++){
                    entities.players.push(new player(this.layer,this.position.x,this.position.y,this.id,0,[],false,findName('SidekickTrapper',types.player),this.index))
                    entities.players[entities.players.length-1].sidekick=true
                    entities.players[entities.players.length-1].direction.goal=this.direction.goal
                    entities.players[entities.players.length-1].lastingForce[0]+=[0.4,-0.4][a]
                }
            break
            case 257:
                for(let a=0,la=2;a<la;a++){
                    entities.players.push(new player(this.layer,this.position.x,this.position.y,this.id,0,[],false,findName('SidekickShotgun',types.player),this.index))
                    entities.players[entities.players.length-1].sidekick=true
                    entities.players[entities.players.length-1].direction.goal=this.direction.goal
                    entities.players[entities.players.length-1].lastingForce[0]+=[0.4,-0.4][a]
                }
            break
            case 259:
                for(let a=0,la=2;a<la;a++){
                    entities.players.push(new player(this.layer,this.position.x,this.position.y,this.id,0,[],false,findName('SidekickHelix',types.player),this.index))
                    entities.players[entities.players.length-1].sidekick=true
                    entities.players[entities.players.length-1].direction.goal=this.direction.goal
                    entities.players[entities.players.length-1].lastingForce[0]+=[0.4,-0.4][a]
                }
            break
            case 260:
                for(let a=0,la=10;a<la;a++){
                    entities.players.push(new player(this.layer,this.position.x,this.position.y,this.id,0,[],false,findName('SidekickLight',types.player),this.index))
                    entities.players[entities.players.length-1].sidekick=true
                    entities.players[entities.players.length-1].direction.goal=this.direction.goal
                    entities.players[entities.players.length-1].lastingForce[0]+=0.9-a*0.2
                }
            break
            case 274:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],162,(lsin(this.direction.main)<0?-90:90)+180,this.id,this.weaponData.damage*this.playerData.damageBuff*10,3600,crit,this.index))
            break
            case 275:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],163,(lsin(this.direction.main)<0?-90:90)+180,this.id,this.weaponData.damage*this.playerData.damageBuff*10,3600,crit,this.index))
                if(this.id<=game.gaming){
                    this.disable=true
                }
            break
            case 276:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],164,(lsin(this.direction.main)<0?-90:90)+180,this.id,this.weaponData.damage*this.playerData.damageBuff*10,3600,crit,this.index))
            break
            case 277:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],165,(lsin(this.direction.main)<0?-90:90)+180,this.id,this.weaponData.damage*this.playerData.damageBuff*10,3600,crit,this.index))
            break
            case 288:
                for(let a=0,la=2;a<la;a++){
                    entities.players.push(new player(this.layer,this.position.x,this.position.y,this.id,0,[],false,findName('SidekickSniper',types.player),this.index))
                    entities.players[entities.players.length-1].sidekick=true
                    entities.players[entities.players.length-1].direction.goal=this.direction.goal
                    entities.players[entities.players.length-1].lastingForce[0]+=[0.4,-0.4][a]
                }
            break
            case 298:
                for(let a=0,la=4;a<la;a++){
                    entities.players.push(new player(this.layer,this.position.x,this.position.y,this.id,0,[],false,findName(['SidekickShootist','SidekickMachineSniper','SidekickSharpSniper','SidekickFreezeSniper'][a],types.player),this.index))
                    entities.players[entities.players.length-1].sidekick=true
                    entities.players[entities.players.length-1].direction.goal=this.direction.goal
                    entities.players[entities.players.length-1].lastingForce[0]+=[0.5,0.25,-0.25,-0.5][a]
                }
            break
            case 300:
                for(let a=0,la=2;a<la;a++){
                    entities.players.push(new player(this.layer,this.position.x,this.position.y,this.id,0,[],false,findName('SidekickMachineGun',types.player),this.index))
                    entities.players[entities.players.length-1].sidekick=true
                    entities.players[entities.players.length-1].direction.goal=this.direction.goal
                    entities.players[entities.players.length-1].lastingForce[0]+=[0.4,-0.4][a]
                }
            break
        }
    }
    newSubWeaponA(){
        let clump=listing[2]
        this.subPlayerAType=clump[floor(random(0,clump.length))]
        this.subPlayerAData=types.player[this.subPlayerAType]
        this.subWeaponAType=this.subPlayerAData.weapon
        this.subWeaponAData=types.weapon[this.subWeaponAType]
        this.subWeaponA={ammo:this.subWeaponAData.ammo,cooldown:0,reload:0,uses:(this.subWeaponAData.uses==1?this.subWeaponAData.uses:this.subWeaponAData.uses*game.ammoMult),reloading:false}
        this.subWeaponA.cooldown=0
    }
    newSubWeaponB(){
        let clump=listing[2]
        this.subPlayerBType=clump[floor(random(0,clump.length))]
        this.subPlayerBData=types.player[this.subPlayerBType]
        this.subWeaponBType=this.subPlayerBData.weapon
        this.subWeaponBData=types.weapon[this.subWeaponBType]
        this.subWeaponB={ammo:this.subWeaponBData.ammo,cooldown:0,reload:0,uses:(this.subWeaponBData.uses==1?this.subWeaponBData.uses:this.subWeaponBData.uses*game.ammoMult),reloading:false}
        this.subWeaponB.cooldown=0
    }
    newWeaponSet(type){
        this.type=type
        this.playerData=types.player[this.type]
        this.weaponType=this.playerData.weapon
        this.weaponData=types.weapon[this.weaponType]
        this.weapon={ammo:this.weaponData.ammo,cooldown:0,reload:0,uses:(this.weaponData.uses==1?this.weaponData.uses:this.weaponData.uses*game.ammoMult)}
        this.weapon.cooldown=60
        if(game.randomizer){
            this.width=8*this.playerData.sizeBuff
            this.height=24*this.playerData.sizeBuff
            this.fade=0
            this.size=0.5*this.playerData.sizeBuff
            this.base.life=100*this.playerData.lifeBuff
            this.life=this.base.life
            this.collect.life=this.life
            this.record.life=this.base.life
            this.offset={position:{x:0,y:12*this.playerData.sizeBuff}}
            if(this.id>0){
                this.multLife(2)
            }
            this.setColor()
        }
        this.initialWeapon()
    }
    newWeaponSelect(type){
        for(let a=0,la=types.player.length;a<la;a++){
            if(types.player[a].weapon==type){
                this.newWeaponSet(a)
                break
            }
        }
    }
    respawn(){
        this.stats.bust*=0.25
        this.jump={time:0,double:0,triple:0,quadruple:0,active:0}
        this.manage[1]=0
        this.life=this.base.life
        this.collect.life=this.life
        this.record.life=this.base.life
        this.dead=false
        this.die.timer=0
        if(game.randomSpawn){
            this.position.x=random(0,game.edge[0])
            this.position.y=random(0,game.edge[1]/2)
        }else{
            this.position.x=this.base.position.x
            this.position.y=this.base.position.y
        }
        this.previous.position.x=this.position.x
        this.previous.position.y=this.position.y
        this.newWeapon()
        this.velocity.x=0
        this.velocity.y=0
        this.weapon.ammo=this.weaponData.ammo
        this.weapon.cooldown=0
        this.invincible=60
        this.base.control=0
        this.critBuff=0
        this.defendBuff=0
        this.stunTime=0
        this.stuckTime=0
        this.vulnerableTime=0
        this.confuseTime=0
        this.dizzyTime=0
        this.chillTime=0
        if((game.level==8||game.level==17)&&this.base.position.y<game.tileset[1]*5){
            this.position.x=game.edge[0]/2
            this.position.y=1000
            this.parachute=true
        }
    }
    takeDamage(damage){
        if(!(
            (this.weaponType==14||this.weaponType==66||this.playerData.name=='BigHyperPistol'||this.playerData.name=='HyperTank'||this.playerData.name=='HyperShotgun')&&this.active>0&&!(this.playerData.name=='BigMultiHyperMedic'&&this.active<660)||
            (this.playerData.name=='HyperPistol'||this.playerData.name=='CritHyperPistol'||this.playerData.name=='HyperCaffeinePistol'||this.playerData.name=='HyperShotgun')&&this.active>0
        )){
            let preLife=this.life
            this.life-=damage*(this.vulnerableTime>0?3:1)*(this.defendBuff>0?0.5:1)*(this.playerData.name=='PlayerDisappointment'?0.25:this.playerData.name=='PlayerMedicArmored'||this.playerData.name=='PlayerDoublePushPunchArmored'||this.playerData.name=='PlayerRecoiler'||this.playerData.name=='PlayerBonker'||this.playerData.name=='PlayerIceberg'||this.playerData.name=='PlayerSurprise'||this.playerData.name=='PlayerBorder'||this.playerData.name=='PlayerThrasher'?0.5:1)
            if(this.playerData.name=='PlayerGlassCannon'&&this.weapon.cooldown<this.weaponData.cooldown){
                this.weapon.cooldown=300
                let crit=constrain(this.playerData.crit+(this.critBuff>0?1:0),0,1)
                let spawn=[this.position.x+this.offset.position.x+this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.x*this.size+constrain(lsin(this.direction.main)*3,-1,1)*10*this.size,this.position.y+this.offset.position.y+this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.y*this.size]
                for(let a=0,la=20;a<la;a++){
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],2,a*18,this.id,this.weaponData.damage*this.playerData.damageBuff*2,300,crit,this.index))
                }
            }else if(this.playerData.name=='PlayerPrism'&&this.weapon.cooldown<this.weaponData.cooldown){
                this.weapon.cooldown=300
                let crit=constrain(this.playerData.crit+(this.critBuff>0?1:0),0,1)
                let spawn=[this.position.x+this.offset.position.x+this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.x*this.size+constrain(lsin(this.direction.main)*3,-1,1)*10*this.size,this.position.y+this.offset.position.y+this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.y*this.size]
                for(let a=0,la=12;a<la;a++){
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],119,360*a/la,this.id,this.weaponData.damage*this.playerData.damageBuff*1.5,300,crit,this.index))
                }
            }
            if(preLife>=this.base.life&&this.life<=0&&this.id>0){
                this.life=1
            }
        }
    }
	attack(variant){
        let weapon=[this.weapon,this.subWeaponA,this.subWeaponB][variant]
        let weaponType=[this.weaponType,this.subWeaponAType,this.subWeaponBType][variant]
        let weaponData=[this.weaponData,this.subWeaponAData,this.subWeaponBData][variant]
        let damageBuff=[this.playerData.damageBuff,this.subPlayerAData.damageBuff,this.subPlayerBData.damageBuff][variant]
        this.visible=15
		weapon.cooldown=weaponData.cooldown
        weapon.reload=weaponData.stop
        weapon.ammo--
        weapon.uses--
		if((weaponType==4||weaponType==149||weaponType==156||weaponType==157||weaponType==168||weaponType==297)&&weapon.ammo%3!=0){
			weapon.cooldown*=(weaponType==297?0.2:0.1)
		}
        if(weaponType==161){
            weapon.cooldown*=(0.2+0.8*this.weapon.ammo/this.weaponData.ammo)
        }
        let crit=constrain(this.playerData.crit+(this.critBuff>0?1:0)+(this.id>0&&floor(random(0,100))==0?1:0),0,1)
        let spawn=[this.position.x+this.offset.position.x+this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.x*this.size+constrain(lsin(this.direction.main)*3,-1,1)*10*this.size,this.position.y+this.offset.position.y+this.skin.arms[lsin(this.direction.main)<0?1:0].points.final.end.y*this.size]
		switch(weaponType){
			case 0: case 177: case 257:
				for(let a=0,la=10;a<la;a++){
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-20,20),this.id,weaponData.damage*damageBuff,15,crit,this.index))
				}
			break
			case 1: case 2: case 4: case 131: case 142: case 149: case 161: case 176: case 178: case 179:
            case 187: case 189: case 190: case 195: case 211: case 222: case 225: case 227: case 233: case 240:
            case 241: case 272: case 274: case 275: case 276: case 277: case 300: case 315:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
			case 3: case 180:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],2,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
			case 5:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],3,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 6: case 92: case 93: case 181: case 237: case 288:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],4,(lsin(this.direction.main)<0?-90:90)+random(-0.1,0.1),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 7: case 123: case 182:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],5,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,180,crit,this.index))
			break
            case 8: case 183:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],6,(lsin(this.direction.main)<0?-90:90)+random(-15,15),this.id,weaponData.damage*damageBuff,10,crit,this.index))
            break
            case 9:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],7,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,max(0.5,abs(this.velocity.x)),crit,this.index))
            break
            case 10: case 184:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],8,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,360,crit,this.index))
            break
            case 11: case 62: case 127: case 129: case 185:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],9,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
            break
            case 12:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],4,(lsin(this.direction.main)<0?-90:90)+random(-0.1,0.1),this.id,weaponData.damage*damageBuff,300,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],4,(lsin(this.direction.main)<0?-90:90)+random(-0.1,0.1)-5,this.id,weaponData.damage*damageBuff,300,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],4,(lsin(this.direction.main)<0?-90:90)+random(-0.1,0.1)+5,this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 13:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],10,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
            break
            case 14: case 66:
                if(this.active>0&&!(this.active<660&&this.playerData.name=='BigMultiHyperMedic')||this.id>0){
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],11,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
                }else{
                    weapon.ammo++
                }
            break
            case 15: case 163:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],12,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 16:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],13,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 17:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],14,(lsin(this.direction.main)<0?-90:90)+random(-0.1,0.1),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
			case 18:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],2,(lsin(this.direction.main)<0?-90:90)+random(-5,5),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 19:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],15,(lsin(this.direction.main)<0?-90:90)+random(-15,15),this.id,weaponData.damage*damageBuff,15,crit,this.index))
            break
			case 20:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],16,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 21:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],17,(lsin(this.direction.main)<0?-90:90)+random(-30,30),this.id,weaponData.damage*damageBuff,180,crit,this.index))
			break
            case 22:
				for(let a=0,la=15;a<la;a++){
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-15,15),this.id,weaponData.damage*damageBuff,15,crit,this.index))
				}
			break
            case 23:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],18,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 24:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],19,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 25: case 46:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],20,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
			case 26:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],21,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
			case 27:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],22,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 28:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],23,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,max(0.5,abs(this.velocity.x)),crit,this.index))
            break
            case 29: case 48:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],24,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 30:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],25,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,max(0.5,abs(this.velocity.x)),crit,this.index))
            break
			case 31:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],26,(lsin(this.direction.main)<0?-90:90)+random(-7.5,7.5),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
			case 32:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],27,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 33:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],28,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,180,crit,this.index))
			break
            case 34:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-5,5),this.id,weaponData.damage*damageBuff,300,crit,this.index))
            break
            case 35:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],29,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,360,crit,this.index))
            break
            case 36: case 188:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],30,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,180,crit,this.index))
			break
			case 37:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],31,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
			case 38:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],32,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 39:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],33,(lsin(this.direction.main)<0?-90:90)+random(-15,15),this.id,weaponData.damage*damageBuff,10,crit,this.index))
            break
            case 40:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],34,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,180,crit,this.index))
			break
            case 41:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],35,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,180,crit,this.index))
			break
            case 42:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],36,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
            break
            case 43:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],37,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,max(0.5,abs(this.velocity.x)),crit,this.index))
            break
            case 44: case 76:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],38,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
            break
            case 45:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],39,(lsin(this.direction.main)<0?-90:90)+random(-0.1,0.1),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 47:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],40,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,max(0.5,abs(this.velocity.x)),crit,this.index))
            break
			case 49:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],41,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 50:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],5,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,180,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],5,(lsin(this.direction.main)<0?90:-90),this.id,weaponData.damage*damageBuff,180,crit,this.index))
			break
			case 51:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],16,(lsin(this.direction.main)<0?-90:90)+random(-5,5),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 52:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],42,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,360,crit,this.index))
            break
            case 53:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],43,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 54:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],4,(lsin(this.direction.main)<0?-90:90)+random(-0.1,0.1),this.id,weaponData.damage*damageBuff,5,crit,this.index))
			break
            case 55:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],5,(lsin(this.direction.main)<0?-90:90)+random(-15,15),this.id,weaponData.damage*damageBuff,180,crit,this.index))
			break
            case 56:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,10,crit,this.index))
			break
            case 57: case 68:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],44,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
			case 58:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],45,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 59:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],46,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,max(0.5,abs(this.velocity.x)),crit,this.index))
            break
			case 60:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],47,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
			case 61:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],48,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 62:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,10,crit,this.index))
			break
            case 63:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],20,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,10,crit,this.index))
			break
            case 64:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],49,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
			case 65:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],52,(lsin(this.direction.main)<0?-90:90)+random(-7.5,7.5),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
			case 67:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],53,(lsin(this.direction.main)<0?-90:90)+random(-7.5,7.5),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 69:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],50,(lsin(this.direction.main)<0?-90:90)+random(-0.1,0.1),this.id,weaponData.damage*damageBuff,300,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],50,(lsin(this.direction.main)<0?-90:90)+random(-0.1,0.1)-5,this.id,weaponData.damage*damageBuff,300,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],50,(lsin(this.direction.main)<0?-90:90)+random(-0.1,0.1)+5,this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
			case 70:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],54,(lsin(this.direction.main)<0?-90:90)+random(-7.5,7.5),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 71:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],51,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,180,crit,this.index))
			break
			case 72:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],55,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
			case 73:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],55,(lsin(this.direction.main)<0?-90:90)-10,this.id,weaponData.damage*damageBuff,300,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],55,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],55,(lsin(this.direction.main)<0?-90:90)+10,this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
			case 74:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],56,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 75:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],57,(lsin(this.direction.main)<0?-90:90)+random(-0.1,0.1),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
			case 77:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],58,(lsin(this.direction.main)<0?-90:90)+random(-7.5,7.5),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 78:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],59,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 79:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],39,(lsin(this.direction.main)<0?-90:90)+random(-0.1,0.1),this.id,weaponData.damage*damageBuff,300,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],39,(lsin(this.direction.main)<0?-90:90)+random(-0.1,0.1)-5,this.id,weaponData.damage*damageBuff,300,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],39,(lsin(this.direction.main)<0?-90:90)+random(-0.1,0.1)+5,this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 80:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],60,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,180,crit,this.index))
			break
            case 81:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],61,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,180,crit,this.index))
			break
            case 82:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],62,(lsin(this.direction.main)<0?-90:90)+random(-7.5,7.5),this.id,weaponData.damage*damageBuff,180,crit,this.index))
			break
            case 83:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],63,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
            break
            case 84:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
                this.takeDamage(1)
			break
            case 85:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-12.5,12.5),this.id,weaponData.damage*damageBuff,300,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-12.5,12.5),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
			case 86:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],64,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
			case 87:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],26,(lsin(this.direction.main)<0?-90:90)+random(-22.5,22.5),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
			case 88:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],66,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
			case 89:
				for(let a=0,la=10;a<la;a++){
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],4,(lsin(this.direction.main)<0?-90:90)+random(-20,20),this.id,weaponData.damage*damageBuff,15,crit,this.index))
				}
			break
			case 90:
				for(let a=0,la=10;a<la;a++){
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],5,(lsin(this.direction.main)<0?-90:90)+random(-20,20),this.id,weaponData.damage*damageBuff,180,crit,this.index))
                    entities.projectiles[entities.projectiles.length-1].velocity.x*=random(0.75,1.5)
                    entities.projectiles[entities.projectiles.length-1].velocity.y*=random(0.75,1.5)
				}
			break
            case 91:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],67,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
			case 94:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],68,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,720,crit,this.index))
			break
            case 95:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],69,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,360,crit,this.index))
            break
            case 96:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],70,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,360,crit,this.index))
            break
            case 97:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],6,(lsin(this.direction.main)<0?-90:90)+random(-15,15),this.id,weaponData.damage*damageBuff,10,crit,this.index))
                if(weapon.ammo%2==0){
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],71,(lsin(this.direction.main)<0?-90:90)+random(-15,15),this.id,weaponData.damage*damageBuff,15,crit,this.index))
                }
            break
            case 98:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],6,(lsin(this.direction.main)<0?-90:90)+random(-15,15),this.id,weaponData.damage*damageBuff,10,crit,this.index))
                if(weapon.ammo%2==0){
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff*2,300,crit,this.index))
                }
            break
            case 99:
                for(let a=0,la=entities.players.length;a<la;a++){
                    if((entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0)&&entities.players[a].life>0&&dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)<450){
				        entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,atan2(entities.players[a].position.x-spawn[0],spawn[1]-entities.players[a].position.y),this.id,weaponData.damage*damageBuff,300,crit,this.index))
                    }
                }
			break
            case 100:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],72,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
            break
            case 102:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],74,(lsin(this.direction.main)<0?-90:90)+random(-15,15),this.id,weaponData.damage*damageBuff,15,crit,this.index))
            break
            case 103:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-1,1),this.id,weaponData.damage*damageBuff,300,crit,this.index))
            break
            case 104:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],76,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,max(0.5,abs(this.velocity.x)),crit,this.index))
            break
            case 105: case 134:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],77,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,max(0.5,abs(this.velocity.x)),crit,this.index))
            break
            case 106:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,85,this.id,weaponData.damage*damageBuff,300,crit,this.index))
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,95,this.id,weaponData.damage*damageBuff,300,crit,this.index))
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,-85,this.id,weaponData.damage*damageBuff,300,crit,this.index))
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,-95,this.id,weaponData.damage*damageBuff,300,crit,this.index))
            break
			case 107:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],2,(lsin(this.direction.main)<0?-90:90)*random(1.1,1.4),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
			case 108:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],78,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 109:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],75,(lsin(this.direction.main)<0?-90:90)+random(-15,15),this.id,weaponData.damage*damageBuff,15,crit,this.index))
            break
			case 110:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],2,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],2,(lsin(this.direction.main)<0?-90:90)-5,this.id,weaponData.damage*damageBuff,300,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],2,(lsin(this.direction.main)<0?-90:90)+5,this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 111:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],79,(lsin(this.direction.main)<0?-90:90)+random(-15,15),this.id,weaponData.damage*damageBuff,10,crit,this.index))
            break
            case 112:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],8,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,360,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],8,(lsin(this.direction.main)<0?90:-90),this.id,weaponData.damage*damageBuff,360,crit,this.index))
			break
			case 113:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],80,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 114:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],15,random(-30,30)+180,this.id,weaponData.damage*damageBuff,10,crit,this.index))
                this.velocity.y=-1.6
            break
            case 115:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],6,-90+random(-15,15),this.id,weaponData.damage*damageBuff,10,crit,this.index))
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],6,90+random(-15,15),this.id,weaponData.damage*damageBuff,10,crit,this.index))
            break
            case 116:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],81,(lsin(this.direction.main)<0?-90:90)+random(-15,15),this.id,weaponData.damage*damageBuff,10,crit,this.index))
            break
			case 117:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],2,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 118:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],82,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
            break
			case 119:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],2,85,this.id,weaponData.damage*damageBuff,300,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],2,95,this.id,weaponData.damage*damageBuff,300,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],2,-85,this.id,weaponData.damage*damageBuff,300,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],2,-95,this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 120:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],50,(lsin(this.direction.main)<0?-90:90)+random(-0.1,0.1),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 121:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],83,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,180,crit,this.index))
			break
            case 122:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],84,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 124:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
                if(weapon.ammo%6==0){
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],86,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff*4,300,crit,this.index))
                }
			break
			case 125:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],85,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 126:
				for(let a=0,la=10;a<la;a++){
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],12,(lsin(this.direction.main)<0?-90:90)+random(-20,20),this.id,weaponData.damage*damageBuff,15,crit,this.index))
				}
			break
			case 128:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],2,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],86,(lsin(this.direction.main)<0?-90:90)-5,this.id,weaponData.damage*damageBuff/2,300,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],86,(lsin(this.direction.main)<0?-90:90)+5,this.id,weaponData.damage*damageBuff/2,300,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],86,(lsin(this.direction.main)<0?-90:90)-10,this.id,weaponData.damage*damageBuff/2,300,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],86,(lsin(this.direction.main)<0?-90:90)+10,this.id,weaponData.damage*damageBuff/2,300,crit,this.index))
			break
            case 130:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],87,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 132:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],88,(lsin(this.direction.main)<0?-90:90)+random(-0.1,0.1),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 133:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],89,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 135:
                for(let a=0,la=16;a<la;a++){
				    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,a*22.5,this.id,weaponData.damage*damageBuff,300,crit,this.index))
                }
			break
            case 136: case 150:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],90,(lsin(this.direction.main)<0?-90:90)+random(-1,1),this.id,weaponData.damage*damageBuff,10,crit,this.index))
			break
            case 137: case 140: case 186:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],91,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,50,crit,this.index))
			break
            case 138:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],92,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,100,crit,this.index))
			break
            case 139:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],93,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,50,crit,this.index))
			break
			case 141:
				for(let a=0,la=10;a<la;a++){
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],43,(lsin(this.direction.main)<0?-90:90)+random(-20,20),this.id,weaponData.damage*damageBuff,15,crit,this.index))
				}
			break
            case 143:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 144:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],2,(lsin(this.direction.main)<0?-90:90)+random(-10,10),this.id,weaponData.damage*damageBuff,300,crit,this.index))
                for(let a=0,la=3;a<la;a++){
				    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-10,10),this.id,weaponData.damage*damageBuff*0.25,300,crit,this.index))
                }
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],5,(lsin(this.direction.main)<0?-90:90)+random(-10,10),this.id,weaponData.damage*damageBuff*0.5,180,crit,this.index))
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],6,(lsin(this.direction.main)<0?-90:90)+random(-10,10),this.id,weaponData.damage*damageBuff*0.5,10,crit,this.index))
            break
            case 145:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],94,(lsin(this.direction.main)<0?-90:90)+random(-0.1,0.1),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 146:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],95,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,360,crit,this.index))
            break
            case 147:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],96,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,500,crit,this.index))
			break
            case 148:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],97,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,180,crit,this.index))
			break
            case 151:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],98,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,180,crit,this.index))
                entities.projectiles[entities.projectiles.length-1].velocity.x*=1.25
                entities.projectiles[entities.projectiles.length-1].velocity.y*=3
			break
            case 152:
                entities.players.push(new player(this.layer,this.position.x,this.position.y,this.id,0,[],false,findName('ConstructMachineGun',types.player),game.index))
                game.index++
                entities.players[entities.players.length-1].color={eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[160,165,170],body:[150,155,160],legs:[140,145,150],arms:[145,150,155]}}
                entities.players[entities.players.length-1].construct=true
                entities.players[entities.players.length-1].direction.goal=this.direction.goal
            break
            case 153: case 154:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-0.5,0.5),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 156:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1]-3,1,(lsin(this.direction.main)<0?-90:90)+random(-1,1),this.id,weaponData.damage*damageBuff,300,crit,this.index))
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1]+3,1,(lsin(this.direction.main)<0?-90:90)+random(-1,1),this.id,weaponData.damage*damageBuff,300,crit,this.index))
            break
            case 157:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],99,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
            break
            case 159:
                entities.players.push(new player(this.layer,this.position.x,this.position.y,this.id,0,[],false,findName('ConstructRocketLauncher',types.player),game.index))
                game.index++
                entities.players[entities.players.length-1].color={eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[160,165,170],body:[150,155,160],legs:[140,145,150],arms:[145,150,155]}}
                entities.players[entities.players.length-1].construct=true
                entities.players[entities.players.length-1].direction.goal=this.direction.goal
            break
            case 160:
				for(let a=0,la=5;a<la;a++){
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-10,10),this.id,weaponData.damage*damageBuff,15,crit,this.index))
				}
			break
			case 162:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],101,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 164:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],102,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,180,crit,this.index))
			break
            case 165:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],103,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 166:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],30,random(-3,3),this.id,weaponData.damage*damageBuff,180,crit,this.index))
			break
            case 167:
				for(let a=0,la=12;a<la;a++){
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-6*(9-this.weapon.ammo),6*(9-this.weapon.ammo)),this.id,weaponData.damage*damageBuff,15,crit,this.index))
				}
			break
            case 168:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-20,20),this.id,weaponData.damage*damageBuff,3,crit,this.index))
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-20,20),this.id,weaponData.damage*damageBuff,3,crit,this.index))
            break
            case 169:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],65,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,180,crit,this.index))
			break
            case 170:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],104,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,180,crit,this.index))
			break
            case 171:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],105,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
                this.setColor()
                this.newWeaponSet(findName('PlayerRevolver',types.player))
            break
            case 172:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],105,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
            break
            case 173:
                entities.players.push(new player(this.layer,this.position.x,this.position.y,this.id,0,[],false,findName('ConstructSniper',types.player),game.index))
                game.index++
                entities.players[entities.players.length-1].color={eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[160,165,170],body:[150,155,160],legs:[140,145,150],arms:[145,150,155]}}
                entities.players[entities.players.length-1].construct=true
                entities.players[entities.players.length-1].direction.goal=this.direction.goal
            break
            case 174:
                entities.players.push(new player(this.layer,this.position.x,this.position.y,this.id,0,[],false,findName('ConstructFlamethrower',types.player),game.index))
                game.index++
                entities.players[entities.players.length-1].color={eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[160,165,170],body:[150,155,160],legs:[140,145,150],arms:[145,150,155]}}
                entities.players[entities.players.length-1].construct=true
                entities.players[entities.players.length-1].direction.goal=this.direction.goal
            break
            case 175:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
                if(this.weapon.ammo%2==0){
    				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-15,15),this.id,weaponData.damage*damageBuff*1.5,300,crit,this.index))
                }
			break
            case 191: case 228:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],111,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,1500,crit,this.index))
            break
            case 192:
                entities.players.push(new player(this.layer,this.position.x,this.position.y,this.id,0,[],false,findName('ConstructMedic',types.player),game.index))
                game.index++
                entities.players[entities.players.length-1].color={eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[160,165,170],body:[150,155,160],legs:[140,145,150],arms:[145,150,155]}}
                entities.players[entities.players.length-1].construct=true
                entities.players[entities.players.length-1].direction.goal=this.direction.goal
            break
            case 193:
                for(let a=0,la=10;a<la;a++){
				    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],112,a*36,this.id,weaponData.damage*damageBuff,300,crit,this.index))
                }
			break
            case 194:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],4,(lsin(this.direction.main)<0?-90:90)+random(-0.1,0.1),this.id,weaponData.damage*damageBuff,300,crit,this.index))
                this.velocity.x+=20*(lsin(this.direction.main)<0?1:-1)
                this.lastingForce[0]+=6*(lsin(this.direction.main)<0?1:-1)
			break
            case 196:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],113,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,3600,crit,this.index))
			break
            case 197: case 201: case 256:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],114,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,3600,crit,this.index))
			break
            case 198:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff*0.8,300,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],114,(lsin(this.direction.main)<0?60:-60),this.id,weaponData.damage*damageBuff,3600,crit,this.index))
			break
            case 199:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],117,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,3600,crit,this.index))
			break
            case 200:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],115,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,3600,crit,this.index))
			break
            case 202: case 206: case 247:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],118,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,1200,crit,this.index))
            break
            case 203:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],119,(lsin(this.direction.main)<0?-90:90)-45+weapon.uses%3*45,this.id,weaponData.damage*damageBuff,600,crit,this.index))
            break
            case 204:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],120,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,900,crit,this.index))
            break
            case 205:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],[122,123][weapon.uses%2],(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,1200,crit,this.index))
            break
            case 207:
                for(let a=0,la=7;a<la;a++){
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],a==3?112:1,(lsin(this.direction.main)<0?-90:90)-15+a*5,this.id,weaponData.damage*damageBuff*(a==3?3:1),300,crit,this.index))
                    entities.projectiles[entities.projectiles.length-1].speed=a==3?8:6
                }
            break
            case 208:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-1:1)*(90+this.weapon.ammo*18),this.id,weaponData.damage*damageBuff,300,crit,this.index))
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-1:1)*(90+this.weapon.ammo*18)+180,this.id,weaponData.damage*damageBuff,300,crit,this.index))
            break
            case 209:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],[128,129][weapon.uses%2],(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,1200,crit,this.index))
            break
            case 210:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],86,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 212: case 213: case 217:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],125,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,600,crit,this.index))
			break
            case 214:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],126,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,600,crit,this.index))
			break
            case 215:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1]-6,1,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff*0.1,300,crit,this.index))
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1]+6,1,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff*0.1,300,crit,this.index))
                if(weapon.uses%10==0){
				    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],125,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,600,crit,this.index))
                }
			break
            case 216:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],127,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,600,crit,this.index))
			break
            case 218:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],131,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,240,crit,this.index))
            break
            case 219:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
                if(weapon.uses%15==0){
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],118,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff*8,1200,crit,this.index))
                }
			break
            case 220:
                if(weapon.uses%2==0){
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],119,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,600,crit,this.index))
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)-15,this.id,weaponData.damage*damageBuff,60,crit,this.index))
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+15,this.id,weaponData.damage*damageBuff,60,crit,this.index))
                }else{
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],132,(lsin(this.direction.main)<0?-90:90)+180,this.id,weaponData.damage*damageBuff*0.8,600,crit,this.index))
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)-5,this.id,weaponData.damage*damageBuff,60,crit,this.index))
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+5,this.id,weaponData.damage*damageBuff,60,crit,this.index))
                }
            break
            case 221:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1]-5+weapon.ammo%2*10,133,(lsin(this.direction.main)<0?-90:90)-6+floor(weapon.ammo/2)%3*6,this.id,weaponData.damage*damageBuff,300,crit,this.index))
            break
			case 223:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],68,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,720,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],135,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,720,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],136,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,720,crit,this.index))
			break
			case 224:
				for(let a=0,la=15;a<la;a++){
                    let mult=random(5,10)
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],132,(lsin(this.direction.main)<0?-90:90)+random(-20,20),this.id,weaponData.damage*damageBuff,450,crit,this.index))
                    entities.projectiles[entities.projectiles.length-1].velocity.x*=mult
                    entities.projectiles[entities.projectiles.length-1].velocity.y*=mult
				}
			break
            case 226:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],[139,140,141,142][weapon.uses%4],(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,1500,crit,this.index))
            break
            case 229:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],146,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,3600,crit,this.index))
			break
            case 230:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],144,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,1500,crit,this.index))
            break
            case 231:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],147,(lsin(this.direction.main)<0?-105:105)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 232:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],147,(lsin(this.direction.main)<0?-105:105)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],132,(lsin(this.direction.main)<0?90:-90)+random(-10,10),this.id,weaponData.damage*damageBuff,60,crit,this.index))
			break
            case 234: case 238:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1]-5+weapon.ammo%2*10,133,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
            break
            case 235:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],148,(lsin(this.direction.main)<0?-90:90)-18+weapon.ammo*3%7*6,this.id,weaponData.damage*damageBuff,300,crit,this.index))
            break
            case 236:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1]-5+weapon.ammo%2*10,149,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
            break
            case 239:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1]-5+weapon.ammo%2*10,150,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,1800,crit,this.index))
            break
            case 244:
                for(let a=0,la=3;a<la;a++){
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],152,random(-105,105),this.id,weaponData.damage*damageBuff,10,crit,this.index))
                }
            break
            case 248:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],154,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,600,crit,this.index))
			break
            case 249:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],4,(lsin(this.direction.main)<0?-90:90)+random(-0.1,0.1),this.id,weaponData.damage*damageBuff,300,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)-2+random(-0.1,0.1),this.id,weaponData.damage*damageBuff*0.5,30,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+2+random(-0.1,0.1),this.id,weaponData.damage*damageBuff*0.5,30,crit,this.index))
			break
            case 250:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],155,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
            break
            case 251:
                for(let a=0,la=4;a<la;a++){
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-0.5,0.5),this.id,weaponData.damage*damageBuff,300,crit,this.index))
                    entities.projectiles[entities.projectiles.length-1].speed=6-a
                }
            break
            case 252:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,60,crit,this.index))
                entities.projectiles[entities.projectiles.length-1].speed*=0.8
            break
            case 254: case 255: case 289:
                let minimum=[900,900]
                for(let a=0,la=entities.players.length;a<la;a++){
                    if((entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0)&&entities.players[a].life>0&&dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)<900){
                        let distance=dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)
                        if(entities.players[a].position.x<this.position.x){
                            minimum[0]=min(minimum[0],distance)
                        }else if(entities.players[a].position.x>this.position.x){
                            minimum[1]=min(minimum[1],distance)
                        }
                    }
                }
                let fired=[false,false]
                for(let a=0,la=entities.players.length;a<la;a++){
                    if((entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0)&&entities.players[a].life>0){
                        let distance=dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)
                        if(!fired[0]&&distance==minimum[0]){
                            entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),this.id,this.weaponData.damage*this.playerData.damageBuff,300,crit,this.index))
                            fired[0]=true
                        }
                        if(!fired[1]&&distance==minimum[1]){
                            entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),this.id,this.weaponData.damage*this.playerData.damageBuff,300,crit,this.index))
                            fired[1]=true
                        }
                    }
                }
                if(!fired[0]){
                    entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,-90,this.id,this.weaponData.damage*this.playerData.damageBuff,300,crit,this.index))
                }
                if(!fired[1]){
                    entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,90,this.id,this.weaponData.damage*this.playerData.damageBuff,300,crit,this.index))
                }
            break
			case 258: case 259: case 286:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],135,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,720,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],136,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,720,crit,this.index))
			break
            case 261:
                let minimum261=[900,900,900,900,900,900,900,900,900,900]
                for(let a=0,la=entities.players.length;a<la;a++){
                    if((entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0)&&entities.players[a].life>0&&dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)<900){
                        let distance=dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)
                        let dir=atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y)
                        for(let b=0,lb=10;b<lb;b++){
                            if(abs(dir-((b*36+this.time)%360))<60||abs(dir-((b*36+this.time)%360)+360)<60||abs(dir-((b*36+this.time)%360)-360)<60){
                                minimum261[b]=min(minimum261[b],distance)
                            }
                        }
                    }
                }
                let fired261=[false,false,false,false,false,false,false,false,false,false]
                for(let a=0,la=entities.players.length;a<la;a++){
                    if((entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0)&&entities.players[a].life>0){
                        let distance=dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)
                        for(let b=0,lb=10;b<lb;b++){
                            if(!fired261[b]&&distance==minimum261[b]){
                                entities.projectiles.push(new projectile(this.layer,this.position.x+lsin(b*36+this.time)*4,this.position.y-lcos(b*36+this.time)*4,1,atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),this.id,this.weaponData.damage*this.playerData.damageBuff,300,crit,this.index))
                                fired261[b]=true
                            }
                        }
                    }
                }
                for(let b=0,lb=10;b<lb;b++){
                    if(!fired261[b]){
                        entities.projectiles.push(new projectile(this.layer,this.position.x+lsin(b*36+this.time)*4,this.position.y-lcos(b*36+this.time)*4,1,b*36+this.time,this.id,this.weaponData.damage*this.playerData.damageBuff,300,crit,this.index))
                    }
                }
			break
            case 262:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],156,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],119,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,600,crit,this.index))
			break
            case 263:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],118,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,1200,crit,this.index))
            break
            case 264:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],114,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,1800,crit,this.index))
			break
            case 265:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],157,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,1500,crit,this.index))
            break
            case 266:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],[158,159,160,158][weapon.uses%4],(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,1500,crit,this.index))
            break
            case 267:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],[118,111,124][weapon.uses%3],(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,1500,crit,this.index))
            break
            case 268:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-3,3)+165,this.id,weaponData.damage*damageBuff,300,crit,this.index))
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-3,3)-165,this.id,weaponData.damage*damageBuff,300,crit,this.index))
                this.velocity.x+=3*(lsin(this.direction.main)<0?-1:1)
                this.lastingForce[0]+=0.2*(lsin(this.direction.main)<0?-1:1)
            break
            case 271:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],114,-90,this.id,weaponData.damage*damageBuff,900,crit,this.index))
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],114,90,this.id,weaponData.damage*damageBuff,900,crit,this.index))
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],119,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,600,crit,this.index))
            break
            case 273:
                entities.players.push(new player(this.layer,this.position.x,this.position.y,this.id,0,[],false,findName('ConstructGuard',types.player),game.index))
                game.index++
                entities.players[entities.players.length-1].color={eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[160,165,170],body:[150,155,160],legs:[140,145,150],arms:[145,150,155]}}
                entities.players[entities.players.length-1].construct=true
                entities.players[entities.players.length-1].direction.goal=this.direction.goal
            break
			case 278:
				for(let a=0,la=15;a<la;a++){
                    let mult=random(1.5,2.5)
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],114,(lsin(this.direction.main)<0?-90:90)+random(-20,20),this.id,weaponData.damage*damageBuff,900,crit,this.index))
                    entities.projectiles[entities.projectiles.length-1].velocity.x*=mult
                    entities.projectiles[entities.projectiles.length-1].velocity.y*=mult
				}
			break
            case 279:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-135:135)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 280:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],166,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,720,crit,this.index))
			break
            case 281:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],6,(lsin(this.direction.main)<0?-90:90)+random(-15,15),this.id,weaponData.damage*damageBuff,10,crit,this.index))
                if(weapon.uses%2==0){
				    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],147,(lsin(this.direction.main)<0?-105:105)+random(-3,3),this.id,weaponData.damage*damageBuff*3,300,crit,this.index))
                }
			break
            case 282:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],135,(lsin(this.direction.main)<0?-45:45),this.id,weaponData.damage*damageBuff,720,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],136,(lsin(this.direction.main)<0?-45:45),this.id,weaponData.damage*damageBuff,720,crit,this.index))
			break
            case 283:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],167,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
            break
            case 284: case 285:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],119,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,600,crit,this.index))
            break
            case 287:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],[118,171][weapon.uses%2],(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,1200,crit,this.index))
            break
            case 290:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],135,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,720,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],136,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,720,crit,this.index))
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],119,(lsin(this.direction.main)<0?-90:90)-36,this.id,weaponData.damage*damageBuff,600,crit,this.index))
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],119,(lsin(this.direction.main)<0?-90:90)+36,this.id,weaponData.damage*damageBuff,600,crit,this.index))
			break
            case 291:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],135,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,720,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],136,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,720,crit,this.index))
                if(weapon.uses%3==0){
				    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],130,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff*10,600,crit,this.index))
                }
			break
            case 292:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],135,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,720,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],136,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,720,crit,this.index))
                for(let a=0,la=5;a<la;a++){
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],15,(lsin(this.direction.main)<0?-90:90)+random(-15,15),this.id,weaponData.damage*damageBuff,15,crit,this.index))
                }
			break
            case 293:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],4,(lsin(this.direction.main)<0?-90:90)+random(-0.1,0.1),this.id,weaponData.damage*damageBuff,300,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],11,(lsin(this.direction.main)<0?-90:90)-1+random(-0.1,0.1),this.id,weaponData.damage*damageBuff*0.4,30,crit,this.index))
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],11,(lsin(this.direction.main)<0?-90:90)+1+random(-0.1,0.1),this.id,weaponData.damage*damageBuff*0.4,30,crit,this.index))
			break
            case 294:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],172,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,600,crit,this.index))
            break
            case 295:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
                if(weapon.ammo==0){
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],173,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff*4,300,crit,this.index))
                }
            break
            case 296:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],2,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
                this.velocity.x+=8*(lsin(this.direction.main)<0?1:-1)
                this.lastingForce[0]+=2.4*(lsin(this.direction.main)<0?1:-1)
                entities.players.push(new player(this.layer,this.position.x,this.position.y,this.id,0,[],false,findName('SidekickRocketLauncher',types.player),this.index))
                entities.players[entities.players.length-1].sidekick=true
                entities.players[entities.players.length-1].direction.goal=this.direction.goal
                entities.players[entities.players.length-1].DOT.damage=1
                entities.players[entities.players.length-1].DOT.active=9999
			break
            case 297:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],174,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 299:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],175,(lsin(this.direction.main)<0?-90:90)+random(-0.1,0.1),this.id,weaponData.damage*damageBuff,300,crit,this.index))
			break
            case 301:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],176,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,180,crit,this.index))
			break
            case 302:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],[119,124][weapon.uses%2],(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,900,crit,this.index))
            break
            case 303:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],177,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,900,crit,this.index))
            break
            case 304:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],178,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,900,crit,this.index))
            break
            case 305:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],179,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,900,crit,this.index))
            break
            case 306:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],4,(lsin(this.direction.main)<0?-90:90)+random(-0.1,0.1),this.id,weaponData.damage*damageBuff,300,crit,this.index))
                this.velocity.x+=10*(lsin(this.direction.main)<0?-1:1)
                this.lastingForce[0]+=2.4*(lsin(this.direction.main)<0?-1:1)
			break
            case 307:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],50,(lsin(this.direction.main)<0?-90:90)+random(-0.1,0.1),this.id,weaponData.damage*damageBuff,300,crit,this.index))
                this.velocity.x+=10*(lsin(this.direction.main)<0?-1:1)
                this.lastingForce[0]+=2.4*(lsin(this.direction.main)<0?-1:1)
			break
            case 308:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],119,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,900,crit,this.index))
                this.velocity.x+=10*(lsin(this.direction.main)<0?-1:1)
                this.lastingForce[0]+=2.4*(lsin(this.direction.main)<0?-1:1)
			break
            case 309: case 316: case 318:
                for(let a=0,la=7;a<la;a++){
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)-15+a*5,this.id,weaponData.damage*damageBuff,300,crit,this.index))
                    entities.projectiles[entities.projectiles.length-1].speed=6
                }
            break
            case 310:
                entities.players.push(new player(this.layer,this.position.x,this.position.y,this.id,0,[],false,findName('ConstructDestroyer',types.player),game.index))
                game.index++
                entities.players[entities.players.length-1].color={eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[160,165,170],body:[150,155,160],legs:[140,145,150],arms:[145,150,155]}}
                entities.players[entities.players.length-1].construct=true
                entities.players[entities.players.length-1].direction.goal=this.direction.goal
            break
            case 311:
                entities.players.push(new player(this.layer,this.position.x,this.position.y,this.id,0,[],false,findName('ConstructAuto',types.player),game.index))
                game.index++
                entities.players[entities.players.length-1].color={eye:{back:[0,0,0]},beak:{main:[255,140,25],mouth:[0,0,0],nostril:[0,0,0]},skin:{head:[160,165,170],body:[150,155,160],legs:[140,145,150],arms:[145,150,155]}}
                entities.players[entities.players.length-1].construct=true
                entities.players[entities.players.length-1].direction.goal=this.direction.goal
            break
            case 312:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],181,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,3600,crit,this.index))
			break
            case 313:
                for(let a=0,la=12;a<la;a++){
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-1:1)*(90-56+a*8-max(0,a-7)*6.5),this.id,weaponData.damage*damageBuff,300,crit,this.index))
                    entities.projectiles[entities.projectiles.length-1].speed=6
                }
            break
            case 314:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1]-3+weapon.uses%2*6,1,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,300,crit,this.index))
                if(weapon.uses%4==0){
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],114,random(0,360),this.id,weaponData.damage*damageBuff*2,900,crit,this.index))
                }
            break
            case 317:
                for(let a=0,la=11;a<la;a++){
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)-15+a*3,this.id,weaponData.damage*damageBuff*(2-abs(a-5)*0.3),300,crit,this.index))
                    entities.projectiles[entities.projectiles.length-1].speed=8-abs(a-5)*0.6
                }
            break
            case 319: case 321:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],1,(lsin(this.direction.main)<0?-90:90)+random(-3,3),this.id,weaponData.damage*damageBuff,300,crit,this.index))
                this.velocity.x+=10*(lsin(this.direction.main)<0?-1:1)
                this.lastingForce[0]+=2.4*(lsin(this.direction.main)<0?-1:1)
			break
            case 320: case 322:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],182,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,900,crit,this.index))
            break
            case 323:
                entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],121,(lsin(this.direction.main)<0?-90:90)+weapon.uses%4*90,this.id,weaponData.damage*damageBuff,600,crit,this.index))
            break
            case 324:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],114,(lsin(this.direction.main)<0?60:-60),this.id,weaponData.damage*damageBuff,3600,crit,this.index))
                if(weapon.uses%3==0){
                    entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],184,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff*2,1200,crit,this.index))
                }
			break
            case 325:
				entities.projectiles.push(new projectile(this.layer,spawn[0],spawn[1],185,(lsin(this.direction.main)<0?-90:90),this.id,weaponData.damage*damageBuff,1200,crit,this.index))
			break

		}
        if(weapon.uses<=0&&this.id>0&&!game.randomizer){
            switch(variant){
                case 0: this.weaponType=-1
                case 1: this.subWeaponAType=-1
                case 2: this.subWeaponBType=-1
            }
        }
	}
    update(){
        if(this.inactive){
            if(this.id>0){
                if(game.limit<=27000){
                    this.inactive=false
                }
            }else{
                for(let a=0,la=game.gaming;a<la;a++){
                    if(
                        abs(this.position.x-entities.players[a].position.x)<300&&
                        abs(this.position.y-entities.players[a].position.y)<150&&
                        floor((this.position.x-game.tileset[0]/2)/(16*game.tileset[0]))==floor((entities.players[a].position.x-game.tileset[0]/2)/(16*game.tileset[0]))&&
                        floor((this.position.y-game.tileset[1]*15.5)/(16*game.tileset[1]))==floor((entities.players[a].position.y-game.tileset[1]*15.5)/(16*game.tileset[1]))||
                        game.hunt==-1&&
                        abs(this.position.x-entities.players[a].position.x)<900&&
                        abs(this.position.y-entities.players[a].position.y)<450&&
                        abs(floor((this.position.x-game.tileset[0]/2)/(16*game.tileset[0]))-floor((entities.players[a].position.x-game.tileset[0]/2)/(16*game.tileset[0])))<1&&
                        abs(floor((this.position.y-game.tileset[1]*15.5)/(16*game.tileset[1]))-floor((entities.players[a].position.y-game.tileset[1]*15.5)/(16*game.tileset[1])))<1
                    ){
                        this.inactive=false
                    }
                }
            }
        }else{
            let projectilesLength=entities.projectiles.length
            this.attacking=false
            this.time++
            switch(this.weaponType){
                case 6: case 12: case 17: case 45: case 54: case 69: case 75: case 79: case 92: case 93:
                case 132: case 145: case 181: case 237: case 249: case 288: case 293:
                    this.infoAnim.bar=[smoothAnim(this.infoAnim.bar[0],lsin(this.direction.main)<0,0,1,5),smoothAnim(this.infoAnim.bar[1],lsin(this.direction.main)>0,0,1,5)]
                    if(this.time%10==0){
                        this.pointer.hit=false
                        this.pointer.x=this.position.x
                        this.pointer.y=this.position.y
                    }
                break
                case 191: case 202: case 203: case 204: case 205: case 206: case 209: case 211: case 219: case 220:
                case 226: case 228: case 230: case 247: case 263: case 265: case 266: case 267: case 284: case 285:
                case 302: case 303: case 304: case 305: case 320: case 322: case 323: case 324:
                    this.infoAnim.bar=[smoothAnim(this.infoAnim.bar[0],lsin(this.direction.main)<0,0,1,5),smoothAnim(this.infoAnim.bar[1],lsin(this.direction.main)>0,0,1,5)]
                    if(!this.sidekick){
                        if(this.time%5==0){
                            let hit=false
                            if(![191,226,228,230,265,266].includes(this.weaponType)){
                                for(let a=0,la=entities.walls.length;a<la;a++){
                                    for(let b=0,lb=entities.walls[a].length;b<lb;b++){
                                        let c=entities.walls[a][b]
                                        if(
                                            (
                                                (!hit&&c.position.x+c.width/2+10>this.position.x+(lsin(this.direction.main)<0?-450:450)||hit&&c.position.x+c.width/2+10>this.pointer.x)&&c.position.x<this.position.x&&lsin(this.direction.main)<0||
                                                (!hit&&c.position.x-c.width/2-10<this.position.x+(lsin(this.direction.main)<0?-450:450)||hit&&c.position.x-c.width/2-10<this.pointer.x)&&c.position.x>this.position.x&&lsin(this.direction.main)>0
                                            )&&
                                            c.standard&&c.position.y+c.height/2>this.position.y&&c.position.y-c.height/2<this.position.y
                                        ){
                                            if(!hit){
                                                this.pointer.x=this.position.x+(lsin(this.direction.main)<0?-450:450)
                                                this.pointer.y=this.position.y
                                                hit=true
                                            }
                                            this.pointer.x=c.position.x-c.width/2-10
                                        }
                                    }
                                }
                            }
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if(
                                    (
                                        (!hit&&entities.players[a].position.x+entities.players[a].width/2+10>this.position.x+(lsin(this.direction.main)<0?-450:450)||hit&&entities.players[a].position.x+entities.players[a].width/2+10>this.pointer.x)&&entities.players[a].position.x<this.position.x&&lsin(this.direction.main)<0||
                                        (!hit&&entities.players[a].position.x-entities.players[a].width/2-10<this.position.x+(lsin(this.direction.main)<0?-450:450)||hit&&entities.players[a].position.x-entities.players[a].width/2-10<this.pointer.x)&&entities.players[a].position.x>this.position.x&&lsin(this.direction.main)>0
                                    )&&
                                    entities.players[a].position.y+entities.players[a].height/2>this.position.y&&entities.players[a].position.y-entities.players[a].height/2<this.position.y
                                ){
                                    this.pointer.y=this.position.y
                                    hit=true
                                    this.pointer.hit=true
                                    this.pointer.x=entities.players[a].position.x
                                }
                            }
                            if(!hit){
                                this.pointer.hit=false
                                this.pointer.fails++
                                if(this.pointer.fails>=([191,226,228,230,265,266].includes(this.weaponType)?15:6)){
                                    this.pointer.x=this.position.x+(lsin(this.direction.main)<0?-150:150)
                                    this.pointer.y=this.position.y
                                }
                            }else{
                                this.pointer.fails=0
                            }
                        }
                    }
                break
                default:
                    if(this.time%10==0){
                        this.pointer.hit=false
                        this.pointer.x=this.position.x
                        this.pointer.y=this.position.y
                    }
                break
            }
            for(let a=0,la=this.infoAnim.ammo.length;a<la;a++){
                this.infoAnim.ammo[a]=smoothAnim(this.infoAnim.ammo[a],this.weapon.ammo>a,0,1,5)
            }
            for(let a=0,la=this.infoAnim.uses.length;a<la;a++){
                this.infoAnim.uses[a]=smoothAnim(this.infoAnim.uses[a],this.weapon.uses>a,0,1,5)
            }
            if(abs(this.direction.main-this.direction.goal)<=18||abs(this.direction.main-this.direction.goal-360)<=18||abs(this.direction.main-this.direction.goal+360)<=18||abs(this.direction.main-this.direction.goal-720)<=18||abs(this.direction.main-this.direction.goal+720)<=18){
                this.direction.main=this.direction.goal
            }else if(
                this.direction.main>this.direction.goal&&this.direction.main<this.direction.goal+180||
                this.direction.main>this.direction.goal-360&&this.direction.main<this.direction.goal-180||
                this.direction.main>this.direction.goal+360&&this.direction.main<this.direction.goal+540||
                this.direction.main>this.direction.goal-720&&this.direction.main<this.direction.goal-540||
                this.direction.main>this.direction.goal+720&&this.direction.main<this.direction.goal+900){
                this.direction.main-=18
            }else if(
                this.direction.main<this.direction.goal&&this.direction.main>this.direction.goal-180||
                this.direction.main<this.direction.goal+360&&this.direction.main>this.direction.goal+180||
                this.direction.main<this.direction.goal-360&&this.direction.main>this.direction.goal-540||
                this.direction.main<this.direction.goal+720&&this.direction.main>this.direction.goal+540||
                this.direction.main<this.direction.goal-720&&this.direction.main>this.direction.goal-900){
                this.direction.main+=18
            }else{
                this.direction.main+=18*randSign()
            }
            if(this.direction.main>180){
                this.direction.main-=360
            }else if(this.direction.main<-180){
                this.direction.main+=360
            }
            if(this.direction.goal>180){
                this.direction.goal-=360
            }else if(this.direction.goal<-180){
                this.direction.goal+=360
            }
            this.collect.life=this.collect.life*0.9+this.life*0.1
            if(this.weaponType==14||this.weaponType==66||this.playerData.name=='BigHyperPistol'||this.playerData.name=='HyperTank'||this.playerData.name=='HyperShotgun'){
                if(this.active>0){
                    if(this.playerData.name=='BigMultiHyperMedic'){
                        if(this.active==659){
                            this.color.skin.head=this.base.color.skin.head
                            this.color.skin.body=this.base.color.skin.body
                            this.color.skin.legs=this.base.color.skin.legs
                            this.color.skin.arms=this.base.color.skin.arms
                        }
                        this.active--
                    }else{
                        this.active--
                        if(this.active<=0){
                            this.active=-1
                            this.color=this.base.color
                        }
                    }
                }else if(this.active==0&&this.life<this.base.life){
                    this.active=this.playerData.name=='BigMultiHyperMedic'?900:this.playerData.name=='BigHyperMedic'?360:this.playerData.name=='ShortHyperMedic'?120:240
                    this.color.skin.head=mergeColor(this.color.skin.head,[255,255,255],0.6)
                    this.color.skin.body=mergeColor(this.color.skin.body,[255,255,255],0.6)
                    this.color.skin.legs=mergeColor(this.color.skin.legs,[255,255,255],0.6)
                    this.color.skin.arms=mergeColor(this.color.skin.arms,[255,255,255],0.6)
                }
            }else if(this.playerData.name=='HyperPistol'||this.playerData.name=='CritHyperPistol'||this.playerData.name=='HyperCaffeinePistol'||this.playerData.name=='HyperShotgun'){
                if(this.active>0){
                    this.active--
                    if(this.active<=0){
                        this.active=-1
                        this.color=this.base.color
                    }
                }else if(this.active==0&&this.life<this.base.life){
                    this.active=120
                    if(this.playerData.name=='HyperCaffeinePistol'){
                        this.critBuff=max(this.critBuff,150)
                    }
                    this.color.skin.head=mergeColor(this.color.skin.head,[255,255,255],0.6)
                    this.color.skin.body=mergeColor(this.color.skin.body,[255,255,255],0.6)
                    this.color.skin.legs=mergeColor(this.color.skin.legs,[255,255,255],0.6)
                    this.color.skin.arms=mergeColor(this.color.skin.arms,[255,255,255],0.6)
                }
            }
            if(this.construct){
                if(this.time%15==0){
                    let targets=[]
                    for(let a=0,la=entities.players.length;a<la;a++){
                        if(
                            this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||
                            this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||
                            game.pvp&&this.id!=entities.players[a].id||
                            this.weaponType==11&&entities.players[a].life<entities.players[a].base.life*2&&this.index!=entities.players[a].index&&!entities.players[a].playerData.name.includes('Medic')&&this.construct
                        ){
                            if((
                                abs(this.position.x-entities.players[a].position.x)<600&&abs(this.position.y-entities.players[a].position.y)<abs(this.position.x-entities.players[a].position.x)/5+25&&this.weaponType!=6&&this.weaponType!=8&&this.weaponType!=11||
                                abs(this.position.x-entities.players[a].position.x)<900&&abs(this.position.y-entities.players[a].position.y)<15&&this.weaponType==6||
                                abs(this.position.x-entities.players[a].position.x)<120&&abs(this.position.y-entities.players[a].position.y)<45&&this.weaponType==8||
                                abs(this.position.x-entities.players[a].position.x)<300&&abs(this.position.y-entities.players[a].position.y)<45&&this.weaponType==11
                            )&&entities.players[a].life>0){
                                targets.push([entities.players[a].position.x,entities.players[a].position.y])
                            }else if((
                                abs(this.position.x-game.edge[0]-entities.players[a].position.x)<600&&abs(this.position.y-entities.players[a].position.y)<abs(this.position.x-game.edge[0]-entities.players[a].position.x)/5+25&&this.weaponType!=6&&this.weaponType!=8&&this.weaponType!=11||
                                abs(this.position.x-game.edge[0]-entities.players[a].position.x)<900&&abs(this.position.y-entities.players[a].position.y)<15&&this.weaponType==6||
                                abs(this.position.x-game.edge[0]-entities.players[a].position.x)<120&&abs(this.position.y-entities.players[a].position.y)<45&&this.weaponType==8||
                                abs(this.position.x-game.edge[0]-entities.players[a].position.x)<300&&abs(this.position.y-entities.players[a].position.y)<45&&this.weaponType==11
                            )&&entities.players[a].life>0){
                                targets.push([entities.players[a].position.x+game.edge[0],entities.players[a].position.y])
                            }else if((
                                abs(this.position.x+game.edge[0]-entities.players[a].position.x)<600&&abs(this.position.y-entities.players[a].position.y)<abs(this.position.x+game.edge[0]-entities.players[a].position.x)/5+25&&this.weaponType!=6&&this.weaponType!=8&&this.weaponType!=11||
                                abs(this.position.x+game.edge[0]-entities.players[a].position.x)<900&&abs(this.position.y-entities.players[a].position.y)<15&&this.weaponType==6||
                                abs(this.position.x+game.edge[0]-entities.players[a].position.x)<120&&abs(this.position.y-entities.players[a].position.y)<45&&this.weaponType==8||
                                abs(this.position.x+game.edge[0]-entities.players[a].position.x)<300&&abs(this.position.y-entities.players[a].position.y)<45&&this.weaponType==11
                            )&&entities.players[a].life>0){
                                targets.push([entities.players[a].position.x-game.edge[0],entities.players[a].position.y])
                            }
                        }
                    }
                    if(targets.length>0){
                        let target=targets[floor(random(targets.length))]
                        this.target.position.x=target[0]
                        this.target.position.y=target[1]
                        this.direction.goal=target[0]>this.position.x?54:-54
                        this.manage[1]=true
                    }else{
                        this.manage[1]=false
                    }
                }
                this.attacking=this.manage[1]
                if(this.manage[1]==1&&this.life>0&&this.weapon.cooldown<=0&&this.weapon.ammo>0&&this.life>0&&!this.weapon.reloading){
                    this.attack(0)
                }
            }else if(this.id>=game.gaming+1||this.id==0){
                if(floor(random(0,this.id>0?60:10))==0||abs(this.position.x-this.target.position.x)<10){
                    if(game.attacker&&!this.free){
                        let targets=[]
                        this.manage[1]=false
                        for(let a=0,la=entities.players.length;a<la;a++){
                            if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&abs(this.position.x-entities.players[a].position.x)<600&&abs(this.position.y-entities.players[a].position.y)<abs(this.position.x-entities.players[a].position.x)/5+25&&entities.players[a].life>0){
                                targets.push([entities.players[a].position.x,entities.players[a].position.y])
                            }
                        }
                        if(targets.length>0){
                            let target=targets[floor(random(targets.length))]
                            this.target.position.x=target[0]+random(-60,60)
                            this.target.position.y=target[1]
                            this.manage[1]=true
                        }else if(floor(random(0,10))==0){
                            this.target.position.x=this.base.position.x+random(-80,80)
                            this.target.position.y=this.position.y
                        }
                    }else if(game.level==6||game.level==8||game.level==17){
                        let targets=[]
                        this.target.position.x=this.position.x
                        this.target.position.y=game.edge[1]*0.1
                        this.manage[1]=false
                        for(let a=0,la=entities.players.length;a<la;a++){
                            if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&abs(this.position.x-entities.players[a].position.x)<500&&abs(this.position.y-entities.players[a].position.y)<abs(this.position.x-entities.players[a].position.x)/10+25&&entities.players[a].life>0){
                                targets.push([entities.players[a].position.x,entities.players[a].position.y])
                            }
                        }
                        if(targets.length>0){
                            let target=targets[floor(random(targets.length))]
                            this.target.position.x=target[0]+random(-60,60)
                            this.target.position.y=target[1]
                            this.manage[1]=true
                        }else{
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)<1000&&entities.players[a].life>0){
                                    targets.push([entities.players[a].position.x,entities.players[a].position.y])
                                }
                            }
                            if(targets.length>0){
                                let target=targets[floor(random(targets.length))]
                                this.target.position.y=target[1]
                                if(this.target.position.y>this.position.y-50){
                                    if(this.target.position.y<this.position.y+50){
                                        this.target.position.x=target[0]
                                    }else{
                                        targets=[]
                                        for(let a=0,la=entities.walls.length;a<la;a++){
                                            for(let b=0,lb=entities.walls[a].length;b<lb;b++){
                                                let c=entities.walls[a][b]
                                                if(c.type==2&&abs(this.position.x-c.position.x)<400&&abs(this.position.y+240-c.position.y)<80){
                                                    targets.push([c.position.x,c.position.y-c.height/2])
                                                }
                                            }
                                        }
                                        if(targets.length>0){
                                            target=targets[floor(random(targets.length))]
                                            this.target.position.x=target[0]+random(-20,20)*(this.weaponData.name.includes('Punch')?0.2:1)
                                        }else{
                                            this.target.position.x=target[0]+random(-150,150)*(this.weaponData.name.includes('Punch')?0.2:1)
                                        }
                                    }
                                }else{
                                    targets=[]
                                    for(let a=0,la=entities.walls.length;a<la;a++){
                                        for(let b=0,lb=entities.walls[a].length;b<lb;b++){
                                            let c=entities.walls[a][b]
                                            if(c.type==2&&abs(this.position.x-c.position.x)<400&&abs(this.position.y-c.position.y)<80){
                                                targets.push([c.position.x,c.position.y-c.height/2])
                                            }
                                        }
                                    }
                                    if(targets.length>0){
                                        target=targets[floor(random(targets.length))]
                                        this.target.position.x=target[0]+random(-20,20)*(this.weaponData.name.includes('Punch')?0.2:1)
                                    }else{
                                        this.target.position.x=target[0]+random(-150,150)*(this.weaponData.name.includes('Punch')?0.2:1)
                                    }
                                }
                            }else{
                                for(let a=0,la=entities.players.length;a<la;a++){
                                    if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&entities.players[a].life>0){
                                        targets.push([entities.players[a].position.x,entities.players[a].position.y])
                                    }
                                }
                                if(targets.length>0){
                                    let target=targets[floor(random(targets.length))]
                                    this.target.position.y=target[1]
                                    if(this.target.position.y>this.position.y-50){
                                        if(this.target.position.y<this.position.y+50){
                                            this.target.position.x=target[0]
                                        }else{
                                            targets=[]
                                            for(let a=0,la=entities.walls.length;a<la;a++){
                                                for(let b=0,lb=entities.walls[a].length;b<lb;b++){
                                                    let c=entities.walls[a][b]
                                                    if(c.type==2&&abs(this.position.x-c.position.x)<400&&abs(this.position.y+240-c.position.y)<80){
                                                        targets.push([c.position.x,c.position.y-c.height/2])
                                                    }
                                                }
                                            }
                                            if(targets.length>0){
                                                target=targets[floor(random(targets.length))]
                                                this.target.position.x=target[0]+random(-20,20)*(this.weaponData.name.includes('Punch')?0.2:1)
                                            }else{
                                                this.target.position.x=target[0]+random(-150,150)*(this.weaponData.name.includes('Punch')?0.2:1)
                                            }
                                        }
                                    }else{
                                        targets=[]
                                        for(let a=0,la=entities.walls.length;a<la;a++){
                                            for(let b=0,lb=entities.walls[a].length;b<lb;b++){
                                                let c=entities.walls[a][b]
                                                if(c.type==2&&abs(this.position.x-c.position.x)<400&&abs(this.position.y-c.position.y)<80){
                                                    targets.push([c.position.x,c.position.y-c.height/2])
                                                }
                                            }
                                        }
                                        if(targets.length>0){
                                            target=targets[floor(random(targets.length))]
                                            this.target.position.x=target[0]+random(-20,20)*(this.weaponData.name.includes('Punch')?0.2:1)
                                        }else{
                                            this.target.position.x=target[0]+random(-150,150)*(this.weaponData.name.includes('Punch')?0.2:1)
                                        }
                                    }
                                }else{
                                    this.target.position.x=game.edge[0]*random(0.2,0.8)
                                    this.target.position.y=game.edge[1]/10
                                }
                            }
                        }
                    }else if(game.level==7){
                        let targets=[]
                        for(let a=0,la=entities.players.length;a<la;a++){
                            if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&(
                                dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)<300
                            )&&entities.players[a].life>0){
                                targets.push([entities.players[a].position.x,entities.players[a].position.y])
                            }
                            if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&(
                                dist(this.position.x,this.position.y,entities.players[a].position.x-game.edge[0],entities.players[a].position.y)<300
                            )&&entities.players[a].life>0){
                                targets.push([entities.players[a].position.x-game.edge[0],entities.players[a].position.y])
                            }
                            if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&(
                                dist(this.position.x,this.position.y,entities.players[a].position.x+game.edge[0],entities.players[a].position.y)<300
                            )&&entities.players[a].life>0){
                                targets.push([entities.players[a].position.x+game.edge[0],entities.players[a].position.y])
                            }
                            if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&(
                                dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y-game.edge[1])<300
                            )&&entities.players[a].life>0){
                                targets.push([entities.players[a].position.x,entities.players[a].position.y-game.edge[1]])
                            }
                            if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&(
                                dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y+game.edge[1])<300
                            )&&entities.players[a].life>0){
                                targets.push([entities.players[a].position.x,entities.players[a].position.y+game.edge[1]])
                            }
                        }
                        if(targets.length>0){
                            let target=targets[floor(random(targets.length))]
                            this.target.position.x=target[0]+random(-240,240)*(this.weaponData.name.includes('Punch')?0.2:1)
                            this.target.position.y=target[1]
                            this.manage[1]=1
                        }else{
                            this.target.position.x+=random(-game.edge[0]*0.1,game.edge[0]*0.1)
                            this.target.position.y+=random(-game.edge[1]*0.1,game.edge[1]*0.1)
                            if(this.target.position.x<0){
                                this.target.position.x+=game.edge[0]
                            }else if(this.target.position.x>game.edge[0]){
                                this.target.position.x-=game.edge[0]
                            }
                            if(this.target.position.y<0){
                                this.target.position.y+=game.edge[1]
                            }else if(this.target.position.y>game.edge[1]){
                                this.target.position.y-=game.edge[1]
                            }
                            this.manage[1]=0
                        }
                    }else if(game.level==15||game.level==18){
                        let targets=[]
                        this.target.position.x=this.position.x
                        this.target.position.y=game.edge[1]*0.1
                        this.manage[1]=false
                        for(let a=0,la=entities.players.length;a<la;a++){
                            if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&abs(this.position.x-entities.players[a].position.x)<500&&abs(this.position.y-entities.players[a].position.y)<abs(this.position.x-entities.players[a].position.x)*0.3+25&&entities.players[a].life>0){
                                targets.push([entities.players[a].position.x,entities.players[a].position.y])
                            }
                        }
                        if(targets.length>0){
                            let target=targets[floor(random(targets.length))]
                            this.target.position.x=target[0]+random(-60,60)
                            this.target.position.y=target[1]
                            this.manage[1]=true
                        }else{
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&abs(this.position.x-entities.players[a].position.x)<1000&&abs(this.position.y-entities.players[a].position.y)<abs(this.position.x-entities.players[a].position.x)*0.4+25&&entities.players[a].life>0){
                                    targets.push([entities.players[a].position.x,entities.players[a].position.y])
                                }
                            }
                            if(targets.length>0){
                                let target=targets[floor(random(targets.length))]
                                this.target.position.x=target[0]+random(-60,60)
                                this.target.position.y=target[1]
                                this.manage[1]=true
                            }else{
                                for(let a=0,la=entities.players.length;a<la;a++){
                                    if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&abs(this.position.x-entities.players[a].position.x)>=1000&&entities.players[a].life>0){
                                        targets.push([entities.players[a].position.x,entities.players[a].position.y])
                                    }
                                }
                                if(targets.length>0){
                                    let target=targets[floor(random(targets.length))]
                                    this.target.position.x=target[0]+random(-60,60)
                                    this.target.position.y=target[1]
                                    this.manage[1]=true
                                }else{
                                    for(let a=0,la=entities.players.length;a<la;a++){
                                        if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)<1200&&entities.players[a].life>0){
                                            targets.push([entities.players[a].position.x,entities.players[a].position.y])
                                        }
                                    }
                                    if(targets.length>0){
                                        let target=targets[floor(random(targets.length))]
                                        this.target.position.y=target[1]
                                        if(this.target.position.y>this.position.y-50){
                                            if(this.target.position.y<this.position.y+50){
                                                this.target.position.x=target[0]
                                            }else{
                                                targets=[]
                                                for(let a=0,la=entities.walls.length;a<la;a++){
                                                    for(let b=0,lb=entities.walls[a].length;b<lb;b++){
                                                        let c=entities.walls[a][b]
                                                        if((c.type==2||c.type==25||c.type==29)&&abs(this.position.x-c.position.x)<400&&abs(this.position.y+240-c.position.y)<80){
                                                            targets.push([c.position.x,c.position.y-c.height/2])
                                                        }
                                                    }
                                                }
                                                if(targets.length>0){
                                                    target=targets[floor(random(targets.length))]
                                                    this.target.position.x=target[0]+random(-20,20)*(this.weaponData.name.includes('Punch')?0.2:1)
                                                }else{
                                                    this.target.position.x=target[0]+random(-150,150)*(this.weaponData.name.includes('Punch')?0.2:1)
                                                }
                                            }
                                        }else{
                                            targets=[]
                                            for(let a=0,la=entities.walls.length;a<la;a++){
                                                for(let b=0,lb=entities.walls[a].length;b<lb;b++){
                                                    let c=entities.walls[a][b]
                                                    if((c.type==2||c.type==25||c.type==29)&&abs(this.position.x-c.position.x)<400&&abs(this.position.y-c.position.y)<80){
                                                        targets.push([c.position.x,c.position.y-c.height/2])
                                                    }
                                                }
                                            }
                                            if(targets.length>0){
                                                target=targets[floor(random(targets.length))]
                                                this.target.position.x=target[0]+random(-20,20)*(this.weaponData.name.includes('Punch')?0.2:1)
                                            }else{
                                                this.target.position.x=target[0]+random(-150,150)*(this.weaponData.name.includes('Punch')?0.2:1)
                                            }
                                        }
                                    }else{
                                        for(let a=0,la=entities.players.length;a<la;a++){
                                            if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&entities.players[a].life>0){
                                                targets.push([entities.players[a].position.x,entities.players[a].position.y])
                                            }
                                        }
                                        if(targets.length>0){
                                            let target=targets[floor(random(targets.length))]
                                            this.target.position.y=target[1]
                                            if(this.target.position.y>this.position.y-50){
                                                if(this.target.position.y<this.position.y+50){
                                                    this.target.position.x=target[0]
                                                }else{
                                                    targets=[]
                                                    for(let a=0,la=entities.walls.length;a<la;a++){
                                                        for(let b=0,lb=entities.walls[a].length;b<lb;b++){
                                                            let c=entities.walls[a][b]
                                                            if((c.type==2||c.type==25||c.type==29)&&abs(this.position.x-c.position.x)<400&&abs(this.position.y+240-c.position.y)<80){
                                                                targets.push([c.position.x,c.position.y-c.height/2])
                                                            }
                                                        }
                                                    }
                                                    if(targets.length>0){
                                                        target=targets[floor(random(targets.length))]
                                                        this.target.position.x=target[0]+random(-20,20)*(this.weaponData.name.includes('Punch')?0.2:1)
                                                    }else{
                                                        this.target.position.x=target[0]+random(-150,150)*(this.weaponData.name.includes('Punch')?0.2:1)
                                                    }
                                                }
                                            }else{
                                                targets=[]
                                                for(let a=0,la=entities.walls.length;a<la;a++){
                                                    for(let b=0,lb=entities.walls[a].length;b<lb;b++){
                                                        let c=entities.walls[a][b]
                                                        if((c.type==2||c.type==25||c.type==29)&&abs(this.position.x-c.position.x)<400&&abs(this.position.y-c.position.y)<80){
                                                            targets.push([c.position.x,c.position.y-c.height/2])
                                                        }
                                                    }
                                                }
                                                if(targets.length>0){
                                                    target=targets[floor(random(targets.length))]
                                                    this.target.position.x=target[0]+random(-20,20)*(this.weaponData.name.includes('Punch')?0.2:1)
                                                }else{
                                                    this.target.position.x=target[0]+random(-150,150)*(this.weaponData.name.includes('Punch')?0.2:1)
                                                }
                                            }
                                        }else{
                                            this.target.position.x=game.edge[0]*random(0.2,0.8)
                                            this.target.position.y=game.edge[1]/10
                                        }
                                    }
                                }
                            }
                        }
                    }else if(game.level==16){
                        let targets=[]
                        this.target.position.x=this.position.x
                        this.target.position.y=game.edge[1]*0.1
                        this.manage[1]=false
                        for(let a=0,la=entities.players.length;a<la;a++){
                            if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&abs(this.position.x-entities.players[a].position.x)<500&&abs(this.position.y-entities.players[a].position.y)<abs(this.position.x-entities.players[a].position.x)*0.3+25&&entities.players[a].life>0){
                                targets.push([entities.players[a].position.x,entities.players[a].position.y])
                            }else if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&abs(this.position.x-entities.players[a].position.x-game.edge[0])<500&&abs(this.position.y-entities.players[a].position.y)<abs(this.position.x-entities.players[a].position.x-game.edge[0])*0.3+25&&entities.players[a].life>0){
                                targets.push([entities.players[a].position.x-game.edge[0],entities.players[a].position.y])
                            }else if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&abs(this.position.x-entities.players[a].position.x+game.edge[0])<500&&abs(this.position.y-entities.players[a].position.y)<abs(this.position.x-entities.players[a].position.x+game.edge[0])*0.3+25&&entities.players[a].life>0){
                                targets.push([entities.players[a].position.x+game.edge[0],entities.players[a].position.y])
                            }
                        }
                        if(targets.length>0){
                            let target=targets[floor(random(targets.length))]
                            this.target.position.x=target[0]+random(-60,60)
                            this.target.position.y=target[1]
                            this.manage[1]=true
                        }else{
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&abs(this.position.x-entities.players[a].position.x)<1000&&abs(this.position.y-entities.players[a].position.y)<abs(this.position.x-entities.players[a].position.x)*0.4+25&&entities.players[a].life>0){
                                    targets.push([entities.players[a].position.x,entities.players[a].position.y])
                                }else if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&abs(this.position.x-entities.players[a].position.x-game.edge[0])<1000&&abs(this.position.y-entities.players[a].position.y)<abs(this.position.x-entities.players[a].position.x-game.edge[0])*0.4+25&&entities.players[a].life>0){
                                    targets.push([entities.players[a].position.x-game.edge[0],entities.players[a].position.y])
                                }else if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&abs(this.position.x-entities.players[a].position.x+game.edge[0])<1000&&abs(this.position.y-entities.players[a].position.y)<abs(this.position.x-entities.players[a].position.x+game.edge[0])*0.4+25&&entities.players[a].life>0){
                                    targets.push([entities.players[a].position.x+game.edge[0],entities.players[a].position.y])
                                }
                            }
                            if(targets.length>0){
                                let target=targets[floor(random(targets.length))]
                                this.target.position.x=target[0]+random(-60,60)
                                this.target.position.y=target[1]
                                this.manage[1]=true
                            }else{
                                for(let a=0,la=entities.players.length;a<la;a++){
                                    if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&abs(this.position.x-entities.players[a].position.x)>=1000&&entities.players[a].life>0){
                                        targets.push([entities.players[a].position.x,entities.players[a].position.y])
                                    }else if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&abs(this.position.x-entities.players[a].position.x-game.edge[0])>=1000&&entities.players[a].life>0){
                                        targets.push([entities.players[a].position.x-game.edge[0],entities.players[a].position.y])
                                    }else if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&abs(this.position.x-entities.players[a].position.x+game.edge[0])>=1000&&entities.players[a].life>0){
                                        targets.push([entities.players[a].position.x+game.edge[0],entities.players[a].position.y])
                                    }
                                }
                                if(targets.length>0){
                                    let target=targets[floor(random(targets.length))]
                                    this.target.position.x=target[0]+random(-60,60)
                                    this.target.position.y=target[1]
                                    this.manage[1]=true
                                }else{
                                    for(let a=0,la=entities.players.length;a<la;a++){
                                        if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)<1200&&entities.players[a].life>0){
                                            targets.push([entities.players[a].position.x,entities.players[a].position.y])
                                        }else if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&dist(this.position.x,this.position.y,entities.players[a].position.x-game.edge[0],entities.players[a].position.y)<1200&&entities.players[a].life>0){
                                            targets.push([entities.players[a].position.x-game.edge[0],entities.players[a].position.y])
                                        }else if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&dist(this.position.x,this.position.y,entities.players[a].position.x+game.edge[0],entities.players[a].position.y)<1200&&entities.players[a].life>0){
                                            targets.push([entities.players[a].position.x+game.edge[0],entities.players[a].position.y])
                                        }
                                    }
                                    if(targets.length>0){
                                        let target=targets[floor(random(targets.length))]
                                        this.target.position.y=target[1]
                                        if(this.target.position.y>this.position.y-50){
                                            if(this.target.position.y<this.position.y+50){
                                                this.target.position.x=target[0]
                                            }else{
                                                targets=[]
                                                for(let a=0,la=entities.walls.length;a<la;a++){
                                                    for(let b=0,lb=entities.walls[a].length;b<lb;b++){
                                                        let c=entities.walls[a][b]
                                                        if((c.type==2||c.type==25||c.type==29)&&abs(this.position.x-c.position.x)<400&&abs(this.position.y+240-c.position.y)<80){
                                                            targets.push([c.position.x,c.position.y-c.height/2])
                                                        }
                                                    }
                                                }
                                                if(targets.length>0){
                                                    target=targets[floor(random(targets.length))]
                                                    this.target.position.x=target[0]+random(-20,20)*(this.weaponData.name.includes('Punch')?0.2:1)
                                                }else{
                                                    this.target.position.x=target[0]+random(-150,150)*(this.weaponData.name.includes('Punch')?0.2:1)
                                                }
                                            }
                                        }else{
                                            targets=[]
                                            for(let a=0,la=entities.walls.length;a<la;a++){
                                                for(let b=0,lb=entities.walls[a].length;b<lb;b++){
                                                    let c=entities.walls[a][b]
                                                    if((c.type==2||c.type==25||c.type==29)&&abs(this.position.x-c.position.x)<400&&abs(this.position.y-c.position.y)<80){
                                                        targets.push([c.position.x,c.position.y-c.height/2])
                                                    }
                                                }
                                            }
                                            if(targets.length>0){
                                                target=targets[floor(random(targets.length))]
                                                this.target.position.x=target[0]+random(-20,20)*(this.weaponData.name.includes('Punch')?0.2:1)
                                            }else{
                                                this.target.position.x=target[0]+random(-150,150)*(this.weaponData.name.includes('Punch')?0.2:1)
                                            }
                                        }
                                    }else{
                                        for(let a=0,la=entities.players.length;a<la;a++){
                                            if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&entities.players[a].life>0){
                                                targets.push([entities.players[a].position.x,entities.players[a].position.y])
                                            }else if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&entities.players[a].life>0){
                                                targets.push([entities.players[a].position.x-game.edge[0],entities.players[a].position.y])
                                            }else if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&entities.players[a].life>0){
                                                targets.push([entities.players[a].position.x+game.edge[0],entities.players[a].position.y])
                                            }
                                        }
                                        if(targets.length>0){
                                            let target=targets[floor(random(targets.length))]
                                            this.target.position.y=target[1]
                                            if(this.target.position.y>this.position.y-50){
                                                if(this.target.position.y<this.position.y+50){
                                                    this.target.position.x=target[0]
                                                }else{
                                                    targets=[]
                                                    for(let a=0,la=entities.walls.length;a<la;a++){
                                                        for(let b=0,lb=entities.walls[a].length;b<lb;b++){
                                                            let c=entities.walls[a][b]
                                                            if((c.type==2||c.type==25||c.type==29)&&abs(this.position.x-c.position.x)<400&&abs(this.position.y+240-c.position.y)<80){
                                                                targets.push([c.position.x,c.position.y-c.height/2])
                                                            }
                                                        }
                                                    }
                                                    if(targets.length>0){
                                                        target=targets[floor(random(targets.length))]
                                                        this.target.position.x=target[0]+random(-20,20)*(this.weaponData.name.includes('Punch')?0.2:1)
                                                    }else{
                                                        this.target.position.x=target[0]+random(-150,150)*(this.weaponData.name.includes('Punch')?0.2:1)
                                                    }
                                                }
                                            }else{
                                                targets=[]
                                                for(let a=0,la=entities.walls.length;a<la;a++){
                                                    for(let b=0,lb=entities.walls[a].length;b<lb;b++){
                                                        let c=entities.walls[a][b]
                                                        if((c.type==2||c.type==25||c.type==29)&&abs(this.position.x-c.position.x)<400&&abs(this.position.y-c.position.y)<80){
                                                            targets.push([c.position.x,c.position.y-c.height/2])
                                                        }
                                                    }
                                                }
                                                if(targets.length>0){
                                                    target=targets[floor(random(targets.length))]
                                                    this.target.position.x=target[0]+random(-20,20)*(this.weaponData.name.includes('Punch')?0.2:1)
                                                }else{
                                                    this.target.position.x=target[0]+random(-150,150)*(this.weaponData.name.includes('Punch')?0.2:1)
                                                }
                                            }
                                        }else{
                                            this.target.position.x=game.edge[0]*random(0.2,0.8)
                                            this.target.position.y=game.edge[1]/10
                                        }
                                    }
                                }
                            }
                        }
                    }else{
                        let targets=[]
                        switch(game.level){
                            case 1:
                                this.target.position.x=game.edge[0]/2
                                this.target.position.y=game.edge[1]/5
                            break
                            case 5:
                                this.target.position.x=150
                                this.target.position.y=game.edge[1]-320
                            break
                        }
                        for(let a=0,la=entities.players.length;a<la;a++){
                            if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&abs(this.position.x-entities.players[a].position.x)<240&&abs(this.position.y-entities.players[a].position.y)<80&&entities.players[a].life>0){
                                targets.push([entities.players[a].position.x,entities.players[a].position.y])
                            }
                        }
                        if(targets.length>0){
                            let target=targets[floor(random(targets.length))]
                            this.target.position.x=target[0]+random(-60,60)*(this.weaponData.name.includes('Punch')?0.2:1)
                            this.target.position.y=target[1]
                        }else{
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index)))&&dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)<300&&entities.players[a].life>0){
                                    targets.push([entities.players[a].position.x,entities.players[a].position.y])
                                }
                            }
                            if(targets.length>0){
                                let target=targets[floor(random(targets.length))]
                                this.target.position.x=target[0]+random(-120,120)
                                this.target.position.y=target[1]
                            }else{
                                for(let a=0,la=entities.players.length;a<la;a++){
                                    if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index)))&&dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)<1500&&entities.players[a].life>0){
                                        targets.push([entities.players[a].position.x,entities.players[a].position.y])
                                    }
                                }
                                if(targets.length>0){
                                    let target=targets[floor(random(targets.length))]
                                    this.target.position.x=target[0]+random(-120,120)
                                    this.target.position.y=target[1]
                                }else{
                                    for(let a=0,la=entities.players.length;a<la;a++){
                                        if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index)))&&entities.players[a].life>0){
                                            targets.push([entities.players[a].position.x,entities.players[a].position.y])
                                        }
                                    }
                                    if(targets.length>0){
                                        let target=targets[floor(random(targets.length))]
                                        this.target.position.x=target[0]+random(-120,120)
                                        this.target.position.y=target[1]
                                    }
                                }
                            }
                        }
                        this.manage[1]=dist(this.position.x,this.position.y,this.target.position.x,this.target.position.y)<500?1:0
                    }
                    if(this.playerData.name=='ParaPistol'||this.playerData.name=='ParaRocketLauncher'||this.playerData.name=='ParaGrenadier'||this.playerData.name=='PlayerStratofortress'||this.playerData.name=='PlayerParachutist'||this.playerData.name=='PlayerDropship'||this.playerData.name=='PlayerApache'){
                        this.manage[1]=1
                    }
                }
                if(this.disable){
                    this.manage[1]=false
                    for(let a=0,la=entities.players.length;a<la;a++){
                        if((this.id==0&&entities.players[a].id!=0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||this.id!=0&&entities.players[a].id==0&&(entities.players[a].playerData.name!='PlayerSpy'&&entities.players[a].fade>0&&!(this.playerData.name=='Buster'&&entities.players[a].index!=this.target.index))||game.pvp&&this.id!=entities.players[a].id)&&abs(this.position.x-entities.players[a].position.x)<400&&entities.players[a].position.x>this.position.x-50&&abs(this.position.y-entities.players[a].position.y)<abs(this.position.x-entities.players[a].position.x)/10+25&&entities.players[a].life>0){
                            this.manage[1]=true
                            this.direction.goal=entities.players[a].position.x>this.position.x?54:-54
                            a=la
                        }
                    }
                    this.attacking=this.manage[1]
                    if(this.manage[1]==1&&this.life>0&&this.weapon.cooldown<=0&&this.weapon.ammo>0&&this.life>0&&!this.weapon.reloading){
                        this.attack(0)
                    }
                }else{
                    this.manage[0]=this.position.x>this.target.position.x?0:1
                    let jumpMult=(game.level==1||game.level==6?0.5:game.level==15||game.level==18?2:1)*(this.id>0?0.8:1)
                    if(this.playerData.name=='PistolJump'||this.playerData.name=='FastPunchJump'||this.playerData.name=='BigRocketLauncherJump'||this.playerData.name=='BigCritPistolJump'||this.playerData.name=='ShotgunJump'||this.playerData.name=='LongPunchJump'||this.playerData.name=='ParaPistol'||this.playerData.name=='ParaRocketLauncher'||this.playerData.name=='BigFastPunchJump'||this.playerData.name=='PistolHealSelfJump'||this.playerData.name=='PistolJumpDamaged'||this.playerData.name=='BigPistolJump'||this.playerData.name=='PlayerParaRocketLauncher'||this.playerData.name=='PlayerParaGrenadier'||this.playerData.name=='PlayerStratofortress'||this.playerData.name=='PlayerParachutist'||this.playerData.name=='PlayerDropship'||this.playerData.name=='PlayerApache'){
                        if(this.manage[2]==0&&(floor(random(0,120*jumpMult))==0||floor(random(0,30*jumpMult))==0&&this.position.y>this.target.position.y)){
                            this.manage[2]=1
                        }else if(this.manage[2]==1&&(floor(random(0,30))==0||floor(random(0,15))==0&&this.position.y<this.target.position.y)){
                            this.manage[2]=0
                        }
                    }else if(this.id==0){
                        if(this.manage[2]==0&&(floor(random(0,240*jumpMult))==0||floor(random(0,60*jumpMult))==0&&this.position.y>this.target.position.y)){
                            this.manage[2]=1
                        }else if(this.manage[2]==1&&(floor(random(0,30))==0||floor(random(0,15))==0&&this.position.y<this.target.position.y)){
                            this.manage[2]=0
                        }
                    }else{
                        if(this.manage[2]==0&&(floor(random(0,60*jumpMult))==0||floor(random(0,30*jumpMult))==0&&this.position.y>this.target.position.y)){
                            this.manage[2]=1
                        }else if(this.manage[2]==1&&(floor(random(0,120))==0||floor(random(0,15))==0&&this.position.y<this.target.position.y)){
                            this.manage[2]=0
                        }
                    }
                    if(this.manage[0]==0&&this.life>0&&this.stunTime<=0&&this.stuckTime<=0&&!(game.attacker&&!this.free&&this.position.x<this.base.position.x-150)){
                        this.direction.goal=-54
                        this.velocity.x-=(this.weaponType==-1?1.6:this.weaponData.speed)*(game.level==6&&this.playerData.speedBuff<1?this.playerData.speedBuff*0.75+0.25:this.playerData.speedBuff)*(this.id>0&&game.randomizer?2:1)
                        this.runAnim(1/30)
                    }else if(this.manage[0]==1&&this.life>0&&this.stunTime<=0&&this.stuckTime<=0&&!(game.attacker&&!this.free&&this.position.x>this.base.position.x+150)){
                        this.direction.goal=54
                        this.velocity.x+=(this.weaponType==-1?1.6:this.weaponData.speed)*(game.level==6&&this.playerData.speedBuff<1?this.playerData.speedBuff*0.75+0.25:this.playerData.speedBuff)*(this.id>0&&game.randomizer?2:1)
                        this.runAnim(1/30)
                    }else if(this.animSet.loop<1&&this.animSet.loop>0){
                        this.runAnim(1/30)
                    }else if(this.animSet.loop>=1){
                        this.animSet.loop=0
                    }
                    if(this.manage[2]==1&&this.life>0&&(this.jump.time>0||this.jump.active>0)&&this.stuckTime<=0&&!(game.attacker&&!this.free&&this.position.y<this.base.position.y+50)){
                        if(this.jump.time>0){
                            this.jump.time=0
                            this.jump.active=10
                        }
                        if(this.bounceTime>0){
                            let bounceMult=game.level==1?3:1.5
                            if(this.playerData.name=='PistolJump'||this.playerData.name=='FastPunchJump'||this.playerData.name=='BigRocketLauncherJump'||this.playerData.name=='BigCritPistolJump'||this.playerData.name=='ShotgunJump'||this.playerData.name=='LongPunchJump'||this.playerData.name=='ParaPistol'||this.playerData.name=='ParaRocketLauncher'||this.playerData.name=='BigFastPunchJump'||this.playerData.name=='PistolHealSelfJump'||this.playerData.name=='PistolJumpDamaged'||this.playerData.name=='BigPistolJump'||this.playerData.name=='PlayerParaRocketLauncher'||this.playerData.name=='PlayerParaGrenadier'||this.playerData.name=='PlayerStratofortress'||this.playerData.name=='PlayerParachutist'||this.playerData.name=='PlayerDropship'||this.playerData.name=='PlayerApache'){
                                this.velocity.y=min(-21*bounceMult,this.velocity.y-2.25*bounceMult)
                            }else{
                                this.velocity.y=min(-14*bounceMult,this.velocity.y-1.5*bounceMult)
                            }
                        }else{
                            if(this.playerData.name=='PistolJump'||this.playerData.name=='FastPunchJump'||this.playerData.name=='BigRocketLauncherJump'||this.playerData.name=='BigCritPistolJump'||this.playerData.name=='ShotgunJump'||this.playerData.name=='LongPunchJump'||this.playerData.name=='ParaPistol'||this.playerData.name=='ParaRocketLauncher'||this.playerData.name=='BigFastPunchJump'||this.playerData.name=='PistolHealSelfJump'||this.playerData.name=='PistolJumpDamaged'||this.playerData.name=='BigPistolJump'||this.playerData.name=='PlayerParaRocketLauncher'||this.playerData.name=='PlayerParaGrenadier'||this.playerData.name=='PlayerStratofortress'||this.playerData.name=='PlayerParachutist'||this.playerData.name=='PlayerDropship'||this.playerData.name=='PlayerApache'){
                                this.velocity.y=min(-21,this.velocity.y-2.25)
                            }else{
                                this.velocity.y=min(-14,this.velocity.y-1.5)
                            }
                        }
                    }
                    this.attacking=this.manage[1]
                    if(this.manage[1]==1&&this.life>0&&this.weapon.cooldown<=0&&this.weapon.ammo>0&&this.life>0&&!this.weapon.reloading){
                        this.attack(0)
                    }
                }
            }else if(this.control==0){
                if(this.disable){
                    if(this.weaponType==275&&this.id<=game.gaming){
                        this.disable=false
                        for(let a=0,la=entities.projectiles.length;a<la;a++){
                            if(entities.projectiles[a].type==163&&entities.projectiles[a].index==this.index){
                                if(this.life<=0){
                                    entities.projectiles[a].active=false
                                }
                                this.disable=true
                                a=la
                            }
                        }
                    }else{
                        this.disable=false
                    }
                }else{
                    let inputSet=inputs.keys[game.gaming==1?1:this.id-1]
                    let inputSetB=inputs.tap[game.gaming==1?1:this.id-1]
                    if(this.life>0){
                        this.inputs.push([inputSet[0],inputSet[1],inputSet[2],inputSet[3]])
                    }
                    if(inputSet[0]&&!inputSet[1]&&this.life>0&&this.stunTime<=0&&this.stuckTime<=0){
                        this.direction.goal=-54
                        if(!this.thrown){
                            this.velocity.x-=(this.weaponType==-1?1.6:this.weaponData.speed*this.playerData.speedBuff)*(this.id>0&&game.randomizer?5/3:1)*(this.id!=1&&game.assault?0.45:1)*(this.carryMoney>0&&game.hunt!=-1?max(0.2,1-this.carryMoney*0.1):1)*(game.level==11?0.9:1)
                        }
                        this.runAnim(1/30)
                    }else if(inputSet[1]&&!inputSet[0]&&this.life>0&&this.stunTime<=0&&this.stuckTime<=0){
                        this.direction.goal=54
                        if(!this.thrown){
                            this.velocity.x+=(this.weaponType==-1?1.6:this.weaponData.speed*this.playerData.speedBuff)*(this.id>0&&game.randomizer?5/3:1)*(this.id!=1&&game.assault?0.45:1)*(this.carryMoney>0&&game.hunt!=-1?max(0.2,1-this.carryMoney*0.1):1)*(game.level==11?0.9:1)
                        }
                        this.runAnim(1/30)
                    }else if(this.animSet.loop<1&&this.animSet.loop>0){
                        this.runAnim(1/30)
                    }else if(this.animSet.loop>=1){
                        this.animSet.loop=0
                    }
                    if(inputSet[2]&&this.life>0&&(this.jump.time>0||this.jump.active>0||this.jump.double==1&&inputSetB[2]||this.jump.triple==1&&inputSetB[2]||this.jump.quadruple==1&&inputSetB[2])&&this.stuckTime<=0){
                        if(this.jump.time>0){
                            this.jump.time=0
                            this.jump.active=10
                        }else if(this.jump.quadruple==1&&this.jump.active==0){
                            this.jump.quadruple=0
                            this.jump.active=10
                        }else if(this.jump.triple==1&&this.jump.active==0){
                            this.jump.triple=0
                            this.jump.active=10
                        }else if(this.jump.double==1&&this.jump.active==0){
                            this.jump.double=0
                            this.jump.active=10
                        }
                        if(this.bounceTime>0){
                            let bounceMult=game.level==1?3:1.5
                            if(this.playerData.name=='PistolJump'||this.playerData.name=='FastPunchJump'||this.playerData.name=='BigRocketLauncherJump'||this.playerData.name=='BigCritPistolJump'||this.playerData.name=='ShotgunJump'||this.playerData.name=='LongPunchJump'||this.playerData.name=='ParaPistol'||this.playerData.name=='ParaRocketLauncher'||this.playerData.name=='BigFastPunchJump'||this.playerData.name=='PistolHealSelfJump'||this.playerData.name=='PistolJumpDamaged'||this.playerData.name=='BigPistolJump'||this.playerData.name=='PlayerParaRocketLauncher'||this.playerData.name=='PlayerParaGrenadier'||this.playerData.name=='PlayerStratofortress'||this.playerData.name=='PlayerParachutist'||this.playerData.name=='PlayerDropship'||this.playerData.name=='PlayerApache'){
                                this.velocity.y=min(-21*bounceMult,this.velocity.y-2.25*bounceMult)
                            }else{
                                this.velocity.y=min(-14*bounceMult,this.velocity.y-1.5*bounceMult)
                            }
                        }else{
                            if(this.playerData.name=='PistolJump'||this.playerData.name=='FastPunchJump'||this.playerData.name=='BigRocketLauncherJump'||this.playerData.name=='BigCritPistolJump'||this.playerData.name=='ShotgunJump'||this.playerData.name=='LongPunchJump'||this.playerData.name=='ParaPistol'||this.playerData.name=='ParaRocketLauncher'||this.playerData.name=='BigFastPunchJump'||this.playerData.name=='PistolHealSelfJump'||this.playerData.name=='PistolJumpDamaged'||this.playerData.name=='BigPistolJump'||this.playerData.name=='PlayerParaRocketLauncher'||this.playerData.name=='PlayerParaGrenadier'||this.playerData.name=='PlayerStratofortress'||this.playerData.name=='PlayerParachutist'||this.playerData.name=='PlayerDropship'||this.playerData.name=='PlayerApache'){
                                this.velocity.y=min(-21,this.velocity.y-2.25)
                            }else{
                                this.velocity.y=min(-14,this.velocity.y-1.5)
                            }
                        }
                    }
                    this.attacking=inputSet[3]
                    if((this.playerData.name=='PlayerPistol'||this.playerData.name=='PlayerPushPistol'||this.playerData.name=='PlayerPistolVulnerable'||this.playerData.name=='PlayerPistolConfuse'||this.playerData.name=='PlayerPistolOfficer'||this.playerData.name=='PlayerPistolQuadrupleJump'||this.playerData.name=='PlayerPistolception'||this.playerData.name=='PlayerRocketMasher'||this.playerData.name=='PlayerCursor')&&this.weapon.uses>0&&inputSetB[3]){
                        this.weapon.cooldown=0
                    }
                    if(inputSet[3]&&this.life>0&&this.playerData.name!='PlayerSplitter'){
                        if(this.playerData.name=='PlayerConglomeration'){
                            if(this.subWeaponA.cooldown<=0&&this.subWeaponA.ammo>0&&this.subWeaponAType>=0){
                                this.attack(1)
                            }
                            if(this.subWeaponB.cooldown<=0&&this.subWeaponB.ammo>0&&this.subWeaponBType>=0){
                                this.attack(2)
                            }
                        }else if(this.weapon.cooldown<=0&&this.weapon.ammo>0&&this.weaponType>=0){
                            this.attack(0)
                        }
                    }
                }
            }else{
                if(this.selector>=this.inputs.length){
                    this.control=0
                }else{
                    if(this.inputs[this.selector][0]&&!this.inputs[this.selector][1]&&this.life>0&&this.stunTime<=0&&this.stuckTime<=0){
                        this.direction.goal=-54
                        this.velocity.x-=(this.weaponType==-1?1.6:this.weaponData.speed)*this.playerData.speedBuff*(this.id>0&&game.randomizer?2:1)
                        this.runAnim(1/30)
                    }else if(this.inputs[this.selector][1]&&!this.inputs[this.selector][0]&&this.life>0&&this.stunTime<=0&&this.stuckTime<=0){
                        this.direction.goal=54
                        this.velocity.x+=(this.weaponType==-1?1.6:this.weaponData.speed)*this.playerData.speedBuff*(this.id>0&&game.randomizer?2:1)
                        this.runAnim(1/30)
                    }else if(this.animSet.loop<1&&this.animSet.loop>0){
                        this.runAnim(1/30)
                    }else if(this.animSet.loop>=1){
                        this.animSet.loop=0
                    }
                    if(this.inputs[this.selector][2]&&this.life>0&&(this.jump.time>0||this.jump.active>0)&&this.stuckTime<=0){
                        if(this.jump.time>0){
                            this.jump.time=0
                            this.jump.active=10
                        }
                        if(this.playerData.name=='PistolJump'||this.playerData.name=='FastPunchJump'||this.playerData.name=='BigRocketLauncherJump'||this.playerData.name=='BigCritPistolJump'||this.playerData.name=='ShotgunJump'||this.playerData.name=='LongPunchJump'||this.playerData.name=='ParaPistol'||this.playerData.name=='ParaRocketLauncher'||this.playerData.name=='BigFastPunchJump'||this.playerData.name=='PistolHealSelfJump'||this.playerData.name=='PistolJumpDamaged'||this.playerData.name=='BigPistolJump'||this.playerData.name=='PlayerParaRocketLauncher'||this.playerData.name=='PlayerParaGrenadier'||this.playerData.name=='PlayerStratofortress'||this.playerData.name=='PlayerParachutist'||this.playerData.name=='PlayerDropship'||this.playerData.name=='PlayerApache'){
                            this.velocity.y=min(-21,this.velocity.y-2.25)
                        }else{
                            this.velocity.y=min(-14,this.velocity.y-1.5)
                        }
                    }
                    this.attacking=this.inputs[this.selector][3]
                    if(this.inputs[this.selector][3]&&this.life>0&&this.weapon.cooldown<=0&&this.weapon.ammo>0&&this.life>0&&this.weaponType>=0){
                        this.attack(0)
                    }
                    this.selector++
                }
            }
            if(this.weaponType>=0){
                if(this.weapon.ammo==0){
                    this.weapon.reloading=true
                }
                if(this.weapon.cooldown>0){
                    this.weapon.cooldown-=this.playerData.reloadBuff*(this.confuseTime>0||this.dizzyTime>0?1/3:1)*(!game.peakWeapon&&(this.playerData.name.includes('Deployer'))?2:1)
                }
                if(this.weapon.reload>0){
                    this.weapon.reload-=this.playerData.reloadBuff*(this.confuseTime>0||this.dizzyTime>0?1/3:1)*(!game.peakWeapon&&(this.playerData.name.includes('Deployer'))?2:1)
                }else if(this.weapon.ammo<this.weaponData.ammo&&(this.weapon.ammo<this.weapon.uses||game.randomizer||this.id==0||this.id>=game.gaming+1)){
                    this.weapon.ammo++
                    this.weapon.reload=this.weaponData.reload
                    if(this.weapon.ammo==this.weaponData.ammo||this.weapon.ammo==this.weapon.uses){
                        this.weapon.reloading=false
                    }
                }
                if(this.playerData.name=='PlayerConglomeration'){
                    if(this.subWeaponA.ammo==0){
                        this.subWeaponA.reloading=true
                    }
                    if(this.subWeaponA.cooldown>0){
                        this.subWeaponA.cooldown-=this.subPlayerAData.reloadBuff*(this.confuseTime>0||this.dizzyTime>0?1/3:1)
                    }
                    if(this.subWeaponA.reload>0){
                        this.subWeaponA.reload-=this.subPlayerAData.reloadBuff*(this.confuseTime>0||this.dizzyTime>0?1/3:1)
                    }else if(this.subWeaponA.ammo<this.subWeaponAData.ammo&&(this.subWeaponA.ammo<this.subWeaponA.uses||game.randomizer||this.id==0||this.id>=game.gaming+1)){
                        this.subWeaponA.ammo++
                        this.subWeaponA.reload=this.subWeaponAData.reload
                        if(this.subWeaponA.ammo==this.subWeaponAData.ammo||this.subWeaponA.ammo==this.subWeaponA.uses){
                            this.subWeaponA.reloading=false
                        }
                    }
                    if(this.subWeaponB.ammo==0){
                        this.subWeaponB.reloading=true
                    }
                    if(this.subWeaponB.cooldown>0){
                        this.subWeaponB.cooldown-=this.subPlayerBData.reloadBuff*(this.confuseTime>0||this.dizzyTime>0?1/3:1)
                    }
                    if(this.subWeaponB.reload>0){
                        this.subWeaponB.reload-=this.subPlayerBData.reloadBuff*(this.confuseTime>0||this.dizzyTime>0?1/3:1)
                    }else if(this.subWeaponB.ammo<this.subWeaponBData.ammo&&(this.subWeaponB.ammo<this.subWeaponB.uses||game.randomizer||this.id==0||this.id>=game.gaming+1)){
                        this.subWeaponB.ammo++
                        this.subWeaponB.reload=this.subWeaponBData.reload
                        if(this.subWeaponB.ammo==this.subWeaponBData.ammo||this.subWeaponB.ammo==this.subWeaponB.uses){
                            this.subWeaponB.reloading=false
                        }
                    }
                }
            }else{
                if(!this.construct&&!this.sidekick&&game.level!=13&&game.level!=14&&(
                    (
                        dist(this.position.x,this.position.y,game.edge[0]/2,game.edge[1]/3)<50&&(game.level==0||game.level==1||game.level==2)||
                        dist(this.position.x,this.position.y,game.edge[0]/2-100,game.edge[1]/3-120)<50&&game.level==3||
                        dist(this.position.x,this.position.y,game.edge[0]/2,game.edge[1]/3-40)<50&&game.level==4||
                        dist(this.position.x,this.position.y,150,game.edge[1]-320)<50&&game.level==5||
                        dist(this.position.x,this.position.y,game.edge[0]/2+1300,graphics.main[0].height-120)<80&&game.level==6||
                        dist(this.position.x,this.position.y,game.edge[0]/2,game.edge[1]/2+360)<80&&game.level==7||
                        dist(this.position.x,this.position.y,game.edge[0]-150,game.edge[1]-520)<80&&game.level==8||
                        dist(this.position.x,this.position.y,game.edge[0]-100,800)<80&&game.level==15||
                        dist(this.position.x,this.position.y,150,game.edge[1]-120)<80&&game.level==17||
                        dist(this.position.x,this.position.y,100,game.edge[1]-220)<80&&game.level==18
                    )&&this.id>0&&this.id<=game.gaming&&!game.attacker||
                    this.id>=game.gaming+1||game.attacker&&this.id!=0
                )){
                    this.newWeapon()
                }
            }
            if(this.record.life<this.life){
                this.record.life=this.life
            }else if(this.record.life>max(0,this.life)){
                for(let a=0,la=entities.players.length;a<la;a++){
                    if(entities.players[a].index==this.die.killer){
                        entities.players[a].stats.damage+=round(this.record.life-max(0,this.life))
                        entities.players[a].stats.bust+=round(this.record.life-max(0,this.life))
                        if(entities.players[a].stats.bust>=5000&&game.bust){
                            entities.players[a].stats.bust=0
                            if(game.level==7){
                                let key='ABCDEF'[floor(random(0,6))]
                                for(let a=0,la=levels[7].length;a<la;a++){
                                    for(let b=0,lb=levels[7][a].length;b<lb;b++){
                                        if(levels[7][a][b]==key){
                                            entities.players.push(new player(this.layer,game.tileset[0]*(b+0.5),game.tileset[1]*(a+0.5),0,0,[],true,findName('Buster',types.player),game.index))
                                        }
                                    }
                                }
                            }else{
                                entities.players.push(new player(this.layer,entities.players[a].position.x,-50,0,0,[],true,findName('Buster',types.player),game.index))
                            }
                            entities.players[entities.players.length-1].parachute=true
                            entities.players[entities.players.length-1].target.index=entities.players[a].index
                        }
                        a=la
                    }
                }
                this.record.life=max(0,this.life)
            }
            if(this.jump.time>0){
                this.jump.time--
            }
            if(this.jump.active>0){
                this.jump.active--
            }
            if(this.collect.time>0&&(this.playerData.name!='PlayerImmortal'||this.weaponData.uses<=0)){
                this.collect.time--
                if(this.weaponType==11||this.weaponType==13||this.weaponType==14||this.weaponType==62||this.weaponType==66||this.weaponType==83||this.weaponType==100||this.weaponType==127||this.weaponType==250){
                    this.collect.time-=3
                }
            }else if(this.life>0&&this.id>0&&this.size<2.25*0.5&&!game.pvp){
                this.life=min(max(this.life,this.base.life),this.life+this.base.life/(this.playerData.name=='PlayerImmortal'&&this.weaponData.uses>0?60:(this.weaponType==11||this.weaponType==13||this.weaponType==14||this.weaponType==62||this.weaponType==66||this.weaponType==83||this.weaponType==100||this.weaponType==127)&&this.weaponData.uses>0?150:300))
            }
            if(this.firearc[1]>0){
                this.firearc[1]--
            }
            if(!this.disable){
                if(this.position.x<0){
                    if(game.level==3||game.level==7||game.level==16){
                        this.position.x=game.edge[0]
                        this.previous.position.x=game.edge[0]
                    }else{
                        this.position.x=0
                        this.velocity.x=0
                    }
                }
                if(this.position.x>game.edge[0]){
                    if(game.level==3||game.level==7||game.level==16){
                        this.position.x=0
                        this.previous.position.x=0
                    }else{
                        this.position.x=game.edge[0]
                        this.velocity.x=0
                    }
                }
                if(this.position.y<0){
                    if(game.level==3||game.level==7){
                        this.position.y=game.edge[1]
                        this.previous.position.y=game.edge[1]
                    }else{
                        this.position.y=0
                        this.velocity.y=0
                    }
                }
                if(this.position.y>game.edge[1]){
                    if(game.level==3||game.level==7){
                        this.position.y=0
                        this.previous.position.y=0
                    }else if(true){
                        this.position.y=0
                        this.previous.position.y=0
                        this.velocity.y=0
                    }else{
                        this.life=0
                        this.die.killer=-1
                    }
                }
            }
            if(this.dead&&this.life>0){
                this.life=0
            }
            if(this.life<=0){
                this.life=0
                if(!this.dead){
                    this.dead=true
                    for(let a=0,la=entities.players.length;a<la;a++){
                        if(entities.players[a].index==this.die.killer){
                            entities.players[a].stats.kills=round(entities.players[a].stats.kills*10+(game.pvp&&this.id==0?(this.size>2.25*0.5?5:this.size>1.25*0.5?1:0.2):(this.size>2.25*0.5?25:this.size>1.25*0.5?5:1))*10)/10
                        }
                        if(entities.players[a].life>0&&entities.players[a].playerData.name=='PlayerKinoko'&&dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)<750){
                            entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,137,(lsin(this.direction.main)<0?-90:90),entities.players[a].id,120,1200,false,entities.players[a].index))
                        }
                    }
                    this.stats.deaths++
                }else if(this.id>0){
                    this.die.timer++
                    if(this.die.timer>180&&(game.classicRespawn&&!game.past||game.hunt!=this.id&&game.hunt>0)){
                        this.respawn()
                    }
                    if(this.die.timer>180&&game.lives>0&&!game.past&&this.attacking&&!(game.hunt!=this.id&&game.hunt>0)&&game.hunt!=-1){
                        this.respawn()
                        game.lives--
                    }
                    if(this.die.timer>180&&game.lives>0&&!game.past&&game.hunt==-1&&this.carryMoney>=10){
                        this.respawn()
                        this.carryMoney-=10
                    }
                    if(this.die.timer>=90&&(!game.classicRespawn&&!game.past&&!game.pvp||game.level==11)){
                        for(let a=0,la=entities.players.length;a<la;a++){
                            if(inBoxBox(this,entities.players[a])&&this.id!=entities.players[a].id&&!entities.players[a].dead&&this.id>0&&entities.players[a].id>0){
                                this.life=this.id>=game.gaming+1?this.base.life:this.base.life*0.2
                                this.dead=false
                            }
                        }
                    }
                }
            }
            if(this.life>0){
                let crit=constrain(this.playerData.crit+(this.critBuff>0?1:0),0,1)
                switch(this.playerData.name){
                    case 'RocketLauncherHeal': case 'BigRocketLauncherHeal': case 'FastPunchHeal':
                        for(let a=0,la=entities.players.length;a<la;a++){
                            if(dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)<240&&this.position.x!=entities.players[a].position.x&&!entities.players[a].dead&&!this.dead&&this.id==entities.players[a].id){
                                entities.players[a].life=min(entities.players[a].base.life,entities.players[a].life+entities.players[a].base.life/600)
                            }
                        }
                    break
                    case 'RocketLauncherBuff': case 'BigRocketLauncherBuff': case 'BigCritRocketLauncherBuff': case 'BigSpamRocketLauncherBuff': case 'RocketLauncherHealSelfBuff': case 'DamageOverTimeMachineGunBuff':
                        for(let a=0,la=entities.players.length;a<la;a++){
                            if(dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)<240&&this.position.x!=entities.players[a].position.x&&!entities.players[a].dead&&!this.dead&&this.id==entities.players[a].id){
                                entities.players[a].critBuff=max(entities.players[a].critBuff,15)
                            }
                        }
                    break
                    case 'RocketLauncherDefendBuff':  case 'BigCritRocketLauncherDefendBuff': case 'BigRocketLauncherDefendBuff': case 'RocketLauncherHealSelfDefendBuff': case 'HeavyPunchDefendBuff': case 'EngineerDefendBuff': case 'DamageOverTimeMachineGunDefendBuff':
                        for(let a=0,la=entities.players.length;a<la;a++){
                            if(dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)<240&&this.position.x!=entities.players[a].position.x&&!entities.players[a].dead&&!this.dead&&this.id==entities.players[a].id){
                                entities.players[a].defendBuff=max(entities.players[a].defendBuff,15)
                            }
                        }
                    break
                    case 'MedicShield': case 'HyperMedicShield': case 'CritApplyMedicShield': case 'EngineerShield': case 'BigMedicShield': case 'BigFastRapidMedicShield':
                        for(let a=0,la=entities.projectiles.length;a<la;a++){
                            if(((entities.projectiles[a].id==0?1:0)!=(this.id==0?1:0)||game.pvp)&&inBoxBox({position:{x:this.position.x+(lsin(this.direction.main)<0?-80:80),y:this.position.y+this.offset.position.y-10},width:15,height:100},entities.projectiles[a])&&entities.projectiles[a].active&&entities.projectiles[a].type!=89&&entities.projectiles[a].type!=103){
                                entities.projectiles[a].active=false
                                if(entities.projectiles[a].exploder){
                                    entities.projectiles[a].explode()
                                }
                            }
                        }
                    break
                    case 'EngineerSpawner': case 'TankSpawner':
                        if(this.time%600==0){
                            entities.players.push(new player(this.layer,this.position.x,this.position.y,0,0,[],true,findName(['Pistol','Shotgun','RocketLauncher','Flamethrower','MachineGun','Baller','Punch','Medic'][floor(random(0,8))],types.player),game.index))
                            game.index++
                            entities.players[entities.players.length-1].free=true
                        }
                    break
                    case 'RocketLauncherDefendBuffWide':
                        for(let a=0,la=entities.players.length;a<la;a++){
                            if(dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)<480&&this.position.x!=entities.players[a].position.x&&!entities.players[a].dead&&!this.dead&&this.id==entities.players[a].id){
                                entities.players[a].defendBuff=max(entities.players[a].defendBuff,15)
                            }
                        }
                    break
                    case 'PunchRegen':
                        this.life=min(this.base.life,this.life+this.base.life/600)
                    break
                    case 'BigMedicAura':
                        for(let a=0,la=entities.players.length;a<la;a++){
                            if(dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)<360&&this.position.x!=entities.players[a].position.x&&!entities.players[a].dead&&!this.dead&&(this.id==0?1:0)==(entities.players[a].id==0?1:0)){
                                entities.players[a].life=min(max(entities.players[a].base.life,entities.players[a].life),entities.players[a].life+entities.players[a].base.life/1200)
                            }
                        }
                    break
                    case 'PlayerMedicAura':
                        for(let a=0,la=entities.players.length;a<la;a++){
                            if(dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)<360&&this.position.x!=entities.players[a].position.x&&!entities.players[a].dead&&!this.dead&&(this.id==0?1:0)==(entities.players[a].id==0?1:0)){
                                entities.players[a].life=min(max(entities.players[a].base.life,entities.players[a].life),entities.players[a].life+entities.players[a].base.life/300)
                            }
                        }
                    break
                    case 'PlayerPistolOfficer':
                        for(let a=0,la=entities.players.length;a<la;a++){
                            if(dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)<150&&this.position.x!=entities.players[a].position.x&&!entities.players[a].dead&&!this.dead&&(this.id==0?1:0)==(entities.players[a].id==0?1:0)){
                                entities.players[a].critBuff=max(entities.players[a].critBuff,15)
                            }
                        }
                    break
                    case 'PlayerAutoMachineGun':
                        if(this.time%20==0){
                            let minimum=450
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if((entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0)&&entities.players[a].life>0&&dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)<450){
                                    minimum=min(minimum,dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y))
                                }
                            }
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if((entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0)&&entities.players[a].life>0&&dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)==minimum){
                                    entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),this.id,this.weaponData.damage*this.playerData.damageBuff*2,300,crit,this.index))
                                    a=la
                                }
                            }
                        }
                    break
                    case 'PlayerInspector':
                        for(let a=0,la=entities.players.length;a<la;a++){
                            if(dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)<600&&this.position.x!=entities.players[a].position.x&&!entities.players[a].dead&&!this.dead&&!this.inspect.includes(entities.players[a].index)&&entities.players[a].index!=this.index){
                                this.inspect.push(entities.players[a].index)
                            }
                        }
                    break
                    case 'PlayerOpticalInspector':
                        for(let a=0,la=entities.players.length;a<la;a++){
                            if(dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)<1200&&this.position.x!=entities.players[a].position.x&&!entities.players[a].dead&&!this.dead&&!this.inspect.includes(entities.players[a].index)&&entities.players[a].index!=this.index){
                                this.inspect.push(entities.players[a].index)
                            }
                        }
                    break
                    case 'PlayerTripleAuto':
                        if(this.time%20==0){
                            let hit=false
                            let minimum=[600,600,600]
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if((entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0)&&entities.players[a].life>0&&dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)<600){
                                    let distance=dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)
                                    if(distance<minimum[0]){
                                        minimum[2]=minimum[1]
                                        minimum[1]=minimum[0]
                                        minimum[0]=distance
                                    }else if(distance<minimum[1]){
                                        minimum[2]=minimum[1]
                                        minimum[1]=distance
                                    }else if(distance<minimum[2]){
                                        minimum[2]=distance
                                    }
                                }
                            }
                            let fired=[false,false,false]
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if((entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0)&&entities.players[a].life>0){
                                    if(!fired[0]&&dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)==minimum[0]){
                                        entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),this.id,this.weaponData.damage*this.playerData.damageBuff,300,crit,this.index))
                                        fired[0]=true
                                        hit=true
                                    }
                                    if(!fired[1]&&dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)==minimum[1]){
                                        entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),this.id,this.weaponData.damage*this.playerData.damageBuff,300,crit,this.index))
                                        fired[1]=true
                                        hit=true
                                    }
                                    if(!fired[2]&&dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)==minimum[2]){
                                        entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),this.id,this.weaponData.damage*this.playerData.damageBuff,300,crit,this.index))
                                        fired[2]=true
                                        hit=true
                                    }
                                }
                            }
                            if(hit){
                                this.weapon.uses--
                                if(this.weapon.uses<=0&&this.id>0&&!game.randomizer){
                                    this.weaponType=-1
                                }
                            }
                        }
                    break
                    case 'PlayerConglomeration':
                        if(this.time%600==0){
                            this.newSubWeaponA()
                            this.newSubWeaponB()
                            this.weapon.uses--
                            if(this.weapon.uses<=0&&this.id>0&&!game.randomizer){
                                this.weaponType=-1
                            }
                        }
                        for(let a=0,la=this.infoAnim.ammoA.length;a<la;a++){
                            this.infoAnim.ammoA[a]=smoothAnim(this.infoAnim.ammoA[a],this.subWeaponA.ammo>a,0,1,5)
                        }
                        for(let a=0,la=this.infoAnim.usesA.length;a<la;a++){
                            this.infoAnim.usesA[a]=smoothAnim(this.infoAnim.usesA[a],this.subWeaponA.uses>a,0,1,5)
                        }
                        for(let a=0,la=this.infoAnim.ammoB.length;a<la;a++){
                            this.infoAnim.ammoB[a]=smoothAnim(this.infoAnim.ammoB[a],this.subWeaponB.ammo>a,0,1,5)
                        }
                        for(let a=0,la=this.infoAnim.usesB.length;a<la;a++){
                            this.infoAnim.usesB[a]=smoothAnim(this.infoAnim.usesB[a],this.subWeaponB.uses>a,0,1,5)
                        }
                    break
                    case 'PlayerGunception': case 'PlayerPistolception': case 'PlayerMachineGunception': case 'PlayerRocketLauncherception': case 'PlayerSniperception':
                    case 'PlayerBallerception': case 'PlayerEngineerception': case 'PlayerMedicception': case 'PlayerSlicerception': case 'PlayerAssaultRifleception':
                    case 'PlayerGrenadierception': case 'PlayerGaslighter': case 'PlayerTrapperception': case 'PlayerDirectorception': case 'PlayerDestroyerception':
                    case 'PlayerMotorizerception': case 'PlayerSunburstception': case 'PlayerStealthception': case 'PlayerIceberg': case 'PlayerGunceptionception':
                    case 'PlayerSoftwareception': case 'PlayerSwarmerception': case 'PlayerDasherception': case 'PlayerEmplacementception':
                        if(
                            this.time%40==0&&(this.playerData.name=='PlayerGunception'||this.playerData.name=='PlayerBallerception'||this.playerData.name=='PlayerTrapperception'||this.playerData.name=='PlayerStealthception'&&this.fade>0||this.playerData.name=='PlayerGaslighter'||this.playerData.name=='PlayerSoftwareception')||
                            this.time%20==0&&(this.playerData.name=='PlayerPistolception'||this.playerData.name=='PlayerGunceptionception'||this.playerData.name=='PlayerDasherception')||
                            this.time%3==0&&this.playerData.name=='PlayerMachineGunception'&&this.time%360<180||
                            this.time%120==0&&this.playerData.name=='PlayerRocketLauncherception'||
                            this.time%100==0&&this.playerData.name=='PlayerSniperception'||
                            this.time%300==0&&this.playerData.name=='PlayerEngineerception'||
                            this.time%15==0&&this.playerData.name=='PlayerMedicception'||
                            this.time%60==0&&(this.playerData.name=='PlayerSlicerception'||this.playerData.name=='PlayerIceberg')||
                            (this.time%50==0||this.time%50==5||this.time%50==10)&&this.playerData.name=='PlayerAssaultRifleception'||
                            this.time%50==0&&this.playerData.name=='PlayerGrenadierception'||
                            this.time%180==0&&this.playerData.name=='PlayerDirectorception'||
                            this.time%240==0&&this.playerData.name=='PlayerDestroyerception'||
                            this.time%300==0&&this.playerData.name=='PlayerMotorizerception'||
                            this.time%12==0&&this.playerData.name=='PlayerSunburstception'||
                            this.time%30==0&&this.playerData.name=='PlayerSwarmerception'||
                            this.time%480==0&&this.playerData.name=='PlayerEmplacementception'
                        ){
                            let minimum=this.playerData.name=='PlayerSniperception'?900:this.playerData.name=='PlayerSunburstception'?600:this.playerData.name=='PlayerSlicerception'?360:450
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if((entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0||this.playerData.name=='PlayerMedicception')&&entities.players[a].life>0&&entities.players[a].id!=this.id){
                                    minimum=min(minimum,dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y))
                                }
                            }
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if((entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0||this.playerData.name=='PlayerMedicception')&&entities.players[a].life>0&&dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)==minimum){
                                    let dir=atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y)
                                    entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,
                                        this.playerData.name=='PlayerRocketLauncherception'?86:
                                        this.playerData.name=='PlayerSniperception'?4:
                                        this.playerData.name=='PlayerBallerception'?106:
                                        this.playerData.name=='PlayerEngineerception'?107:
                                        this.playerData.name=='PlayerMedicception'?9:
                                        this.playerData.name=='PlayerSlicerception'?108:
                                        this.playerData.name=='PlayerGrenadierception'?110:
                                        this.playerData.name=='PlayerGaslighter'?112:
                                        this.playerData.name=='PlayerTrapperception'?116:
                                        this.playerData.name=='PlayerDirectorception'?124:
                                        this.playerData.name=='PlayerDestroyerception'?130:
                                        this.playerData.name=='PlayerMotorizerception'?143:
                                        this.playerData.name=='PlayerSunburstception'?133:
                                        this.playerData.name=='PlayerIceberg'?151:
                                        this.playerData.name=='PlayerSwarmerception'?168:
                                        this.playerData.name=='PlayerEmplacementception'?183:
                                        1,
                                        this.playerData.name=='PlayerBallerception'||this.playerData.name=='PlayerEngineerception'||this.playerData.name=='PlayerGrenadierception'||this.playerData.name=='PlayerTrapperception'||this.playerData.name=='PlayerDirectorception'||this.playerData.name=='PlayerEmplacementception'?(this.position.x>entities.players[a].position.x?-90+(dir+90)*0.2:90+(dir-90)*0.2):
                                        dir+random(-3,3),this.id,this.weaponData.damage*this.playerData.damageBuff,this.playerData.name=='PlayerSlicerception'?50:this.playerData.name=='PlayerDirectorception'?1200:this.playerData.name=='PlayerSwarmerception'?600:300,crit,this.index
                                    ))
                                    this.firearc=[atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),30]
                                    a=la
                                }
                            }
                        }
                    break
                    case 'PlayerShotgunception':
                        if(this.time%45==0){
                            let minimum=450
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if((entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0)&&entities.players[a].life>0){
                                    minimum=min(minimum,dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y))
                                }
                            }
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if((entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0)&&entities.players[a].life>0&&dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)==minimum){
                                    for(let b=0,lb=10;b<lb;b++){
                                        entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y)+random(-20,20),this.id,this.weaponData.damage*this.playerData.damageBuff,15,crit,this.index))
                                    }
                                    this.firearc=[atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),30]
                                    a=la
                                }
                            }
                        }
                    break
                    case 'PlayerFlamethrowerception':
                        if(this.time%5==0&&this.time%360<240){
                            let minimum=300
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if((entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0)&&entities.players[a].life>0){
                                    minimum=min(minimum,dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y))
                                }
                            }
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if((entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0)&&entities.players[a].life>0&&dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)==minimum){
                                    entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,109,atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y)+random(-15,15),this.id,this.weaponData.damage*this.playerData.damageBuff,10,crit,this.index))
                                    this.firearc=[atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),30]
                                    a=la
                                }
                            }
                        }
                    break
                    case 'PlayerRearguard':
                        for(let a=0,la=entities.projectiles.length;a<la;a++){
                            if(((entities.projectiles[a].id==0?1:0)!=(this.id==0?1:0)||game.pvp&&entities.projectiles[a].id!=this.id)&&inBoxBox({position:{x:this.position.x+(lsin(this.direction.main)<0?80:-80),y:this.position.y+this.offset.position.y-10},width:25,height:100},entities.projectiles[a])&&entities.projectiles[a].active&&entities.projectiles[a].type!=89&&entities.projectiles[a].type!=103){
                                entities.projectiles[a].active=false
                                if(entities.projectiles[a].exploder){
                                    entities.projectiles[a].explode()
                                }
                            }
                        }
                    break
                    case 'PlayerMinesweeper': case 'PlayerDegausser':
                        if(this.time%150==0){
                            this.scan=[0,0,0,0,0,0,0,0,0]
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if(entities.players[a].id!=this.id){
                                    let distance=dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)
                                    if(distance>150&&distance<2400){
                                        this.scan[floor(((atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y)+380)%360)/40)]+=20
                                    }
                                }
                            }
                        }else{
                            for(let a=0,la=this.scan.length;a<la;a++){
                                if(this.scan[a]>0){
                                    this.scan[a]--
                                }
                            }
                        }
                    break
                    case 'PlayerRotary':
                        for(let a=0,la=entities.projectiles.length;a<la;a++){
                            if(((entities.projectiles[a].id==0?1:0)!=(this.id==0?1:0)||game.pvp&&entities.projectiles[a].id!=this.id)&&(
                                inBoxBox({position:{x:this.position.x+(lsin(this.direction.main)<0?80:-80),y:this.position.y+this.offset.position.y-10},width:25,height:100},entities.projectiles[a])||
                                inBoxBox({position:{x:this.position.x+(lsin(this.direction.main)<0?-80:80),y:this.position.y+this.offset.position.y-10},width:25,height:100},entities.projectiles[a])
                            )&&entities.projectiles[a].active&&entities.projectiles[a].type!=89&&entities.projectiles[a].type!=103){
                                entities.projectiles[a].active=false
                                if(entities.projectiles[a].exploder){
                                    entities.projectiles[a].explode()
                                }
                            }
                        }
                    break
                    case 'PlayerSplitter': case 'PlayerDivision':
                        if(this.time%600==0){
                            this.newSubWeaponA()
                            this.newSubWeaponB()
                            this.weapon.uses--
                            if(this.weapon.uses<=0&&this.id>0&&!game.randomizer){
                                this.weaponType=-1
                            }
                        }
                    break
                    case 'PlayerDullahan':
                        if(this.time%60==0){
                            let hit=false
                            let minimum=[600,600,600]
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if((entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0)&&entities.players[a].life>0&&dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)<600){
                                    let distance=dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)
                                    if(distance<minimum[0]){
                                        minimum[2]=minimum[1]
                                        minimum[1]=minimum[0]
                                        minimum[0]=distance
                                    }else if(distance<minimum[1]){
                                        minimum[2]=minimum[1]
                                        minimum[1]=distance
                                    }else if(distance<minimum[2]){
                                        minimum[2]=distance
                                    }
                                }
                            }
                            let fired=[false,false,false]
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if((entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0)&&entities.players[a].life>0){
                                    if(!fired[0]&&dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)==minimum[0]){
                                        entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),this.id,this.weaponData.damage*this.playerData.damageBuff/4,300,crit,this.index))
                                        fired[0]=true
                                        hit=true
                                    }
                                    if(!fired[1]&&dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)==minimum[1]){
                                        entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),this.id,this.weaponData.damage*this.playerData.damageBuff/4,300,crit,this.index))
                                        fired[1]=true
                                        hit=true
                                    }
                                    if(!fired[2]&&dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)==minimum[2]){
                                        entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),this.id,this.weaponData.damage*this.playerData.damageBuff/4,300,crit,this.index))
                                        fired[2]=true
                                        hit=true
                                    }
                                }
                            }
                        }else if(this.time%60==30){
                            let minimum=600
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if((entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0)&&entities.players[a].life>0&&dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)<600){
                                    minimum=min(minimum,dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y))
                                }
                            }
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if((entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0)&&entities.players[a].life>0&&dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)==minimum){
                                    let dir=atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y)
                                    for(let b=0,lb=3;b<lb;b++){
                                        entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,dir+b*120,this.id,this.weaponData.damage*this.playerData.damageBuff/4,300,crit,this.index))
                                    }
                                    a=la
                                }
                            }
                        }
                    break
                    case 'ConstructGuard':
                        for(let a=0,la=entities.projectiles.length;a<la;a++){
                            if(((entities.projectiles[a].id==0?1:0)!=(this.id==0?1:0)||game.pvp&&entities.projectiles[a].id!=this.id)&&inBoxBox({position:{x:this.position.x+(lsin(this.direction.main)<0?-80:80),y:this.position.y+this.offset.position.y-10},width:25,height:100},entities.projectiles[a])&&entities.projectiles[a].active&&entities.projectiles[a].type!=89&&entities.projectiles[a].type!=103){
                                entities.projectiles[a].active=false
                                if(entities.projectiles[a].exploder){
                                    entities.projectiles[a].explode()
                                }
                            }
                        }
                    break
                    case 'PlayerHelixception':
                        if(
                            this.time%40==0
                        ){
                            let minimum=450
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if((entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0||this.playerData.name=='PlayerMedicception')&&entities.players[a].life>0&&entities.players[a].id!=this.id){
                                    minimum=min(minimum,dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y))
                                }
                            }
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if((entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0||this.playerData.name=='PlayerMedicception')&&entities.players[a].life>0&&dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)==minimum){
                                    let dir=atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y)
                                    entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,
                                        169,
                                        180-dir,this.id,this.weaponData.damage*this.playerData.damageBuff,300,crit,this.index
                                    ))
                                    entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,
                                        170,
                                        180-dir,this.id,this.weaponData.damage*this.playerData.damageBuff,300,crit,this.index
                                    ))
                                    this.firearc=[atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),30]
                                    a=la
                                }
                            }
                        }
                    break
                    case 'SpawnerBoss':
                        if(this.time%120==0){
                            entities.players.push(new player(this.layer,this.position.x,this.position.y,0,0,[],true,findName(['Pistol','Shotgun','RocketLauncher','Flamethrower','MachineGun','Baller','Punch','Medic'][floor(random(0,8))],types.player),game.index))
                            game.index++
                            entities.players[entities.players.length-1].free=true
                        }
                    break
                    case 'BigRocketLauncherDoubleBuff':
                        for(let a=0,la=entities.players.length;a<la;a++){
                            if(dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)<240&&this.position.x!=entities.players[a].position.x&&!entities.players[a].dead&&!this.dead&&this.id==entities.players[a].id){
                                entities.players[a].critBuff=max(entities.players[a].critBuff,15)
                                entities.players[a].defendBuff=max(entities.players[a].defendBuff,15)
                            }
                        }
                    break
                    case 'PlayerRho':
                        for(let a=0,la=entities.projectiles.length;a<la;a++){
                            if(((entities.projectiles[a].id==0?1:0)!=(this.id==0?1:0)||game.pvp&&entities.projectiles[a].id!=this.id)&&(
                                dist(this.position.x+50*lsin(this.time),this.position.y+this.offset.position.y+50*lcos(this.time)-10,entities.projectiles[a].position.x,entities.projectiles[a].position.y)<12+entities.projectiles[a].width*0.25+entities.projectiles[a].height*0.25||
                                dist(this.position.x-50*lsin(this.time),this.position.y+this.offset.position.y-50*lcos(this.time)-10,entities.projectiles[a].position.x,entities.projectiles[a].position.y)<12+entities.projectiles[a].width*0.25+entities.projectiles[a].height*0.25
                            )&&entities.projectiles[a].active&&entities.projectiles[a].type!=89&&entities.projectiles[a].type!=103){
                                entities.projectiles[a].active=false
                                if(entities.projectiles[a].exploder){
                                    entities.projectiles[a].explode()
                                }
                            }
                        }
                        if(this.time%20==0){
                            let minimum=[450,450]
                            let center=[
                                [this.position.x+50*lcos(this.time),this.position.y-50*lsin(this.time)+this.offset.position.y-10],
                                [this.position.x-50*lcos(this.time),this.position.y+50*lsin(this.time)+this.offset.position.y-10]
                            ]
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if((entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0||this.playerData.name=='PlayerMedicception')&&entities.players[a].life>0&&entities.players[a].id!=this.id){
                                    minimum[0]=min(minimum[0],dist(entities.players[a].position.x,entities.players[a].position.y,center[0][0],center[0][1]))
                                    minimum[1]=min(minimum[1],dist(entities.players[a].position.x,entities.players[a].position.y,center[1][0],center[1][1]))
                                }
                            }
                            let fired=[false,false]
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if(
                                    (entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0||this.playerData.name=='PlayerMedicception')&&entities.players[a].life>0&&
                                    dist(entities.players[a].position.x,entities.players[a].position.y,center[0][0],center[0][1])==minimum[0]&&!fired[0]
                                ){
                                    let dir=atan2(entities.players[a].position.x-center[0][0],this.position.y-center[0][1])
                                    entities.projectiles.push(new projectile(this.layer,center[0][0],center[0][1],1,dir+random(-3,3),this.id,this.weaponData.damage*this.playerData.damageBuff,300,crit,this.index))
                                    fired[0]=true
                                }
                                if(
                                    (entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0||this.playerData.name=='PlayerMedicception')&&entities.players[a].life>0&&
                                    dist(entities.players[a].position.x,entities.players[a].position.y,center[1][0],center[1][1])==minimum[1]&&!fired[1]
                                ){
                                    let dir=atan2(entities.players[a].position.x-center[1][0],this.position.y-center[1][1])
                                    entities.projectiles.push(new projectile(this.layer,center[1][0],center[1][1],1,dir+random(-3,3),this.id,this.weaponData.damage*this.playerData.damageBuff,300,crit,this.index))
                                    fired[1]=true
                                }
                            }
                        }
                    break
                    case 'PlayerSpreadlingception':
                        if(
                            this.time%50==0
                        ){
                            let minimum=450
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if((entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0||this.playerData.name=='PlayerMedicception')&&entities.players[a].life>0&&entities.players[a].id!=this.id){
                                    minimum=min(minimum,dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y))
                                }
                            }
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if((entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0||this.playerData.name=='PlayerMedicception')&&entities.players[a].life>0&&dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)==minimum){
                                    let dir=atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y)
                                    for(let a=0,la=7;a<la;a++){
                                        entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,dir-15+a*5,this.id,this.weaponData.damage*this.playerData.damageBuff,300,crit,this.index))
                                        entities.projectiles[entities.projectiles.length-1].speed=6
                                    }
                                    this.firearc=[atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),30]
                                    a=la
                                }
                            }
                        }
                    break
                    case 'PlayerBattlerock':
                        if(
                            this.time%60==0
                        ){
                            let minimum=450
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if((entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0||this.playerData.name=='PlayerMedicception')&&entities.players[a].life>0&&entities.players[a].id!=this.id){
                                    minimum=min(minimum,dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y))
                                }
                            }
                            for(let a=0,la=entities.players.length;a<la;a++){
                                if((entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0||this.playerData.name=='PlayerMedicception')&&entities.players[a].life>0&&dist(entities.players[a].position.x,entities.players[a].position.y,this.position.x,this.position.y)==minimum){
                                    let dir=atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y)
                                    for(let a=0,la=3;a<la;a++){
                                        entities.projectiles.push(new projectile(this.layer,this.position.x+lsin(a*120)*6,this.position.y-lcos(a*120)*6,1,dir,this.id,this.weaponData.damage*this.playerData.damageBuff*1.2,300,crit,this.index))
                                    }
                                    this.firearc=[atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),30]
                                    a=la
                                }
                            }
                        }
                    break
                    case 'Buster':
                        for(let a=0,la=entities.players.length;a<la;a++){
                            if(inBoxBox({position:{x:(this.position.x/2+this.previous.position.x/2),y:(this.position.y/2+this.previous.position.y/2)},width:this.width,height:this.height},entities.players[a])&&(entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0)&&!entities.players[a].dead&&!this.dead){
                                let dir=[entities.players[a].position.x-(this.position.x/2+this.previous.position.x/2),entities.players[a].position.y+entities.players[a].height/2-(this.position.y/2+this.previous.position.y/2)-this.height/2]
                                entities.players[a].lastingForce[0]+=dir[0]/(sqrt(dir[0]**2+dir[1]**2))*2
                                entities.players[a].lastingForce[1]+=dir[1]/(sqrt(dir[0]**2+dir[1]**2))
                                entities.players[a].velocity.x=dir[0]/(sqrt(dir[0]**2+dir[1]**2))*20+this.velocity.x
                                entities.players[a].velocity.y=dir[1]/(sqrt(dir[0]**2+dir[1]**2))*20+this.velocity.y
                                entities.projectiles.push(new projectile(graphics.main[0],this.position.x,this.position.y,153,0,this.id,360,2,false,this.index))
                                this.life=0
                            }else if(inBoxBox(this,entities.players[a])&&(entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0)&&!entities.players[a].dead&&!this.dead){
                                let dir=[entities.players[a].position.x-this.position.x,entities.players[a].position.y+entities.players[a].height/2-this.position.y-this.height/2]
                                entities.players[a].lastingForce[0]+=dir[0]/(sqrt(dir[0]**2+dir[1]**2))*2
                                entities.players[a].lastingForce[1]+=dir[1]/(sqrt(dir[0]**2+dir[1]**2))
                                entities.players[a].velocity.x=dir[0]/(sqrt(dir[0]**2+dir[1]**2))*20+this.velocity.x
                                entities.players[a].velocity.y=dir[1]/(sqrt(dir[0]**2+dir[1]**2))*20+this.velocity.y
                                entities.projectiles.push(new projectile(graphics.main[0],this.position.x,this.position.y,153,0,this.id,360,2,false,this.index))
                                this.life=0
                            }
                        }
                    break
                }
                if(this.playerData.name.includes('Tank')||this.weaponType==194||this.weaponType==242||this.weaponType==243||this.weaponType==245||this.weaponType==246||this.weaponType==247||this.weaponType==253){
                    for(let a=0,la=entities.players.length;a<la;a++){
                        if(inBoxBox({position:{x:(this.position.x/2+this.previous.position.x/2),y:(this.position.y/2+this.previous.position.y/2)},width:this.width,height:this.height},entities.players[a])&&(entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0)&&!entities.players[a].dead&&!this.dead){
                            let dir=[entities.players[a].position.x-(this.position.x/2+this.previous.position.x/2),entities.players[a].position.y+entities.players[a].height/2-(this.position.y/2+this.previous.position.y/2)-this.height/2]
                            if(this.weaponType==253){
                                entities.players[a].lastingForce[0]+=dir[0]/(sqrt(dir[0]**2+dir[1]**2))*8
                                entities.players[a].lastingForce[1]+=dir[1]/(sqrt(dir[0]**2+dir[1]**2))*4
                            }else{
                                entities.players[a].takeDamage(this.weaponType==194||this.weaponType==242||this.weaponType==243||this.weaponType==245||this.weaponType==246||this.weaponType==247?200:100)
                            }
                            entities.players[a].velocity.x=dir[0]/(sqrt(dir[0]**2+dir[1]**2))*20+this.velocity.x
                            entities.players[a].velocity.y=dir[1]/(sqrt(dir[0]**2+dir[1]**2))*20+this.velocity.y
                            entities.players[a].collect.time=450
                            entities.players[a].die.killer=this.index
                            if(this.weaponType==246&&this.assort.detonate==0){
                                entities.projectiles.push(new projectile(graphics.main[0],this.position.x,this.position.y,153,0,this.id,120,2,false,this.index))
                                this.assort.detonate=15
                            }
                            if(this.playerData.name=='PlayerSurprise'){
                                this.visible=60
                            }
                        }else if(inBoxBox(this,entities.players[a])&&(entities.players[a].id!=this.id&&game.pvp||entities.players[a].id==0&&this.id!=0||entities.players[a].id!=0&&this.id==0)&&!entities.players[a].dead&&!this.dead){
                            let dir=[entities.players[a].position.x-this.position.x,entities.players[a].position.y+entities.players[a].height/2-this.position.y-this.height/2]
                            if(this.weaponType==253){
                                entities.players[a].lastingForce[0]+=dir[0]/(sqrt(dir[0]**2+dir[1]**2))*8
                                entities.players[a].lastingForce[1]+=dir[1]/(sqrt(dir[0]**2+dir[1]**2))*4
                            }else{
                                entities.players[a].takeDamage(this.weaponType==194||this.weaponType==242||this.weaponType==243||this.weaponType==245||this.weaponType==246||this.weaponType==247||this.weaponType==253?200:100)
                            }
                            entities.players[a].velocity.x=dir[0]/(sqrt(dir[0]**2+dir[1]**2))*20+this.velocity.x
                            entities.players[a].velocity.y=dir[1]/(sqrt(dir[0]**2+dir[1]**2))*20+this.velocity.y
                            entities.players[a].collect.time=450
                            entities.players[a].die.killer=this.index
                            if(this.weaponType==246&&this.assort.detonate==0){
                                entities.projectiles.push(new projectile(graphics.main[0],this.position.x,this.position.y,153,0,this.id,120,2,false,this.index))
                                this.assort.detonate=15
                            }
                            if(this.playerData.name=='PlayerSurprise'){
                                this.visible=60
                            }
                        }
                    }
                }
            }
            if(this.critBuff>0){
                this.critBuff--
            }
            if(this.defendBuff>0){
                this.defendBuff--
            }
            if(this.stunTime>0){
                this.stunTime--
            }
            if(this.stuckTime>0){
                this.stuckTime--
            }
            if(this.vulnerableTime>0){
                this.vulnerableTime--
            }
            if(this.confuseTime>0){
                this.confuseTime--
            }
            if(this.bounceTime>0){
                this.bounceTime--
            }
            if(this.assort.detonate>0){
                this.assort.detonate--
            }
            if(this.DOT.active>0){
                this.DOT.active--
                this.life-=this.DOT.damage
            }
            if(game.invis){
                if(this.visible>0){
                    this.visible--
                }
                for(let a=0,la=entities.players.length;a<la;a++){
                    if(inBoxBox(this,entities.players[a])&&this.id!=entities.players[a].id&&!entities.players[a].dead&&!this.dead){
                        this.visible=15
                    }
                }
            }else if(this.playerData.name=='PlayerGriefer'||this.playerData.name=='PlayerHuntress'||this.playerData.name=='PlayerStealth'||this.playerData.name=='PlayerStealthception'||this.playerData.name=='PlayerFog'||this.playerData.name=='PlayerSurprise'){
                if(this.visible>0){
                    this.visible--
                }
                if(abs(this.velocity.x)+abs(this.velocity.y)>0.4){
                    this.visible=15
                }
            }
            if(this.base.control==0&&this.control==1){
                this.color.skin.head=mergeColor(this.color.skin.head,[100,100,100],0.6)
                this.color.skin.body=mergeColor(this.color.skin.body,[100,100,100],0.6)
                this.color.skin.legs=mergeColor(this.color.skin.legs,[100,100,100],0.6)
                this.color.skin.arms=mergeColor(this.color.skin.arms,[100,100,100],0.6)
                this.base.control=1
            }else if(this.base.control==1&&this.control==0){
                this.color.skin.head=mergeColor(this.color.skin.head,[255,255,255],0.6)
                this.color.skin.body=mergeColor(this.color.skin.body,[255,255,255],0.6)
                this.color.skin.legs=mergeColor(this.color.skin.legs,[255,255,255],0.6)
                this.color.skin.arms=mergeColor(this.color.skin.arms,[255,255,255],0.6)
                this.base.control=0
            }
            if(!this.disable2){
                this.velocity.x*=this.thrown?0.96:0.85
                this.velocity.y+=this.playerData.name=='ParaPistol'||this.playerData.name=='ParaRocketLauncher'||this.playerData.name=='PlayerParaRocketLauncher'||this.playerData.name=='PlayerParaGrenadier'||this.playerData.name=='PlayerStratofortress'||this.playerData.name=='PlayerParachutist'||this.playerData.name=='PlayerDropship'||this.playerData.name=='PlayerApache'?1:1.5
                this.previous.position.x=this.position.x
                this.previous.position.y=this.position.y
                this.position.x+=this.velocity.x
                this.position.y+=this.velocity.y
                this.velocity.x+=this.lastingForce[0]
                this.velocity.y+=this.lastingForce[1]
                this.lastingForce[0]*=0.925
                this.lastingForce[1]*=0.9
            }
            if(this.parachute){
                this.velocity.x*=game.pvp?(game.assault?0.8:0.99):0.5
                this.velocity.y*=2/3
            }else if(this.playerData.name=='ParaPistol'||this.playerData.name=='ParaRocketLauncher'||this.playerData.name=='PlayerParaRocketLauncher'||this.playerData.name=='PlayerParaGrenadier'||this.playerData.name=='PlayerStratofortress'||this.playerData.name=='PlayerParachutist'||this.playerData.name=='PlayerDropship'||this.playerData.name=='PlayerApache'){
                this.velocity.x*=0.9
                if(this.velocity.y>0){
                    this.velocity.y*=0.6
                }
            }
            if(this.carryMoney>0&&game.hunt!=-1&&(this.position.y<450||this.position.y<930&&this.position.x>game.edge[0]/2-705&&this.position.x<game.edge[0]/2+705)){
                game.money+=this.carryMoney
                this.carryMoney=0
            }
            if(game.hunt==-1&&(this.position.x<game.center-game.storm||this.position.x>game.center+game.storm)){
                this.takeDamage(0.25)
                this.collect.time=max(this.collect.time,30)
            }
            if(this.dizzyTime>0){
                this.dizzyTime--
                this.velocity.x*=0.8
            }
            if(this.chillTime>0){
                this.chillTime--
                this.velocity.x*=0.75
            }
            if(this.id==0&&!game.body||this.construct||this.sidekick){
                if(game.invis){
                    this.fade=smoothAnim(this.fade,this.visible>0&&!this.dead,0,1,10)
                }else{
                    this.fade=smoothAnim(this.fade,!this.dead,0,1,5)
                }
                if(this.dead&&this.fade<=0){
                    this.remove=true
                }
            }else{
                if(this.invincible>0){
                    this.invincible--
                    this.fade=smoothAnim(this.fade,game.time%20>=10,0.4,1,5)
                }else if(game.invis||this.playerData.name=='PlayerGriefer'||this.playerData.name=='PlayerHuntress'||this.playerData.name=='PlayerStealth'||this.playerData.name=='PlayerStealthception'||this.playerData.name=='PlayerFog'||this.playerData.name=='PlayerSurprise'){
                    if(this.life<=0){
                        this.fade=smoothAnim(this.fade,!this.dead,0.4,1,5)
                    }else{
                        this.fade=smoothAnim(this.fade,this.visible>0,0,1,10)
                    }
                }else if(game.past){
                    this.fade=smoothAnim(this.fade,!this.dead,0,1,5)
                }else{
                    this.fade=smoothAnim(this.fade,!this.dead,0.4,1,5)
                }
            }
            if(entities.projectiles.length>projectilesLength){
                for(let a=projectilesLength,la=entities.projectiles.length;a<la;a++){
                    entities.projectiles[a].previous.position.x=this.position.x
                    entities.projectiles[a].previous.position.y=this.position.y
                }
            }
        }
    }
}