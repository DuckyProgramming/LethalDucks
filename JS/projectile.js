class projectile{
    constructor(layer,x,y,type,direction,id,damage,time,crit,index,args=[]){
        this.layer=layer
        this.position={x:x,y:y}
        this.type=type
        this.direction=direction
        this.id=id
        this.damage=damage
		this.crit=crit
		this.index=index
        this.width=2
        this.height=2
		this.exploded=false
		this.previous={position:{x:this.position.x,y:this.position.y}}
		this.projectileIndex=game.projectileIndex
		game.projectileIndex++
		this.exploder=this.type==2||this.type==16||this.type==21||this.type==22||this.type==26||
			this.type==27||this.type==30||this.type==31||this.type==32||this.type==41||
			this.type==45||this.type==47||this.type==48||this.type==53||this.type==54||
			this.type==55||this.type==56||this.type==58||this.type==60||this.type==64||
			this.type==65||this.type==66||this.type==73||this.type==75||this.type==78||
			this.type==80||this.type==83||this.type==86||this.type==88||this.type==97||
			this.type==98||this.type==101||this.type==104||this.type==110||this.type==113||
			this.type==117||this.type==121||this.type==146||this.type==156||this.type==166||
			this.type==171||this.type==178
		switch(this.type){
			case 1: case 4: case 9: case 10: case 11: case 12: case 13: case 14: case 18: case 19:
			case 20: case 24: case 36: case 37: case 38: case 39: case 43: case 44: case 49: case 50:
			case 57: case 59: case 63: case 67: case 72: case 82: case 84: case 87: case 88: case 90:
			case 94: case 99: case 100: case 105: case 112: case 151: case 155: case 175:
				this.speed=random(6,8)
				this.time=random(time,time*2)
				this.position.x+=this.speed*lsin(this.direction)
				this.position.y-=this.speed*lcos(this.direction)
			break
			case 2: case 16: case 21: case 22: case 27: case 32: case 45: case 48: case 55: case 66:
			case 78: case 86: case 101:
				this.speed=5
				this.time=time
			break
			case 3: case 153:
				this.speed=0
				this.time=time
			break
			case 5: case 8: case 29: case 30: case 35: case 51: case 60: case 61: case 65: case 68:
			case 69: case 70: case 73: case 83: case 95: case 97: case 98: case 102: case 104: case 106:
			case 107: case 110: case 111: case 113: case 114: case 115: case 116: case 117: case 118: case 119:
			case 120: case 121: case 122: case 123: case 124: case 128: case 129: case 131: case 132: case 134:
			case 135: case 136: case 137: case 138: case 139: case 140: case 141: case 142: case 143: case 144:
			case 145: case 146: case 156: case 157: case 158: case 159: case 160: case 161: case 162: case 163:
			case 164: case 165: case 166: case 168: case 169: case 170: case 171: case 172: case 177: case 178:
			case 179: case 180: case 181: case 182: case 183: case 184:
				this.width=this.type==97||this.type==134||this.type==138||this.type==162||this.type==163||this.type==164||this.type==165?12:4
				this.height=this.type==97||this.type==134||this.type==138||this.type==162||this.type==163||this.type==164||this.type==165?12:4
				this.speed=this.type==120||this.type==177||this.type==178||this.type==179?1:6
				this.bounces=0
				this.bounceTimer=0
				this.time=time*(this.id==0?0.6:1)
				this.midpoint={position:{x:this.position.x,y:this.position.y}}
				this.past=[
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y]
				]
				this.velocity={x:this.speed*lsin(this.direction),y:this.speed*lcos(this.direction)-(this.type==68||this.type==132||this.type==135||this.type==136||this.type==169||this.type==170?0:4)}
				this.goal=-1
				if(this.type==135||this.type==136||this.type==169||this.type==170){
					this.effectiveDirection=this.direction
				}else if(
					this.type==120||this.type==177||this.type==178||this.type==179||this.type==180||
					this.type==182||this.type==183
				){
					this.spin=random(-2,2)
				}else if(this.type==145){
					this.target=args[0]
					for(let a=0,la=entities.players.length;a<la;a++){
						if(entities.players[a].projectileIndex==this.target){
							this.goal=a
						}
					}
					this.aggro=false
					this.orbit=35
					this.offset=direction
				}else if(
					this.type==111||this.type==118||this.type==119||this.type==120||this.type==121||
					this.type==122||this.type==123||this.type==124||this.type==128||this.type==129||
					this.type==132||this.type==134||this.type==137||this.type==138||this.type==139||
					this.type==140||this.type==141||this.type==142||this.type==143||this.type==144||
					this.type==157||this.type==158||this.type==159||this.type==160||this.type==161||
					this.type==162||this.type==163||this.type==164||this.type==165||this.type==168||
					this.type==171||this.type==172||this.type==184
				){
					for(let a=0,la=entities.players.length;a<la;a++){
						if(entities.players[a].index==this.index&&!entities.players[a].sidekick){
							this.goal=a
						}
					}
					this.aggro=false
					this.goalIndex=0
					this.orbit=this.type==128?random(15,25):random(25,35)
					this.offset=random(0,360)
					if(this.type==119||this.type==121||this.type==132){
						this.speed=random(8,12)
					}else if(this.type==144){
						for(let b=0,lb=3;b<lb;b++){
							entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,145,this.direction+b*120,this.id,this.damage/2,time,this.crit,this.index,[this.projectileIndex]))
						}
					}
				}else if(
					this.type==113||this.type==114||this.type==115||this.type==116||this.type==117||
					this.type==146||this.type==156||this.type==181
				){
					this.stop=false
					if(this.type==117){
						this.ammo=10
					}
				}
			break
			case 6: case 33: case 79: case 81: case 109: case 152:
				this.speed=random(3,5)
				this.time=random(time,time*2)
			break
			case 7: case 23: case 40: case 46: case 76: case 77:
				this.width*=5
				this.height*=5
				this.speed=time/4
				this.time=5
			break
			case 15: case 74: case 75:
				this.speed=random(4,6.5)
				this.time=random(time,time*2)
			break
			case 17:
				this.width=6
				this.height=6
				this.speed=9
				this.time=time*(this.id==0?0.6:1)
				this.previous={position:{x:this.position.x,y:this.position.y}}
				this.midpoint={position:{x:this.position.x,y:this.position.y}}
				this.past=[
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y]
				]
				this.velocity={x:this.speed*lsin(this.direction),y:this.speed*lcos(this.direction)-4}
			break
			case 25:
				this.width*=15
				this.height*=15
				this.speed=time/4
				this.time=15
			break
			case 26: case 53: case 54: case 58:
				this.speed=3
				this.time=time
			break
			case 28:
				this.width=4
				this.height=4
				this.speed=10
				this.time=time*(this.id==0?0.6:1)
				this.previous={position:{x:this.position.x,y:this.position.y}}
				this.midpoint={position:{x:this.position.x,y:this.position.y}}
				this.past=[
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y]
				]
				this.velocity={x:this.speed*lsin(this.direction),y:this.speed*lcos(this.direction)-4}
			break
			case 31: case 47: case 56: case 64:
				this.speed=2
				this.time=time*2
			break
			case 34: case 42: case 176:
				this.width=3
				this.height=3
				this.speed=this.type==176?11:7
				this.bounces=0
				this.time=time*(this.id==0?0.6:1)
				this.previous={position:{x:this.position.x,y:this.position.y}}
				this.midpoint={position:{x:this.position.x,y:this.position.y}}
				this.past=[
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y]
				]
				this.velocity={x:this.speed*lsin(this.direction),y:this.speed*lcos(this.direction)-4}
			break
			case 41:
				this.speed=7
				this.time=time
			break
			case 52:
				this.width=4
				this.height=4
				this.speed=3.6
				this.bounces=0
				this.time=time*(this.id==0?0.6:1)
				this.previous={position:{x:this.position.x,y:this.position.y}}
				this.midpoint={position:{x:this.position.x,y:this.position.y}}
				this.past=[
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y]
				]
				this.velocity={x:this.speed*lsin(this.direction),y:this.speed*lcos(this.direction)-4}
			break
			case 62:
				this.width=3
				this.height=3
				this.speed=4.2
				this.bounces=0
				this.time=time*(this.id==0?0.6:1)
				this.previous={position:{x:this.position.x,y:this.position.y}}
				this.midpoint={position:{x:this.position.x,y:this.position.y}}
				this.past=[
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y]
				]
				this.velocity={x:this.speed*lsin(this.direction),y:this.speed*lcos(this.direction)-4}
			break
			case 71:
				this.speed=random(6,8.75)
				this.time=random(time,time*2)
			break
			case 80: case 85:
				this.speed=1.5
				this.time=time
			break
			case 89: case 103:
				this.speed=0
				this.time=time
				this.width*=60
				this.height*=60
				this.shocks=[]
			break
			case 91: case 92: case 93: case 96: case 108:
				this.velocity={x:0,y:0}
				this.speed=6
				this.spin=0
				this.time=time
				this.hit=[]
				this.trigger=0
				this.bounces=0
				this.width=this.type==108?12:16
				this.height=this.type==108?12:16
				this.velocity.x=this.speed*lsin(this.direction)
				this.velocity.y=-this.speed*lcos(this.direction)
			break
			case 125: case 126: case 127: case 130: case 154: case 185:
				this.speed=2
				this.time=time
				this.width*=8
				this.height*=8
			break
			case 133: case 148: case 149:
				this.speed=2
				this.time=time
			break
			case 147:
				this.speed=16
				this.time=time
				this.midpoint={position:{x:this.position.x,y:this.position.y}}
				this.past=[
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y],
					[this.position.x,this.position.y]
				]
				this.velocity={x:this.speed*lsin(this.direction),y:this.speed*lcos(this.direction)}
			break
			case 150:
				this.speed=random(8,10)
				this.time=time
			break
			case 167:
				this.speed=6
				this.time=time
			break
			case 173:
				this.speed=3
				this.time=time
				this.width*=4
				this.height*=4
			break
			case 174:
				this.speed=4
				this.time=time
				this.width*=2
				this.height*=2
			break
		}
		this.timer=0
        this.fade=1
        this.active=true
        this.remove=false
		this.base={time:this.time,damage:this.damage,speed:this.speed,index:this.index}
		if(this.crit==1){
			this.damage*=2.5
		}
    }
    display(layer,offsetX=0,offsetY=0){
        layer.push()
        layer.translate(this.position.x+offsetX,this.position.y+offsetY)
        layer.rotate(this.direction)
		layer.noStroke()
        switch(this.type){
			case 1:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,3)
			break
			case 2:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(120,120+this.crit*200,120+this.crit*200,this.fade)
				layer.ellipse(0,0,6,20)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,240-this.fade*240)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,160-this.fade*160)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,80-this.fade*80)
				}
			break
			case 3:
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,40,120+this.crit*200,this.fade)
					layer.ellipse(0,0,480-this.fade*480)
					layer.fill(240-this.crit*200,80,160+this.crit*200,this.fade)
					layer.ellipse(0,0,360-this.fade*360)
					layer.fill(240-this.crit*200,120,200+this.crit*200,this.fade)
					layer.ellipse(0,0,240-this.fade*240)
					layer.fill(240-this.crit*200,160,240+this.crit*200,this.fade)
					layer.ellipse(0,0,120-this.fade*120)
				}
			break
			case 4:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,12,1,24)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,9,1,18)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,6,1,12)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,3,4)
			break
			case 5: case 68: case 135: case 136:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,8)
			break
			case 6:
				layer.fill(240-this.crit*200,120,this.crit*200,this.fade*this.time/this.base.time)
				layer.ellipse(0,0,60*(1-this.time/this.base.time))
				layer.fill(240-this.crit*200,180,this.crit*200,this.fade*this.time/this.base.time)
				layer.ellipse(0,0,30*(1-this.time/this.base.time))
			break
			case 7:
				if(!this.active&&this.fade<1){
					layer.fill(200-this.crit*200,200,200+this.crit*200,this.fade)
					layer.ellipse(0,0,30-this.fade*30)
				}
			break
			case 8:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,12)
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade)
				layer.ellipse(0,0,4)
			break
			case 9:
				layer.fill(40,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(40,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(40,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(150,250,150,this.fade)
				layer.ellipse(0,0,3)
			break
			case 10:
				layer.fill(120,240,120+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(120,200,120+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(120,160,120+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(200,250,200,this.fade)
				layer.ellipse(0,0,3)
			break
			case 11:
				layer.fill(240-this.crit*200,240,120+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,200,120+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,160,120+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(200,250,200,this.fade)
				layer.ellipse(0,0,3)
			break
			case 12:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(250-this.crit*200,250,100+this.crit*200,this.fade)
				layer.ellipse(0,0,6,3)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,3)
			break
			case 13:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(100-this.crit*200,250,100+this.crit*200,this.fade)
				layer.ellipse(0,0,6,3)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,3)
			break
			case 14:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,12,1,24)
				layer.rect(0,12,24,1)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,9,1,18)
				layer.rect(0,12,18,1)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,6,1,12)
				layer.rect(0,12,12,1)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,3,4)
			break
			case 15:
				layer.fill(240-this.crit*200,120,this.crit*200,this.fade*this.time/this.base.time)
				layer.ellipse(0,0,60*(1-this.time/this.base.time))
				layer.fill(240-this.crit*200,180,this.crit*200,this.fade*this.time/this.base.time)
				layer.ellipse(0,0,30*(1-this.time/this.base.time))
			break
			case 16:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(240-this.crit*200,240+this.crit*200,40+this.crit*200,this.fade)
				layer.ellipse(0,0,6,20)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,240-this.fade*240)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,160-this.fade*160)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,80-this.fade*80)
				}
			break
			case 17:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[12][0]-this.position.x,this.past[12][1]-this.position.y,8)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,10)
			break
			case 18:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(250-this.crit*200,250,100+this.crit*200,this.fade)
				layer.rect(0,0,6,2)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,3)
			break
			case 19:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(250-this.crit*200,250,100+this.crit*200,this.fade)
				layer.ellipse(0,0,3,6)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,3)
			break
			case 20:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,4)
				layer.fill(100,250,100,this.fade)
				layer.ellipse(0,0,2)
			break
			case 21:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(120,120+this.crit*200,120+this.crit*200,this.fade)
				layer.ellipse(0,0,6,20)
				layer.fill(240,40,40,this.fade)
				layer.ellipse(0,0,4,12)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,120,this.crit*200,this.fade)
					layer.ellipse(0,0,240-this.fade*240)
					layer.fill(240-this.crit*200,80,this.crit*200,this.fade)
					layer.ellipse(0,0,160-this.fade*160)
					layer.fill(240-this.crit*200,40,this.crit*200,this.fade)
					layer.ellipse(0,0,80-this.fade*80)
				}
			break
			case 22:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(120,120+this.crit*200,120+this.crit*200,this.fade)
				layer.ellipse(0,0,6,20)
				layer.fill(240,240,40,this.fade)
				layer.ellipse(0,0,4,12)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,480-this.fade*480)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,320-this.fade*320)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,160-this.fade*160)
				}
			break
			case 23:
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,180,180+this.crit*200,this.fade)
					layer.ellipse(0,0,30-this.fade*30)
				}
			break
			case 24:
				layer.fill(240-this.crit*200,60,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,40,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,20,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,3)
			break
			case 25:
				if(!this.active&&this.fade<1){
					layer.fill(200-this.crit*200,200,200+this.crit*200,this.fade)
					layer.ellipse(0,0,36-this.fade*36,27-this.fade*27)
				}
			break
			case 26:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,7)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,5)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,3)
				layer.fill(120,120+this.crit*200,120+this.crit*200,this.fade)
				layer.ellipse(0,0,8,20)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,240-this.fade*240)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,160-this.fade*160)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,80-this.fade*80)
				}
			break
			case 27:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(240-this.crit*200,240+this.crit*200,40+this.crit*200,this.fade)
				layer.ellipse(0,0,6,20)
				layer.fill(240,240,40,this.fade)
				layer.ellipse(0,0,4,12)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,240-this.fade*240)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,160-this.fade*160)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,80-this.fade*80)
				}
			break
			case 28:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				regPoly(layer,0,0,16,4,4,0)
			break
			case 29:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,12)
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade)
				layer.ellipse(0,0,4)
				layer.rotate(this.time*2)
				layer.quad(0,-1,-5,0,0,1,5,0)
				layer.quad(0,-5,-1,0,0,5,1,0)
			break
			case 30:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,8)
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade)
				layer.rect(0,0,4)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,270-this.fade*270)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,180-this.fade*180)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,90-this.fade*90)
				}
			break
			case 31:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(120,120+this.crit*200,120+this.crit*200,this.fade)
				layer.ellipse(0,0,6,20)
				layer.rect(0,0,8,8)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,240-this.fade*240)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,160-this.fade*160)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,80-this.fade*80)
				}
			break
			case 32:
				layer.stroke(120,120+this.crit*200,120+this.crit*200,this.fade)
				layer.strokeWeight(1)
				layer.noFill()
				layer.ellipse(0,0,6,20)
				if(!this.active&&this.fade<1){
					layer.noStroke()
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,240-this.fade*240)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,160-this.fade*160)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,80-this.fade*80)
				}
			break
			case 33:
				layer.fill(240-this.crit*200,120+this.crit*120,120+this.crit*200,this.fade*this.time/this.base.time)
				layer.ellipse(0,0,60*(1-this.time/this.base.time))
				layer.fill(240-this.crit*200,160+this.crit*80,160+this.crit*120,this.fade*this.time/this.base.time)
				layer.ellipse(0,0,30*(1-this.time/this.base.time))
			break
			case 34:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,1)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,2)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,3)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,5)
			break
			case 35:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,250,200,this.fade)
				layer.ellipse(0,0,8)
			break
			case 36:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(200,250,250,this.fade)
				layer.ellipse(0,0,3)
			break
			case 37:
				if(!this.active&&this.fade<1){
					layer.fill(100-this.crit*200,250,100+this.crit*200,this.fade)
					layer.ellipse(0,0,30-this.fade*30)
				}
			break
			case 38:
				layer.fill(240-this.crit*200,120+this.crit*200,240+this.crit*40,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,120+this.crit*200,240+this.crit*40,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,120+this.crit*200,240+this.crit*40,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(200,250,250,this.fade)
				layer.quad(-4,0,0,-1,1,0,0,4)
				layer.fill(200,250,200,this.fade)
				layer.ellipse(0,0,3)
			break
			case 39:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,12,1,24)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,9,1,18)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,6,1,12)
				layer.fill(250,200,200,this.fade)
				layer.ellipse(0,0,3,4)
			break
			case 40:
				if(!this.active&&this.fade<1){
					layer.fill(100-this.crit*200,250,100+this.crit*200,this.fade)
					layer.ellipse(0,0,40-this.fade*40)
					layer.fill(200-this.crit*200,200,200+this.crit*200,this.fade)
					layer.ellipse(0,0,30-this.fade*30)
				}
			break
			case 41:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(120,120+this.crit*200,120+this.crit*200,this.fade)
				layer.ellipse(0,0,6,20)
				layer.triangle(-3,0,3,0,0,-15)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,240-this.fade*240)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,160-this.fade*160)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,80-this.fade*80)
				}
			break
			case 42:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,1)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,2)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,3)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,9)
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade)
				layer.ellipse(0,0,3)
			break
			case 43:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(250,250,0,this.fade)
				layer.ellipse(0,0,6,3)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,3)
			break
			case 44:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(250,125,0,this.fade)
				layer.ellipse(0,0,6,3)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,3)
			break
			case 45:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(120,120+this.crit*200,120+this.crit*200,this.fade)
				layer.ellipse(0,0,6,20)
				layer.fill(240-this.crit*200,this.crit*240,this.crit*240,this.fade)
				layer.ellipse(0,0,4,20)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,240-this.fade*240)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,160-this.fade*160)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,80-this.fade*80)
				}
			break
			case 46:
				if(!this.active&&this.fade<1){
					layer.fill(200-this.crit*200,200,200+this.crit*200,this.fade)
					layer.ellipse(0,0,30-this.fade*30)
					layer.rect(0,0,10-this.fade*10,40-this.fade*40)
					layer.rect(0,0,40-this.fade*40,10-this.fade*10)
				}
			break
			case 47:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(120,120+this.crit*200,120+this.crit*200,this.fade)
				layer.ellipse(0,0,6,20)
				layer.fill(250,125,0,this.fade)
				layer.rect(0,0,8,8)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,240-this.fade*240)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,160-this.fade*160)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,80-this.fade*80)
				}
			break
			case 48:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(120,120+this.crit*200,120+this.crit*200,this.fade)
				layer.ellipse(0,0,6,20)
				layer.fill(40,this.fade)
				layer.rect(0,0,4,4)
				if(!this.active&&this.fade<1){
					layer.fill(100,this.fade*3)
					layer.ellipse(0,0,1200-this.fade*1200)
				}
			break
			case 49:
				layer.fill(240-this.crit*200,60,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,40,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,20,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(250,this.fade)
				layer.rect(0,0,3)
			break
			case 50:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,12,1,24)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,9,1,18)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,6,1,12)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,3,4)
				layer.fill(100,250,100,this.fade)
				layer.ellipse(0,0,2,3)
			break
			case 51:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.rotate(this.time*4)
				layer.fill(150,0,0,this.fade)
				layer.quad(-2,0,0,-10,2,0,0,10)
				layer.quad(-10,0,0,-2,10,0,0,2)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,8)
			break
			case 52:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,1.5)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,3)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,4.5)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,8)
			break
			case 53:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,7)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,5)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,3)
				layer.fill(120,120+this.crit*200,120+this.crit*200,this.fade)
				layer.ellipse(0,0,6,20)
				layer.fill(240,40,40,this.fade)
				layer.ellipse(0,0,4,12)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,120,this.crit*200,this.fade)
					layer.ellipse(0,0,240-this.fade*240)
					layer.fill(240-this.crit*200,80,this.crit*200,this.fade)
					layer.ellipse(0,0,160-this.fade*160)
					layer.fill(240-this.crit*200,40,this.crit*200,this.fade)
					layer.ellipse(0,0,80-this.fade*80)
				}
			break
			case 54:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,7)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,5)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,3)
				layer.fill(120,120+this.crit*200,120+this.crit*200,this.fade)
				layer.ellipse(0,0,6,20)
				layer.fill(240-this.crit*200,this.crit*240,this.crit*240,this.fade)
				layer.ellipse(0,0,4,20)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,240-this.fade*240)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,160-this.fade*160)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,80-this.fade*80)
				}
			break
			case 55:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(240-this.crit*200,240+this.crit*200,40+this.crit*200,this.fade)
				layer.ellipse(0,0,6,20)
				layer.fill(240-this.crit*200,240+this.crit*200,120+this.crit*200,this.fade)
				layer.ellipse(0,0,3,10)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,240-this.fade*240)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,160-this.fade*160)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,80-this.fade*80)
				}
			break
			case 56:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(250-this.crit*200,250,100+this.crit*200,this.fade)
				layer.rect(0,0,10,12)
				layer.fill(120,120+this.crit*200,120+this.crit*200,this.fade)
				layer.ellipse(0,0,6,20)
				layer.rect(0,0,8,8)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,240-this.fade*240)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,160-this.fade*160)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,80-this.fade*80)
				}
			break
			case 57:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,12,1,24)
				layer.rect(0,16,12,1)
				layer.rect(0,8,12,1)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,9,1,18)
				layer.rect(0,16,9,1)
				layer.rect(0,8,9,1)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,6,1,12)
				layer.rect(0,16,6,1)
				layer.rect(0,8,6,1)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,3,4)
			break
			case 58:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,7)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,5)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,3)
				layer.fill(120,120+this.crit*200,120+this.crit*200,this.fade)
				layer.ellipse(0,0,6,20)
				layer.fill(240,240,40,this.fade)
				layer.ellipse(0,0,4,12)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,480-this.fade*480)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,320-this.fade*320)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,160-this.fade*160)
				}
			break
			case 59:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(250,250,0,this.fade)
				layer.ellipse(0,0,6,3)
				layer.fill(250,125,0,this.fade)
				layer.ellipse(0,0,3,6)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,3)
			break
			case 60:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,10)
				layer.fill(240-this.crit*200,this.crit*240,this.crit*240,this.fade)
				layer.ellipse(0,0,4,10)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,180-this.fade*180)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,120-this.fade*120)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,60-this.fade*60)
				}
			break
			case 61:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.rotate(this.time*4)
				layer.fill(150,0,150,this.fade)
				layer.quad(-2,0,0,-10,2,0,0,10)
				layer.quad(-10,0,0,-2,10,0,0,2)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,8)
			break
			case 62:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,0.75)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,1.5)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,2.25)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,5)
			break
			case 63:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,240,80+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,240,120+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(200,250,250,this.fade)
				layer.quad(-4,0,0,-1,1,0,0,4)
				layer.fill(200,250,200,this.fade)
				layer.ellipse(0,0,3)
			break
			case 64:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(120,120+this.crit*200,120+this.crit*200,this.fade)
				layer.ellipse(0,0,6,20)
				layer.fill(250,0,250,this.fade)
				layer.rect(0,0,8,8)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,240-this.fade*240)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,160-this.fade*160)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,80-this.fade*80)
				}
			break
			case 65:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,8)
				layer.fill(250-this.crit*200,250-this.crit*50,this.crit*200,this.fade)
				layer.rect(0,0,4)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,180-this.fade*180)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,120-this.fade*120)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,60-this.fade*60)
				}
			break
			case 66:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(120,120+this.crit*200,120+this.crit*200,this.fade)
				layer.ellipse(0,0,6,20)
				layer.fill(240,this.fade)
				layer.quad(-2.5,0,0,-1,2.5,0,0,1)
				layer.quad(-1,0,0,-2.5,1,0,0,2.5)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,240-this.fade*240)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,160-this.fade*160)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,80-this.fade*80)
				}
			break
			case 67:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,3)
				layer.fill(250,0,250,this.fade)
				layer.rect(0,0,2)
			break
			case 69:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,12)
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade)
				regStar(layer,0,0,8,1,1,6,6,this.time*2)
			break
			case 70:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,12)
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade)
				layer.ellipse(0,0,6)
				layer.rect(0,0,1,10)
			break
			case 71:
				layer.fill(240-this.crit*200,140,20+this.crit*200,this.fade*this.time/this.base.time)
				layer.ellipse(0,0,60*(1-this.time/this.base.time))
				layer.fill(240-this.crit*200,200,20+this.crit*200,this.fade*this.time/this.base.time)
				layer.ellipse(0,0,30*(1-this.time/this.base.time))
			break
			case 72:
				layer.fill(40,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(40,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(40,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(150,250,150,this.fade)
				layer.ellipse(0,0,3)
				layer.fill(250-this.crit*200,250,100+this.crit*150,this.fade)
				layer.ellipse(0,0,2)
			break
			case 73:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,10)
				layer.fill(240,0,240,this.fade)
				layer.ellipse(0,0,4,10)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,80+this.crit*160,200,this.fade)
					layer.ellipse(0,0,180-this.fade*180)
					layer.fill(240-this.crit*200,80+this.crit*160,140,this.fade)
					layer.ellipse(0,0,120-this.fade*120)
					layer.fill(240-this.crit*200,80+this.crit*160,80,this.fade)
					layer.ellipse(0,0,60-this.fade*60)
				}
			break
			case 74:
				layer.fill(200-this.crit*200,200,this.crit*200,this.fade*this.time/this.base.time)
				layer.ellipse(0,0,60*(1-this.time/this.base.time))
				layer.fill(160-this.crit*160,160,this.crit*200,this.fade*this.time/this.base.time)
				layer.ellipse(0,0,30*(1-this.time/this.base.time))
			break
			case 75:
				layer.fill(240-this.crit*200,120,this.crit*200,this.fade*this.time/this.base.time)
				regStar(layer,0,0,5,80*(1-this.time/this.base.time),80*(1-this.time/this.base.time),60*(1-this.time/this.base.time),60*(1-this.time/this.base.time),this.position.x+this.position.y)
				layer.fill(240-this.crit*200,180,this.crit*200,this.fade*this.time/this.base.time)
				regStar(layer,0,0,5,40*(1-this.time/this.base.time),40*(1-this.time/this.base.time),30*(1-this.time/this.base.time),30*(1-this.time/this.base.time),this.position.x+this.position.y)
			break
			case 76:
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*240,240,160+this.crit*200,this.fade)
					layer.ellipse(0,0,30-this.fade*30)
				}
			break
			case 77:
				if(!this.active&&this.fade<1){
					layer.fill(250-this.crit*200,250,100+this.crit*200,this.fade)
					layer.ellipse(0,0,40-this.fade*40,30-this.fade*30)
					layer.fill(200-this.crit*200,200,200+this.crit*200,this.fade)
					layer.ellipse(0,0,30-this.fade*30)
				}
			break
			case 78:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(120,120+this.crit*200,120+this.crit*200,this.fade)
				layer.ellipse(0,0,6,20)
				layer.fill(250,125,0,this.fade)
				layer.ellipse(0,0,6)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,240-this.fade*240)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,160-this.fade*160)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,80-this.fade*80)
				}
			break
			case 79:
				layer.strokeWeight(1)
				layer.noFill()
				layer.stroke(240-this.crit*200,120,this.crit*200,this.fade*this.time/this.base.time)
				layer.ellipse(0,0,60*(1-this.time/this.base.time))
				layer.stroke(240-this.crit*200,180,this.crit*200,this.fade*this.time/this.base.time)
				layer.ellipse(0,0,30*(1-this.time/this.base.time))
			break
			case 80:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(120,120+this.crit*200,120+this.crit*200,this.fade)
				layer.ellipse(0,0,6,20)
				layer.fill(40,0,80,this.fade)
				layer.rect(0,0,6,2)
				layer.rect(0,-3,6,2)
				layer.rect(0,3,6,2)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,240-this.fade*240)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,160-this.fade*160)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,80-this.fade*80)
				}
			break
			case 81:
				layer.fill(200-this.crit*200,200,this.crit*200,this.fade*this.time/this.base.time)
				layer.ellipse(0,0,60*(1-this.time/this.base.time))
				layer.fill(160-this.crit*160,160,this.crit*200,this.fade*this.time/this.base.time)
				layer.ellipse(0,0,30*(1-this.time/this.base.time))
			break
			case 82:
				layer.fill(40,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(40,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(40,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(175,255,255,this.fade)
				layer.quad(-2,0,0,-2,2,0,0,2)
				layer.fill(150,250,150,this.fade)
				layer.ellipse(0,0,3)
			break
			case 83:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250-this.crit*250,250,250,this.fade)
				layer.ellipse(0,0,8)
				layer.fill(240,240,40,this.fade)
				layer.rect(0,0,4)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,180-this.fade*180)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,120-this.fade*120)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,60-this.fade*60)
				}
			break
			case 84: case 100:
				layer.noFill()
				layer.strokeWeight(1)
				layer.stroke(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,2,8)
				layer.stroke(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,2,6)
				layer.stroke(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,2,4)
				layer.stroke(250,this.fade)
				layer.ellipse(0,0,3)
			break
			case 85:
				layer.scale(0.6)
				layer.fill(240-this.crit*200,120,this.crit*200,this.fade)
				layer.ellipse(0,0,20)
				regStar(layer,0,0,7,24,24,15,15,this.position.x+this.position.y)
				regStar(layer,0,0,7,15,15,30,30,this.position.x+this.position.y)
				layer.fill(240-this.crit*200,180,this.crit*200,this.fade)
				layer.ellipse(0,0,10)
				regStar(layer,0,0,7,16,16,10,10,this.position.x+this.position.y)
				regStar(layer,0,0,7,10,10,20,20,this.position.x+this.position.y)
			break
			case 86:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(120,120+this.crit*200,120+this.crit*200,this.fade)
				layer.ellipse(0,0,4,12)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,150-this.fade*150)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,100-this.fade*100)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,50-this.fade*50)
				}
			break
			case 87:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(250-this.crit*200,250,100+this.crit*200,this.fade)
				layer.ellipse(0,0,6,3)
				layer.ellipse(0,0,3,6)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,3)
			break
			case 88:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,12,1,24)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,9,1,18)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,6,1,12)
				layer.fill(250,this.fade)
				layer.fill(255,255,100,this.fade)
				regStar(layer,0,0,6,2,2,8,8,0)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,150-this.fade*150)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,100-this.fade*100)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,50-this.fade*50)
				}
			break
			case 89:
				layer.stroke(255-this.crit*150,255,100+this.crit*150,this.fade)
				layer.strokeWeight(4)
				layer.noFill()
				layer.ellipse(0,0,120)
				for(let a=0,la=this.shocks.length;a<la;a++){
					layer.stroke(255,255,100,this.fade*this.shocks[a][2])
					layer.line(
						lsin(this.shocks[a][0])*60,
						lcos(this.shocks[a][0])*60,
						lsin(this.shocks[a][1])*60,
						lcos(this.shocks[a][1])*60
					)
				}
			break
			case 90:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,0.5,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,0.5,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,0.5,4)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,3)
			break
			case 91:
				layer.rotate(this.spin)
				layer.stroke(75,225,175,this.fade)
				layer.strokeWeight(3)
				layer.noFill()
				layer.ellipse(0,-2.5,12,12)
				layer.stroke(75,225,175,this.fade*0.5)
				layer.strokeWeight(4)
				layer.ellipse(0,-2.5,12,12)
				layer.strokeWeight(3)
				layer.stroke(200-this.crit*200,200+this.crit*50,200+this.crit*50,this.fade)
				layer.arc(0,0,18,18,-60,240)
				layer.line(-9,2,-9,-2)
				layer.line(9,2,9,-2)
				layer.line(-2,9,2,9)
				layer.stroke(40,120,60,this.fade)
				layer.strokeWeight(2)
				layer.arc(0,0,18,18,240,300)
			break
			case 92:
				layer.rotate(this.spin)
				layer.stroke(75,225,175,this.fade)
				layer.strokeWeight(3)
				layer.noFill()
				layer.ellipse(0,-2.5,12,12)
				layer.stroke(75,225,175,this.fade*0.5)
				layer.strokeWeight(4)
				layer.ellipse(0,-2.5,12,12)
				layer.strokeWeight(3)
				layer.stroke(200-this.crit*200,200+this.crit*50,200+this.crit*50,this.fade)
				layer.arc(0,0,18,18,-60,240)
				layer.line(-9,2,-9,-2)
				layer.line(9,2,9,-2)
				layer.line(-2,9,2,9)
				layer.line(-9,0,9,0)
				layer.line(0,-9,0,9)
				layer.stroke(40,120,60,this.fade)
				layer.strokeWeight(2)
				layer.arc(0,0,18,18,240,300)
			break
			case 93:
				layer.rotate(this.spin)
				layer.stroke(75,225,175,this.fade)
				layer.strokeWeight(3)
				layer.noFill()
				layer.ellipse(0,-2.5,12,12)
				layer.stroke(75,225,175,this.fade*0.5)
				layer.strokeWeight(4)
				layer.ellipse(0,-2.5,12,12)
				layer.strokeWeight(3)
				layer.stroke(200-this.crit*200,200+this.crit*50,200+this.crit*50,this.fade)
				layer.arc(0,0,18,18,-60,240)
				layer.line(-9,2,-9,-2)
				layer.line(9,2,9,-2)
				layer.line(-2,9,2,9)
				layer.line(0,-9,0,-11)
				layer.line(-9,0,-11,0)
				layer.line(9,0,11,0)
				layer.stroke(40,120,60,this.fade)
				layer.strokeWeight(2)
				layer.arc(0,0,18,18,240,300)
			break
			case 94:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,12,1,24)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,9,1,18)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,6,1,12)
				layer.fill(250,125,0,this.fade)
				layer.ellipse(0,0,6,3)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,3,4)
			break
			case 95:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,12)
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade)
				layer.ellipse(0,0,6)
				layer.triangle(0,0,-1,-5,1,-5)
				layer.triangle(0,0,-1,5,1,5)
			break
			case 96:
				layer.rotate(this.spin)
				layer.stroke(75,225,175,this.fade)
				layer.strokeWeight(3)
				layer.noFill()
				layer.ellipse(0,-2.5,12,12)
				layer.stroke(75,225,175,this.fade*0.5)
				layer.strokeWeight(4)
				layer.ellipse(0,-2.5,12,12)
				layer.strokeWeight(3)
				layer.stroke(200-this.crit*200,200+this.crit*50,200+this.crit*50,this.fade)
				layer.arc(0,0,18,18,-60,240)
				layer.line(-9,2,-9,-2)
				layer.line(9,2,9,-2)
				layer.line(-2,9,2,9)
				layer.stroke(40,120,60,this.fade)
				layer.strokeWeight(2)
				layer.arc(0,0,18,18,240,300)
				layer.arc(4,-9,8,6,-180,-90)
				layer.arc(-4,-9,8,6,-90,0)
			break
			case 97:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,4)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,8)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,12)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,24)
			break
			case 98:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250-this.crit*250,250,250,this.fade)
				layer.ellipse(0,0,8)
				layer.fill(240,140,40,this.fade)
				layer.rect(0,0,4)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,180-this.fade*180)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,120-this.fade*120)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,60-this.fade*60)
				}
			break
			case 99:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,3)
				layer.noFill()
				layer.strokeWeight(1)
				layer.stroke(250,this.fade)
				layer.ellipse(0,0,5)
			break
			case 101:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(120,120+this.crit*200,120+this.crit*200,this.fade)
				layer.ellipse(0,0,8,27)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,360-this.fade*360)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,240-this.fade*240)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,120-this.fade*120)
				}
			break
			case 102:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*240,240,240,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(200-this.crit*200,200,200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(160-this.crit*160,160,160,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(200,250,250,this.fade)
				layer.ellipse(0,0,8)
			break
			case 103:
				layer.stroke(255-this.crit*150,100+this.crit*150,100+this.crit*150,this.fade)
				layer.strokeWeight(4)
				layer.noFill()
				layer.ellipse(0,0,120)
				for(let a=0,la=this.shocks.length;a<la;a++){
					layer.stroke(255,100,100,this.fade*this.shocks[a][2])
					layer.line(
						lsin(this.shocks[a][0])*48,
						lcos(this.shocks[a][0])*48,
						lsin(this.shocks[a][1])*24,
						lcos(this.shocks[a][1])*24
					)
				}
			break
			case 104:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(175,this.fade)
				regStar(layer,0,0,9,8,8,4,4,0)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,8)
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade)
				layer.rect(0,0,4)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,180-this.fade*180)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,120-this.fade*120)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,60-this.fade*60)
				}
			break
			case 105:
				layer.fill(240-this.crit*200,60,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,40,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,20,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,3)
				layer.rect(0,-1,2)
			break
			case 106: case 169: case 170:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,1.5)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,3)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,4.5)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,6)
			break
			case 107:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,1.5)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,3)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,4.5)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,9)
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade)
				layer.ellipse(0,0,3)
			break
			case 108:
				layer.rotate(this.spin)
				layer.stroke(75,225,175,this.fade)
				layer.strokeWeight(2.25)
				layer.noFill()
				layer.ellipse(0,-1.875,9,9)
				layer.stroke(75,225,175,this.fade*0.5)
				layer.strokeWeight(3)
				layer.ellipse(0,-1.875,9,9)
				layer.strokeWeight(2.25)
				layer.stroke(200-this.crit*200,200+this.crit*50,200+this.crit*50,this.fade)
				layer.arc(0,0,13.5,13.5,-60,240)
				layer.line(-7.75,1.5,-7.75,-1.5)
				layer.line(7.75,1.5,7.75,-1.5)
				layer.line(-1.5,7.75,1.5,7.75)
				layer.stroke(40,120,60,this.fade)
				layer.strokeWeight(1.5)
				layer.arc(0,0,13.5,13.5,240,300)
			break
			case 109:
				layer.fill(240-this.crit*200,120,this.crit*200,this.fade*this.time/this.base.time)
				layer.ellipse(0,0,45*(1-this.time/this.base.time))
				layer.fill(240-this.crit*200,180,this.crit*200,this.fade*this.time/this.base.time)
				layer.ellipse(0,0,22.5*(1-this.time/this.base.time))
			break
			case 110:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,1.5)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,3)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,4.5)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,6)
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade)
				layer.rect(0,0,3)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,135-this.fade*135)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,90-this.fade*90)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,45-this.fade*45)
				}
			break
			case 111:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				regTriangle(layer,0,0,10,10,this.position.x+this.timer)
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade)
				layer.ellipse(0,0,4)
			break
			case 112:
				layer.noFill()
				layer.strokeWeight(1)
				layer.stroke(240-this.crit*120,40+this.crit*200,40+this.crit*200,this.fade)
				layer.rect(0,4,2,8)
				layer.stroke(240-this.crit*160,80+this.crit*200,80+this.crit*200,this.fade)
				layer.rect(0,3,2,6)
				layer.stroke(240-this.crit*200,120+this.crit*200,120+this.crit*200,this.fade)
				layer.rect(0,2,2,4)
				layer.stroke(250,this.fade)
				layer.ellipse(0,0,3)
			break
			case 113:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,6)
				regStar(layer,0,0,3,2,2,8,8,this.direction+this.position.x)
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade*min(1,this.timer/150))
				layer.ellipse(0,0,3)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,180-this.fade*180)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,120-this.fade*120)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,60-this.fade*60)
				}
			break
			case 114:
				layer.rotate(-this.direction)
				if(this.crit==1){
					layer.fill(50,255,255,this.fade*0.5)
					layer.ellipse(0,0,10)
				}
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,250,250,this.fade)
				layer.ellipse(0,0,6)
				regStar(layer,0,0,3,2,2,8,8,this.direction+this.position.x)
			break
			case 115:
				layer.rotate(-this.direction)
				if(this.crit==1){
					layer.fill(50,255,255,this.fade*0.5)
					layer.ellipse(0,0,10)
				}
				layer.fill(240-this.crit*240,240,240,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(200-this.crit*200,200,200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(160-this.crit*160,160,160,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(200,250,250,this.fade)
				layer.ellipse(0,0,6)
				regStar(layer,0,0,3,2,2,8,8,this.direction+this.position.x)
			break
			case 116:
				layer.rotate(-this.direction)
				if(this.crit==1){
					layer.fill(50,255,255,this.fade*0.5)
					layer.ellipse(0,0,10)
				}
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,4.5)
				regStar(layer,0,0,3,1.5,1.5,6,6,this.direction+this.position.x)
			break
			case 117:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,6)
				regStar(layer,0,0,3,2,2,8,8,this.direction+this.position.x)
				layer.fill(100,100+this.crit*150,100+this.crit*150,this.fade)
				regStar(layer,0,0,4,1,1,4,4,this.direction+this.position.x)
			break
			case 118:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				regTriangle(layer,0,0,10,10,this.position.x+this.timer)
			break
			case 119: case 145:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,1.2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,2.4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,3.6)
				layer.fill(250,this.fade)
				regTriangle(layer,0,0,5,5,this.position.x+this.timer)
			break
			case 120:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.rotate(this.direction)
				layer.fill(100,100+this.crit*150,100+this.crit*150,this.fade)
				layer.rect(0,0,10,24)
				layer.fill(250,this.fade)
				regPoly(layer,0,0,8,10,10,22.5)
			break
			case 121:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,1.5)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,3)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,4.5)
				layer.fill(250,this.fade)
				regTriangle(layer,0,0,6,6,this.position.x+this.timer)
				layer.fill(100,this.fade)
				regTriangle(layer,0,0,3,3,this.position.x+this.timer+60)
			break
			case 122:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				regTriangle(layer,0,0,10,10,this.position.x+this.timer)
				layer.fill(252,130,8,this.fade)
				regTriangle(layer,0,0,6,6,this.position.x+this.timer)
			break
			case 123:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				regTriangle(layer,0,0,10,10,this.position.x+this.timer)
				layer.fill(231,137,109,this.fade)
				regTriangle(layer,0,0,6,6,this.position.x+this.timer)
			break
			case 124:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				regTriangle(layer,0,0,8,8,this.position.x+this.timer)
			break
			case 125:
				if(this.crit==1){
					layer.fill(100,250,250,this.fade*0.5)
					layer.ellipse(0,0,28)
				}
				layer.fill(250,this.fade)
				layer.ellipse(0,0,20)
			break
			case 126:
				if(this.crit==1){
					layer.fill(100,250,250,this.fade*0.5)
					layer.ellipse(0,0,28)
				}
				layer.fill(50,this.fade)
				layer.rect(0,-10,8,8)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,20)
			break
			case 127:
				layer.noFill()
				if(this.crit==1){
					layer.stroke(100,250,250,this.fade*0.5)
					layer.strokeWeight(10)
					layer.ellipse(0,0,13)
				}
				layer.stroke(250,this.fade)
				layer.strokeWeight(6)
				layer.ellipse(0,0,13)
			break
			case 128:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				regTriangle(layer,0,0,10,10,this.position.x+this.timer)
				layer.fill(36,8,144,this.fade)
				regTriangle(layer,0,0,6,6,this.position.x+this.timer)
			break
			case 129:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				regTriangle(layer,0,0,10,10,this.position.x+this.timer)
				layer.fill(225,55,73,this.fade)
				regTriangle(layer,0,0,6,6,this.position.x+this.timer)
			break
			case 130:
				if(this.crit==1){
					layer.fill(100,250,250,this.fade*0.5)
					layer.ellipse(0,0,21)
				}
				layer.fill(250,this.fade)
				layer.ellipse(0,0,15)
			break
			case 131:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,8+16*this.timer/this.base.time)
			break
			case 132:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,1.2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,2.4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,3.6)
				layer.fill(250,this.fade)
				layer.rotate(this.position.x+this.timer)
				layer.rect(0,0,6)
			break
			case 133:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,3)
				layer.triangle(-1,0,1,0,0,-4)
			break
			case 134:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,3)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,9)
				layer.rotate(this.timer)
				layer.fill(125,this.fade)
				layer.ellipse(0,-10,8)
				layer.ellipse(0,10,8)
				layer.ellipse(-10,0,8)
				layer.ellipse(10,0,8)
				layer.fill(250,this.fade)
				layer.rect(0,0,20)
			break
			case 137:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				regTriangle(layer,0,0,10,10,this.position.x+this.timer)
				layer.fill(50,25,50,this.fade)
				regTriangle(layer,0,0,8,8,this.position.x+this.timer)
				layer.fill(250,this.fade)
				regTriangle(layer,0,0,5,5,this.position.x+this.timer)
			break
			case 138:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,3)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,9)
				layer.rotate(this.timer)
				layer.fill(125,this.fade)
				layer.triangle(-6,-10,0,-10,-3,-18)
				layer.triangle(6,-10,0,-10,3,-18)
				layer.triangle(-6,10,0,10,-3,18)
				layer.triangle(6,10,0,10,3,18)
				layer.triangle(-10,-6,-10,0,-18,-3)
				layer.triangle(-10,6,-10,0,-18,3)
				layer.triangle(10,-6,10,0,18,-3)
				layer.triangle(10,6,10,0,18,3)
				layer.fill(250,this.fade)
				layer.rect(0,0,20)
			break
			case 139:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				regTriangle(layer,0,0,10,10,this.position.x+this.timer)
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade)
				layer.ellipse(0,0,3)
				layer.rect(0,-1,6,1)
				layer.rect(0,1,6,1)
			break
			case 140:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				regTriangle(layer,0,0,10,10,this.position.x+this.timer)
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade)
				layer.ellipse(0,0,3)
				layer.rect(0,0,5,1)
				layer.rect(0,0,1,5)
			break
			case 141:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				regTriangle(layer,0,0,10,10,this.position.x+this.timer)
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade)
				layer.ellipse(0,0,3)
				layer.rect(0,0,7,1)
				layer.rect(0,0,5,2)
			break
			case 142:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				regTriangle(layer,0,0,10,10,this.position.x+this.timer)
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade)
				layer.ellipse(0,0,3)
				layer.rect(-1.5,0,3,1)
				layer.rect(0,-1.5,1,3)
				layer.rotate(-45)
				layer.rect(0,-1.5,1,3)
			break
			case 143:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,1.5)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,3)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,4.5)
				layer.fill(250,this.fade)
				regTriangle(layer,0,0,7.5,7.5,this.position.x+this.timer)
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade)
				layer.ellipse(0,0,3)
			break
			case 144:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				regTriangle(layer,0,0,10,10,this.position.x+this.timer)
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade)
				layer.ellipse(0,0,4)
				layer.stroke(250,this.fade)
				layer.strokeWeight(2)
				layer.noFill()
				layer.ellipse(0,0,24)
			break
			case 146:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,10)
				regStar(layer,0,0,4,3,3,10,10,this.direction+this.position.x)
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade*min(1,this.timer/150))
				layer.ellipse(0,-3,2)
				layer.ellipse(0,3,2)
				layer.ellipse(-3,0,2)
				layer.ellipse(3,0,2)
			break
			case 147:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,1.5)
				layer.fill(240-this.crit*200,120,40+this.crit*200,this.fade)
				layer.ellipse(this.past[6][0]-this.position.x,this.past[6][1]-this.position.y,3)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,5)
			break
			case 148:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(250,250,0,this.fade)
				layer.triangle(-1,0,1,0,0,-4)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,3)
			break
			case 149:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(255,125,0,this.fade)
				layer.triangle(-1,0,1,0,0,-4)
				layer.fill(255,50,0,this.fade)
				layer.triangle(-1,0,1,0,0,4)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,3)
			break
			case 150:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4*this.speed/this.base.speed,1,8*this.speed/this.base.speed)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3*this.speed/this.base.speed,1,6*this.speed/this.base.speed)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2*this.speed/this.base.speed,1,4*this.speed/this.base.speed)
				layer.fill(200,175,250,this.fade)
				layer.triangle(-1,0,1,0,0,-4)
				layer.triangle(-1,0,1,0,0,4)
				layer.triangle(0,-1,0,1,-4,0)
				layer.triangle(0,-1,0,1,4,0)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,3)
			break
			case 151:
				layer.fill(240-this.crit*240,240,240,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(200-this.crit*200,200,200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(160-this.crit*160,160,160,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(200,250,250,this.fade)
				layer.ellipse(0,0,3)
			break
			case 152:
				layer.fill(160-this.crit*160,160+this.crit*40,160+this.crit*40,this.fade*this.time/this.base.time)
				layer.ellipse(0,0,60*(1-this.time/this.base.time))
				layer.fill(220-this.crit*220,220+this.crit*40,220+this.crit*40,this.fade*this.time/this.base.time)
				layer.ellipse(0,0,30*(1-this.time/this.base.time))
			break
			case 153:
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,360-this.fade*360)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,240-this.fade*240)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,120-this.fade*120)
				}
			break
			case 154:
				if(this.crit==1){
					layer.fill(100,250,250,this.fade*0.5)
					layer.ellipse(0,0,28)
				}
				layer.rotate(this.time*5)
				layer.fill(50,this.fade)
				layer.rect(0,-10,6,6)
				layer.rect(0,10,6,6)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,20)
			break
			case 155:
				layer.rotate(-15)
				layer.fill(40,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(40,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(40,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.rotate(30)
				layer.fill(40,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(40,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(40,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(150,250,150,this.fade)
				layer.ellipse(0,0,3)
			break
			case 156:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,6)
				regStar(layer,0,0,3,2,2,8,8,this.direction+this.position.x)
				layer.fill(100-this.crit*100,this.crit*150,this.crit*150,this.fade*min(1,this.timer/150))
				layer.ellipse(0,0,3)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,216-this.fade*216)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,144-this.fade*144)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,72-this.fade*72)
				}
			break
			case 157:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				regTriangle(layer,0,0,10,10,this.position.x+this.timer)
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade)
				layer.ellipse(0,0,6)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,5)
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade)
				layer.ellipse(0,0,3)
			break
			case 158:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				regTriangle(layer,0,0,12,12,this.position.x+this.timer)
				layer.beginShape()
				for(let a=0,la=3;a<la;a++){
					layer.vertex(lsin(this.position.x+this.timer+a*120+45)*10,lcos(this.position.x+this.timer+a*120+45)*10)
					layer.vertex(lsin(this.position.x+this.timer+a*120+75)*10,lcos(this.position.x+this.timer+a*120+75)*10)
				}
				layer.endShape()
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade)
				layer.ellipse(0,0,3)
				layer.rect(-1.5,0,3,1)
				layer.rect(0,-1.5,1,3)
				layer.rotate(-45)
				layer.rect(0,-1.5,1,3)
			break
			case 159:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				regTriangle(layer,0,0,12,12,this.position.x+this.timer)
				layer.beginShape()
				for(let a=0,la=3;a<la;a++){
					layer.vertex(lsin(this.position.x+this.timer+a*120+45)*10,lcos(this.position.x+this.timer+a*120+45)*10)
					layer.vertex(lsin(this.position.x+this.timer+a*120+75)*10,lcos(this.position.x+this.timer+a*120+75)*10)
				}
				layer.endShape()
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade)
				layer.ellipse(0,0,3)
				layer.rect(0,0,7,1)
				layer.rect(0,0,5,2)
			break
			case 160:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				regTriangle(layer,0,0,12,12,this.position.x+this.timer	)
				layer.beginShape()
				for(let a=0,la=3;a<la;a++){
					layer.vertex(lsin(this.position.x+this.timer+a*120+45)*10,lcos(this.position.x+this.timer+a*120+45)*10)
					layer.vertex(lsin(this.position.x+this.timer+a*120+75)*10,lcos(this.position.x+this.timer+a*120+75)*10)
				}
				layer.endShape()
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade)
				layer.ellipse(0,0,3)
				layer.rect(0,-1,6,1)
				layer.rect(0,1,6,1)
			break
			case 161:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				regTriangle(layer,0,0,12,12,this.position.x+this.timer)
				layer.beginShape()
				for(let a=0,la=3;a<la;a++){
					layer.vertex(lsin(this.position.x+this.timer+a*120+45)*10,lcos(this.position.x+this.timer+a*120+45)*10)
					layer.vertex(lsin(this.position.x+this.timer+a*120+75)*10,lcos(this.position.x+this.timer+a*120+75)*10)
				}
				layer.endShape()
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade)
				layer.ellipse(0,0,3)
				layer.rect(0,0,5,1)
				layer.rect(0,0,1,5)
			break
			case 162:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,3)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,9)
				layer.rotate(this.timer)
				layer.fill(125,this.fade)
				layer.quad(-6,-10,-8,-14,8,-14,6,-10)
				layer.quad(-6,10,-8,14,8,14,6,10)
				layer.quad(-10,-6,-14,-8,-14,8,-10,6)
				layer.quad(10,-6,14,-8,14,8,10,6)
				layer.fill(250,this.fade)
				layer.rect(0,0,20)
			break
			case 163:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,3)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,9)
				layer.rotate(this.timer)
				layer.fill(125,this.fade)
				layer.ellipse(0,-10,8)
				layer.ellipse(0,10,8)
				layer.ellipse(-10,0,8)
				layer.ellipse(10,0,8)
				layer.fill(250,this.fade)
				layer.rect(0,0,20)
				layer.fill(25,225250,this.fade)
				layer.rect(0,0,8)
			break
			case 164:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,3)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,9)
				layer.rotate(this.timer)
				layer.fill(125,this.fade)
				for(let a=0,la=3;a<la;a++){
					layer.quad(-4.5,-10,-6,-13,6,-13,4.5,-10)
					layer.rotate(30)
					layer.ellipse(0,-11,6)
					layer.rotate(30)
				}
				layer.fill(250,this.fade)
				layer.ellipse(0,0,22)
			break
			case 165:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,3)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,9)
				layer.rotate(this.timer)
				layer.fill(125,this.fade)
				layer.ellipse(0,-10,8)
				layer.ellipse(0,10,8)
				layer.ellipse(-10,0,8)
				layer.ellipse(10,0,8)
				layer.fill(250,this.fade)
				layer.rect(0,0,20)
				layer.fill(125,this.fade)
				layer.ellipse(0,0,8)
			break
			case 166:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade)
				layer.triangle(-3,-1,-3,1,-6,0)
				layer.triangle(3,-1,3,1,6,0)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,8)
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade)
				layer.rect(0,0,4)
				if(!this.active&&this.fade<1){
					layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
					layer.ellipse(0,0,270-this.fade*270)
					layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
					layer.ellipse(0,0,180-this.fade*180)
					layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
					layer.ellipse(0,0,90-this.fade*90)
				}
			break
			case 167:
				layer.fill(240-this.crit*240,240,240,this.fade)
				layer.rect(0,0,4,30)
				layer.fill(200-this.crit*200,200,200,this.fade)
				layer.rect(0,0,3,30)
				layer.fill(160-this.crit*160,160,160,this.fade)
				layer.rect(0,0,2,30)
				layer.fill(200,250,250,this.fade)
				layer.rect(0,0,1,30)
			break
			case 168:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,0.9)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,1.8)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,2.7)
				layer.fill(250,this.fade)
				regTriangle(layer,0,0,3.75,3.75,this.position.x+this.timer)
			break
			case 171:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				regTriangle(layer,0,0,10,10,this.position.x+this.timer)
				layer.fill(139,254,106,this.fade)
				regTriangle(layer,0,0,6,6,this.position.x+this.timer)
			break
			case 172:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,1.2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,2.4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,3.6)
				layer.fill(250,this.fade)
				regTriangle(layer,0,0,5,5,this.position.x+this.timer)
				layer.fill(50,150,200,this.fade)
				regTriangle(layer,0,0,3,3,this.position.x+this.timer)
			break
			case 173:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,2,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,3,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,4,4)
				layer.fill(50,this.fade)
				layer.rect(0,-4,3,3)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,12)
			break
			case 174:
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.rect(0,4,1,8)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.rect(0,3,1,6)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.rect(0,2,1,4)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,9)
				layer.fill(50,this.fade)
				layer.ellipse(0,0,3)
			break
			case 175:
				layer.fill(240-this.crit*240,240,240,this.fade)
				layer.rect(0,12,1,24)
				layer.fill(200-this.crit*200,200,200,this.fade)
				layer.rect(0,9,1,18)
				layer.fill(160-this.crit*160,160,160,this.fade)
				layer.rect(0,6,1,12)
				layer.fill(200,250,250,this.fade)
				layer.ellipse(0,0,3,4)
			break
			case 176:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,1)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,2)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,3)
				layer.fill(250,this.fade)
				regPoly(layer,0,0,16,2,2,0)
			break
			case 177:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.rotate(this.direction)
				layer.fill(100,100+this.crit*150,100+this.crit*150,this.fade)
				for(let a=0,la=3;a<la;a++){
					layer.rect(0,-6,6,12)
					layer.rotate(60)
					layer.quad(-2,-6,2,-6,6,-11,-6,-11)
					layer.rotate(60)
				}
				layer.fill(250,this.fade)
				regPoly(layer,0,0,8,10,10,22.5)
			break
			case 178:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.rotate(this.direction)
				layer.fill(100,100+this.crit*150,100+this.crit*150,this.fade)
				for(let a=0,la=3;a<la;a++){
					layer.rect(0,-6,6,12)
					layer.rect(0,-7,3,14)
					layer.rotate(120)
				}
				layer.fill(250,this.fade)
				regPoly(layer,0,0,8,10,10,22.5)
			break
			case 179:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.rotate(this.direction)
				layer.fill(100,100+this.crit*150,100+this.crit*150,this.fade)
				for(let a=0,la=3;a<la;a++){
					layer.rect(0,-6,6,12)
					layer.rotate(60)
					layer.triangle(-3,-5,3,-5,0,-15)
					layer.rotate(60)
				}
				layer.fill(250,this.fade)
				regPoly(layer,0,0,8,10,10,22.5)
			break
			case 180:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.rotate(this.direction)
				layer.fill(100,100+this.crit*150,100+this.crit*150,this.fade)
				layer.rect(0,0,4,16)
				layer.fill(250,this.fade)
				regPoly(layer,0,0,8,20/3,20/3,22.5)
			break
			case 181:
				if(this.crit==1){
					layer.fill(50,255,255,this.fade*0.5)
					layer.ellipse(0,0,14)
				}
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.fill(250,this.fade)
				layer.ellipse(0,0,10)
				regStar(layer,0,0,4,3,3,10,10,this.direction+this.position.x)
			break
			case 182:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.rotate(this.direction)
				layer.fill(100,100+this.crit*150,100+this.crit*150,this.fade)
				for(let a=0,la=3;a<la;a++){
					layer.rect(0,-6,6,12)
					layer.rotate(120)
				}
				layer.fill(250,this.fade)
				regPoly(layer,0,0,8,10,10,22.5)
			break
			case 183:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,1.5)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,3)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,4.5)
				layer.rotate(this.direction)
				layer.fill(100,100+this.crit*150,100+this.crit*150,this.fade)
				for(let a=0,la=3;a<la;a++){
					layer.rect(0,-4.5,4.5,9)
					layer.rotate(120)
				}
				layer.fill(250,this.fade)
				regPoly(layer,0,0,8,7.5,7.5,22.5)
			break
			case 184:
				layer.rotate(-this.direction)
				layer.fill(240-this.crit*200,240,40+this.crit*200,this.fade)
				layer.ellipse(this.past[0][0]-this.position.x,this.past[0][1]-this.position.y,2)
				layer.fill(240-this.crit*200,160,40+this.crit*200,this.fade)
				layer.ellipse(this.past[4][0]-this.position.x,this.past[4][1]-this.position.y,4)
				layer.fill(240-this.crit*200,80,40+this.crit*200,this.fade)
				layer.ellipse(this.past[8][0]-this.position.x,this.past[8][1]-this.position.y,6)
				layer.rotate(atan2(this.velocity.x,-this.velocity.y))
				layer.fill(100,this.fade)
				layer.rect(-2,-8,3,8)
				layer.rect(2,-8,3,8)
				layer.quad(-4,-5,4,-5,6,-9,-6,-9)
				layer.fill(250,this.fade)
				regTriangle(layer,0,0,10,10,0)
			break
			case 185:
				layer.rotate(this.position.x)
				layer.fill(100,this.fade)
				for(let a=0,la=3;a<la;a++){
					layer.rect(0,-10,8,6)
					layer.quad(-4,-13,4,-13,6,-16,-6,-16)
					layer.rotate(120)
				}
				layer.fill(250,this.fade)
				layer.ellipse(0,0,20)
				layer.fill(250-this.crit*200,this.crit*200,this.crit*200,this.fade)
				layer.ellipse(0,0,6)
			break

        }
        layer.pop()
    }
	explode(){
		this.exploded=true
		switch(this.type){
			case 2: case 26: case 31: case 32: case 41: case 48: case 80:
				for(let b=0,lb=entities.players.length;b<lb;b++){
					let c=dist(this.position.x,this.position.y,entities.players[b].position.x,entities.players[b].position.y)
					if(entities.players[b].life>0&&c<120&&((this.id==0?1:0)!=(entities.players[b].id==0?1:0)||this.id==-1||game.pvp)){
						entities.players[b].takeDamage(this.damage*(1-c/120)*0.8*constrain(1.2-this.timer/this.base.time*6,0.2,1))
						entities.players[b].die.killer=this.index
						entities.players[b].collect.time=450
						if(game.invis){
							entities.players[b].visible=15
						}
					}
				}
			break
			case 3:
				for(let b=0,lb=entities.players.length;b<lb;b++){
					let c=dist(this.position.x,this.position.y,entities.players[b].position.x,entities.players[b].position.y)
					if(entities.players[b].life>0&&c<240&&((this.id==0?1:0)!=(entities.players[b].id==0?1:0)||this.id==-1||game.pvp)){
						entities.players[b].takeDamage(this.damage*(1-c/240))
						entities.players[b].die.killer=this.index
						entities.players[b].collect.time=450
						if(game.invis){
							entities.players[b].visible=15
						}
					}
				}
			break
			case 16:
				for(let b=0,lb=entities.players.length;b<lb;b++){
					let c=dist(this.position.x,this.position.y,entities.players[b].position.x,entities.players[b].position.y)
					if(entities.players[b].life>0&&c<120&&((this.id==0?1:0)!=(entities.players[b].id==0?1:0)||this.id==-1||game.pvp)){
						entities.players[b].takeDamage(this.damage*(1-c/120)*0.8*constrain(1.2-this.timer/this.base.time*6,0.2,1))
						entities.players[b].die.killer=this.index
						entities.players[b].collect.time=450
						if(game.invis){
							entities.players[b].visible=15
						}
						entities.players[b].velocity.x+=30*(1.5-c/120)*lsin(atan2(entities.players[b].position.x-this.position.x,this.position.y-entities.players[b].position.y))
						entities.players[b].velocity.y-=30*(1.5-c/120)*lcos(atan2(entities.players[b].position.x-this.position.x,this.position.y-entities.players[b].position.y))
					}
				}
			break
			case 21: case 53:
				for(let b=0,lb=entities.players.length;b<lb;b++){
					let c=dist(this.position.x,this.position.y,entities.players[b].position.x,entities.players[b].position.y)
					if(entities.players[b].life>0&&c<120&&((this.id==0?1:0)!=(entities.players[b].id==0?1:0)||this.id==-1||game.pvp)){
						entities.players[b].takeDamage(this.damage*(1-c/120)*0.8*constrain(1.2-this.timer/this.base.time*6,0.2,1))
						entities.players[b].die.killer=this.index
						entities.players[b].collect.time=450
						if(game.invis){
							entities.players[b].visible=15
						}
						for(let d=0,ld=entities.players.length;d<ld;d++){
							if(entities.players[d].index==this.index){
								entities.players[d].life=min(entities.players[d].life+this.damage*(1-c/120)*0.8,entities.players[d].base.life)
							}
						}
					}
				}
			break
			case 22: case 58:
				for(let b=0,lb=entities.players.length;b<lb;b++){
					let c=dist(this.position.x,this.position.y,entities.players[b].position.x,entities.players[b].position.y)
					if(entities.players[b].life>0&&c<240&&((this.id==0?1:0)!=(entities.players[b].id==0?1:0)||this.id==-1||game.pvp)){
						entities.players[b].takeDamage(this.damage*(1-c/240)*0.8*constrain(1.2-this.timer/this.base.time*6,0.2,1))
						entities.players[b].die.killer=this.index
						entities.players[b].collect.time=450
						if(game.invis){
							entities.players[b].visible=15
						}
					}
				}
			break
			case 27:
				for(let b=0,lb=entities.players.length;b<lb;b++){
					let c=dist(this.position.x,this.position.y,entities.players[b].position.x,entities.players[b].position.y)
					if(entities.players[b].life>0&&c<240&&((this.id==0?1:0)!=(entities.players[b].id==0?1:0)||this.id==-1||game.pvp)&&!(this.id==-1&&entities.players[b].id>0)){
						entities.players[b].takeDamage(this.damage*(1-c/240)*0.8*constrain(1.2-this.timer/this.base.time*6,0.2,1))
						entities.players[b].die.killer=this.index
						entities.players[b].collect.time=450
						if(game.invis){
							entities.players[b].visible=15
						}
						entities.players[b].velocity.x+=20*(1.5-c/240)*lsin(atan2(entities.players[b].position.x-this.position.x,this.position.y-entities.players[b].position.y))
						entities.players[b].velocity.y-=20*(1.5-c/240)*lcos(atan2(entities.players[b].position.x-this.position.x,this.position.y-entities.players[b].position.y))
					}
				}
			break
			case 30: case 166:
				for(let b=0,lb=entities.players.length;b<lb;b++){
					let c=dist(this.position.x,this.position.y,entities.players[b].position.x,entities.players[b].position.y)
					if(entities.players[b].life>0&&c<100&&((this.id==0?1:0)!=(entities.players[b].id==0?1:0)||this.id==-1||game.pvp)){
						entities.players[b].takeDamage(this.damage*(1-c/100)*0.8)
						entities.players[b].die.killer=this.index
						entities.players[b].collect.time=450
						if(game.invis){
							entities.players[b].visible=15
						}
					}
				}
			break
			case 45: case 54:
				for(let b=0,lb=entities.players.length;b<lb;b++){
					let c=dist(this.position.x,this.position.y,entities.players[b].position.x,entities.players[b].position.y)
					if(entities.players[b].life>0&&c<120&&((this.id==0?1:0)!=(entities.players[b].id==0?1:0)||this.id==-1||game.pvp)){
						entities.players[b].takeDamage(this.damage*(1-c/120)*0.8*constrain(1.2-this.timer/this.base.time*6,0.2,1))
						entities.players[b].die.killer=this.index
						entities.players[b].collect.time=450
						if(game.invis){
							entities.players[b].visible=15
						}
					}
				}
				for(let b=0,lb=10;b<lb;b++){
					entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,6,random(0,360),this.id,this.base.damage/6,10,this.crit,this.index))
				}
			break
			case 47: case 78:
				for(let b=0,lb=entities.players.length;b<lb;b++){
					let c=dist(this.position.x,this.position.y,entities.players[b].position.x,entities.players[b].position.y)
					if(entities.players[b].life>0&&c<120&&((this.id==0?1:0)!=(entities.players[b].id==0?1:0)||this.id==-1||game.pvp)){
						entities.players[b].takeDamage(this.damage*(1-c/120)*0.8*constrain(1.2-this.timer/this.base.time*6,0.2,1))
						entities.players[b].die.killer=this.index
						entities.players[b].collect.time=450
						entities.players[b].stunTime=max(entities.players[b].stunTime,90)
						if(game.invis){
							entities.players[b].visible=15
						}
					}
				}
			break
			case 55:
				for(let b=0,lb=entities.players.length;b<lb;b++){
					let c=dist(this.position.x,this.position.y,entities.players[b].position.x,entities.players[b].position.y)
					if(entities.players[b].life>0&&c<180&&((this.id==0?1:0)!=(entities.players[b].id==0?1:0)||this.id==-1||game.pvp)){
						entities.players[b].takeDamage(this.damage*(1-c/180)*0.8*constrain(1.2-this.timer/this.base.time*6,0.2,1))
						entities.players[b].die.killer=this.index
						entities.players[b].collect.time=450
						if(game.invis){
							entities.players[b].visible=15
						}
						entities.players[b].velocity.x+=25*(1.5-c/180)*lsin(atan2(entities.players[b].position.x-this.position.x,this.position.y-entities.players[b].position.y))
						entities.players[b].velocity.y-=25*(1.5-c/180)*lcos(atan2(entities.players[b].position.x-this.position.x,this.position.y-entities.players[b].position.y))
					}
				}
			break
			case 56:
				for(let b=0,lb=entities.players.length;b<lb;b++){
					let c=dist(this.position.x,this.position.y,entities.players[b].position.x,entities.players[b].position.y)
					if(entities.players[b].life>0&&c<120&&((this.id==0?1:0)!=(entities.players[b].id==0?1:0)||this.id==-1||game.pvp)){
						entities.players[b].takeDamage(this.damage*(1-c/120)*0.8*constrain(1.2-this.timer/this.base.time*6,0.2,1))
						entities.players[b].die.killer=this.index
						entities.players[b].collect.time=450
						entities.players[b].velocity.y-=this.speed*abs(lsin(this.direction)*3)
						if(game.invis){
							entities.players[b].visible=15
						}
					}
				}
			break
			case 60:
				for(let b=0,lb=entities.players.length;b<lb;b++){
					let c=dist(this.position.x,this.position.y,entities.players[b].position.x,entities.players[b].position.y)
					if(entities.players[b].life>0&&c<100&&((this.id==0?1:0)!=(entities.players[b].id==0?1:0)||this.id==-1||game.pvp)){
						entities.players[b].takeDamage(this.damage*(1-c/100)*0.8*(this.id==-1&&entities.players[b].id>0?(this.timer<5?0.1:0.5):1))
						entities.players[b].die.killer=this.index
						entities.players[b].collect.time=450
						if(game.invis){
							entities.players[b].visible=15
						}
					}
				}
				for(let b=0,lb=10;b<lb;b++){
					entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,6,random(0,360),this.id,this.base.damage/(this.timer<5?10:5),10,this.crit,this.index))
				}
			break
			case 64:
				for(let b=0,lb=entities.players.length;b<lb;b++){
					let c=dist(this.position.x,this.position.y,entities.players[b].position.x,entities.players[b].position.y)
					if(entities.players[b].life>0&&c<120&&((this.id==0?1:0)!=(entities.players[b].id==0?1:0)||this.id==-1||game.pvp)){
						entities.players[b].takeDamage(this.damage*(1-c/120)*0.8*constrain(1.2-this.timer/this.base.time*6,0.2,1))
						entities.players[b].die.killer=this.index
						entities.players[b].collect.time=450
						entities.players[b].confuseTime=max(entities.players[b].confuseTime,240)
						if(game.invis){
							entities.players[b].visible=15
						}
					}
				}
			break
			case 65:
				for(let b=0,lb=entities.players.length;b<lb;b++){
					let c=dist(this.position.x,this.position.y,entities.players[b].position.x,entities.players[b].position.y)
					if(entities.players[b].life>0&&c<200&&((this.id==0?1:0)!=(entities.players[b].id==0?1:0)||this.id==-1||game.pvp)&&!(this.id==-1&&entities.players[b].id>0)){
						entities.players[b].takeDamage(this.damage*(1-c/200)*0.8)
						entities.players[b].die.killer=this.index
						entities.players[b].collect.time=450
						if(game.invis){
							entities.players[b].visible=15
						}
						entities.players[b].velocity.x+=20*(1.5-c/200)*lsin(atan2(entities.players[b].position.x-this.position.x,this.position.y-entities.players[b].position.y))
						entities.players[b].velocity.y-=20*(1.5-c/200)*lcos(atan2(entities.players[b].position.x-this.position.x,this.position.y-entities.players[b].position.y))
					}
				}
			break
			case 66:
				for(let b=0,lb=entities.players.length;b<lb;b++){
					let c=dist(this.position.x,this.position.y,entities.players[b].position.x,entities.players[b].position.y)
					if(entities.players[b].life>0&&c<120&&((this.id==0?1:0)!=(entities.players[b].id==0?1:0)||this.id==-1||game.pvp)){
						entities.players[b].takeDamage(this.damage*(1-c/120)*0.4*constrain(1.2-this.timer/this.base.time*6,0.2,1))
						entities.players[b].die.killer=this.index
						entities.players[b].collect.time=450
						if(game.invis){
							entities.players[b].visible=15
						}
					}
				}
				let turn=floor(random(0,72))
				for(let b=0,lb=5;b<lb;b++){
					entities.projectiles.push(new projectile(this.layer,this.previous.position.x,this.previous.position.y,5,this.direction+b*72+turn,this.id,this.base.damage/5*constrain(1.2-this.timer/this.base.time*6,0.2,1),120,this.crit,this.index))
				}
				for(let b=0,lb=5;b<lb;b++){
					entities.projectiles.push(new projectile(this.layer,this.previous.position.x,this.previous.position.y,5,this.direction+b*72+turn+36,this.id,this.base.damage/5*constrain(1.2-this.timer/this.base.time*6,0.2,1),120,this.crit,this.index))
					entities.projectiles[entities.projectiles.length-1].velocity.x*=1.5
					entities.projectiles[entities.projectiles.length-1].velocity.y*=1.5
				}
			break
			case 73:
				for(let b=0,lb=entities.players.length;b<lb;b++){
					let c=dist(this.position.x,this.position.y,entities.players[b].position.x,entities.players[b].position.y)
					if(entities.players[b].life>0&&c<100&&((this.id==0?1:0)!=(entities.players[b].id==0?1:0)||this.id==-1||game.pvp)){
						entities.players[b].takeDamage(this.damage*(1-c/100)*0.8*(this.id==-1&&entities.players[b].id>0?(this.timer<5?0.1:0.5):1))
						entities.players[b].die.killer=this.index
						entities.players[b].collect.time=450
						entities.players[b].dizzyTime=max(entities.players[b].dizzyTime,entities.players[b].id>0?90:180)
						if(game.invis){
							entities.players[b].visible=15
						}
					}
				}
			break
			case 75:
				entities.projectiles.push(new projectile(this.layer,this.previous.position.x,this.previous.position.y,34,random(0,360),this.id,this.base.damage,180,this.crit,this.index))
			break
			case 83:
				for(let b=0,lb=entities.players.length;b<lb;b++){
					let c=dist(this.position.x,this.position.y,entities.players[b].position.x,entities.players[b].position.y)
					if(entities.players[b].life>0&&c<200&&((this.id==0?1:0)!=(entities.players[b].id==0?1:0)||this.id==-1||game.pvp)){
						entities.players[b].takeDamage(this.damage*(1-c/200)*0.8*constrain(1.2-this.timer/this.base.time*6,0.2,1))
						entities.players[b].die.killer=this.index
						entities.players[b].collect.time=450
						if(game.invis){
							entities.players[b].visible=15
						}
					}
				}
			break
			case 86:
				for(let b=0,lb=entities.players.length;b<lb;b++){
					let c=dist(this.position.x,this.position.y,entities.players[b].position.x,entities.players[b].position.y)
					if(entities.players[b].life>0&&c<90&&((this.id==0?1:0)!=(entities.players[b].id==0?1:0)||this.id==-1||game.pvp)){
						entities.players[b].takeDamage(this.damage*(1-c/90)*0.8*constrain(1.2-this.timer/this.base.time*6,0.2,1))
						entities.players[b].die.killer=this.index
						entities.players[b].collect.time=450
						if(game.invis){
							entities.players[b].visible=15
						}
					}
				}
			break
			case 88:
				for(let b=0,lb=entities.players.length;b<lb;b++){
					let c=dist(this.position.x,this.position.y,entities.players[b].position.x,entities.players[b].position.y)
					if(entities.players[b].life>0&&c<200&&((this.id==0?1:0)!=(entities.players[b].id==0?1:0)||this.id==-1||game.pvp)){
						entities.players[b].takeDamage(this.damage*(1-c/200)*0.8)
						entities.players[b].die.killer=this.index
						entities.players[b].collect.time=450
						if(game.invis){
							entities.players[b].visible=15
						}
					}
				}
			break
			case 97:
				let turn97=floor(random(0,45))
				for(let b=0,lb=8;b<lb;b++){
					entities.projectiles.push(new projectile(this.layer,this.previous.position.x,this.previous.position.y,5,this.direction+b*45+turn97,this.id,this.base.damage/10,180,this.crit,this.index))
					entities.projectiles.push(new projectile(this.layer,this.previous.position.x,this.previous.position.y,34,this.direction+(b+0.5)*45+turn97,this.id,this.base.damage/20,180,this.crit,this.index))
				}
			break
			case 98:
				for(let b=0,lb=entities.players.length;b<lb;b++){
					let c=dist(this.position.x,this.position.y,entities.players[b].position.x,entities.players[b].position.y)
					if(entities.players[b].life>0&&c<100&&((this.id==0?1:0)!=(entities.players[b].id==0?1:0)||this.id==-1||game.pvp)){
						entities.players[b].takeDamage(this.damage*(1-c/100)*0.8)
						entities.players[b].die.killer=this.index
						entities.players[b].collect.time=450
						if(game.invis){
							entities.players[b].visible=15
						}
					}
				}
			break
			case 101:
				for(let b=0,lb=entities.players.length;b<lb;b++){
					let c=dist(this.position.x,this.position.y,entities.players[b].position.x,entities.players[b].position.y)
					if(entities.players[b].life>0&&c<180&&((this.id==0?1:0)!=(entities.players[b].id==0?1:0)||this.id==-1||game.pvp)){
						entities.players[b].takeDamage(this.damage*(1-c/180)*0.8*constrain(1.2-this.timer/this.base.time*6,0.2,1))
						entities.players[b].die.killer=this.index
						entities.players[b].collect.time=450
						if(game.invis){
							entities.players[b].visible=15
						}
					}
				}
			break
			case 104:
				for(let b=0,lb=entities.players.length;b<lb;b++){
					let c=dist(this.position.x,this.position.y,entities.players[b].position.x,entities.players[b].position.y)
					if(entities.players[b].life>0&&c<100&&((this.id==0?1:0)!=(entities.players[b].id==0?1:0)||this.id==-1||game.pvp)){
						entities.players[b].takeDamage(this.damage*(1-c/100)*0.8*constrain(1.2-this.timer/this.base.time*6,0.2,1))
						entities.players[b].die.killer=this.index
						entities.players[b].collect.time=450
						if(game.invis){
							entities.players[b].visible=15
						}
					}
				}
				for(let b=0,lb=10;b<lb;b++){
					entities.projectiles.push(new projectile(this.layer,this.previous.position.x,this.previous.position.y,1,random(0,360),this.id,this.base.damage*0.5,random(1,60),this.crit,this.index))
					entities.projectiles[entities.projectiles.length-1].speed*=random(0.4,1)
				}
			break
			case 110:
				for(let b=0,lb=entities.players.length;b<lb;b++){
					let c=dist(this.position.x,this.position.y,entities.players[b].position.x,entities.players[b].position.y)
					if(entities.players[b].life>0&&c<75&&((this.id==0?1:0)!=(entities.players[b].id==0?1:0)||this.id==-1||game.pvp)){
						entities.players[b].takeDamage(this.damage*(1-c/75)*0.8*constrain(1.2-this.timer/this.base.time*6,0.2,1))
						entities.players[b].die.killer=this.index
						entities.players[b].collect.time=450
						if(game.invis){
							entities.players[b].visible=15
						}
					}
				}
			break
			case 113:
				for(let b=0,lb=entities.players.length;b<lb;b++){
					let c=dist(this.position.x,this.position.y,entities.players[b].position.x,entities.players[b].position.y)
					if(entities.players[b].life>0&&c<150&&((this.id==0?1:0)!=(entities.players[b].id==0?1:0)||this.id==-1||game.pvp)){
						entities.players[b].takeDamage(this.damage*(1-c/150)*0.8)
						entities.players[b].die.killer=this.index
						entities.players[b].collect.time=450
						if(game.invis){
							entities.players[b].visible=15
						}
					}
				}
			break
			case 121:
				for(let b=0,lb=4;b<lb;b++){
					entities.projectiles.push(new projectile(this.layer,this.previous.position.x,this.previous.position.y,1,random(0,360),this.id,this.base.damage/2,random(1,60),this.crit,this.index))
					entities.projectiles[entities.projectiles.length-1].speed*=random(0.4,1)
				}
			break
			case 146:
				let turn146=floor(random(0,90))
				for(let b=0,lb=4;b<lb;b++){
					entities.projectiles.push(new projectile(this.layer,this.previous.position.x,this.previous.position.y,5,this.direction+b*90+turn146,this.id,this.base.damage/2,240,this.crit,this.index))
				}
			break
			case 153:
				for(let b=0,lb=entities.players.length;b<lb;b++){
					let c=dist(this.position.x,this.position.y,entities.players[b].position.x,entities.players[b].position.y)
					if(entities.players[b].life>0&&c<180&&((this.id==0?1:0)!=(entities.players[b].id==0?1:0)||this.id==-1||game.pvp)){
						entities.players[b].takeDamage(this.damage*(1-c/180))
						entities.players[b].die.killer=this.index
						entities.players[b].collect.time=450
						if(game.invis){
							entities.players[b].visible=15
						}
					}
				}
			break
			case 156:
				for(let b=0,lb=entities.players.length;b<lb;b++){
					let c=dist(this.position.x,this.position.y,entities.players[b].position.x,entities.players[b].position.y)
					if(entities.players[b].life>0&&c<180&&((this.id==0?1:0)!=(entities.players[b].id==0?1:0)||this.id==-1||game.pvp)){
						entities.players[b].takeDamage(this.damage*(1-c/180))
						entities.players[b].die.killer=this.index
						entities.players[b].collect.time=450
						if(game.invis){
							entities.players[b].visible=15
						}
					}
				}
			break
			case 171:
				for(let b=0,lb=3;b<lb;b++){
					entities.projectiles.push(new projectile(this.layer,this.previous.position.x,this.previous.position.y,119,this.direction+b*120+60,this.id,this.base.damage/2,600,this.crit,this.index))
				}
			break
			case 178:
				entities.projectiles.push(new projectile(this.layer,this.previous.position.x,this.previous.position.y,180,this.direction,this.id,this.base.damage,900,this.crit,this.index))
			break
		}
	}
    update(){
		this.timer++
		if(
			this.type==2||this.type==3||this.type==16||this.type==21||this.type==22||
			this.type==26||this.type==27||this.type==30||this.type==31||this.type==32||
			this.type==41||this.type==45||this.type==47||this.type==53||this.type==54||
			this.type==55||this.type==56||this.type==58||this.type==64||this.type==65||
			this.type==66||this.type==78||this.type==80||this.type==83||this.type==86||
			this.type==88||this.type==98||this.type==101||this.type==104||this.type==110||
			this.type==113||this.type==114||this.type==115||this.type==116||this.type==117||
			this.type==153||this.type==156||this.type==166
		){
			this.fade=smoothAnim(this.fade,this.active,0,1,10)
		}else if(this.type==48||this.type===89||this.type===103){
			this.fade=smoothAnim(this.fade,this.active,0,1,90)
		}else{
			this.fade=smoothAnim(this.fade,this.active,0,1,5)
		}
        if(this.fade<=0){
			this.remove=true
        }
		if((game.level==3||game.level==7)&&this.position.y>game.edge[1]){
			this.position.y=0
			this.previous.position.y=0
		}else if((game.level==3||game.level==7||game.level==16)&&this.position.x>game.edge[0]){
			this.position.x=0
			this.previous.position.x=0
		}else if((game.level==3||game.level==7)&&this.position.y<0){
			this.position.y=game.edge[1]
			this.previous.position.y=game.edge[1]
		}else if((game.level==3||game.level==7||game.level==16)&&this.position.x<0){
			this.position.x=game.edge[0]
			this.previous.position.x=game.edge[0]
		}else if(this.position.x<-50||this.position.x>game.edge[0]+50||this.position.y>game.edge[1]+50){
			this.active=false
		}
		this.previous.position.x=this.position.x
		this.previous.position.y=this.position.y
		switch(this.type){
			case 5: case 8: case 17: case 28: case 29: case 30: case 34: case 35: case 42: case 51:
			case 52: case 60: case 61: case 62: case 65: case 68: case 69: case 70: case 73: case 83:
			case 95: case 97: case 98: case 102: case 104: case 106: case 107: case 110: case 111: case 113:
			case 114: case 115: case 116: case 117: case 118: case 119: case 120: case 121: case 122: case 123:
			case 124: case 128: case 129: case 131: case 132: case 134: case 135: case 136: case 137: case 138:
			case 139: case 140: case 141: case 142: case 143: case 144: case 145: case 146: case 147: case 156:
			case 157: case 158: case 159: case 160: case 161: case 162: case 163: case 164: case 165: case 166:
			case 168: case 169: case 170: case 171: case 172: case 176: case 177: case 178: case 179: case 180:
			case 181: case 182: case 183: case 184:
				this.past.splice(0,1)
				this.past.push([this.position.x,this.position.y])
				if(this.type==60){
					this.velocity.y*=0.97
				}else if(this.type!=68&&this.type!=135&&this.type!=136){
					this.velocity.y*=0.98
				}
				if(this.bounceTimer>0){
					this.bounceTimer--
				}
			break
		}
        for(let a=0,la=(this.type==125||this.type==126||this.type==127||this.type==130||this.type==173||this.type==174||this.type==185)?2:(this.type==4||this.type==14||this.type==39||this.type==50||this.type==57||this.type==88||this.type==94||this.type==167||this.type==175)?6:4;a<la;a++){
			switch(this.type){
				case 1: case 2: case 4: case 6: case 7: case 9: case 10: case 11: case 12: case 13:
				case 14: case 15: case 16: case 18: case 19: case 20: case 21: case 22: case 23: case 24:
				case 25: case 26: case 27: case 31: case 32: case 33: case 36: case 37: case 38: case 39:
				case 40: case 41: case 43: case 44: case 45: case 46: case 47: case 48: case 49: case 50:
				case 53: case 54: case 55: case 56: case 57: case 58: case 59: case 63: case 64: case 66:
				case 67: case 71: case 72: case 74: case 75: case 76: case 77: case 78: case 79: case 81:
				case 82: case 84: case 86: case 87: case 88: case 90: case 94: case 99: case 100: case 101:
				case 105: case 109: case 125: case 127: case 130: case 151: case 152: case 155: case 167: case 175:
				    this.position.x+=this.speed*lsin(this.direction)
				    this.position.y-=this.speed*lcos(this.direction)
				break
				case 3: case 153:
					if(this.active){
						this.active=false
						this.explode()
					}
				break
				case 5: case 17: case 28: case 30: case 34: case 35: case 51: case 52: case 60: case 61: case 62:
				case 65: case 68: case 73: case 83: case 97: case 98: case 102: case 104: case 106: case 110: case 131:
				case 135: case 136: case 147: case 166: case 169: case 170: case 176:
					if(a==2){
						this.midpoint.position.x=this.position.x
						this.midpoint.position.y=this.position.y
					}
					this.position.x+=this.velocity.x/4
					this.position.y+=this.velocity.y/4
					if(this.type!=68&&this.type!=135&&this.type!=136&&this.type!=169&&this.type!=170){
						this.velocity.y+=0.1
					}
					if((this.type==135||this.type==169)&&this.bounces==0){
						this.position.x+=this.velocity.y/12*(0.5+min(this.timer/30,2))*lcos(this.time*6)
						this.position.y-=this.velocity.x/12*(0.5+min(this.timer/30,2))*lcos(this.time*6)
						if(a==3){
							this.effectiveDirection=atan2(
								this.velocity.x+this.velocity.y/3*(0.5+min(this.timer/30,2))*lcos(this.time*6),
								this.velocity.y-this.velocity.x/3*(0.5+min(this.timer/30,2))*lcos(this.time*6)
							)
						}
					}
					if((this.type==136||this.type==170)&&this.bounces==0){
						this.position.x-=this.velocity.y/12*(0.5+min(this.timer/30,2))*lcos(this.time*6)
						this.position.y+=this.velocity.x/12*(0.5+min(this.timer/30,2))*lcos(this.time*6)
						if(a==3){
							this.effectiveDirection=atan2(
								this.velocity.x-this.velocity.y/3*(0.5+min(this.timer/30,2))*lcos(this.time*6),
								this.velocity.y+this.velocity.x/3*(0.5+min(this.timer/30,2))*lcos(this.time*6)
							)
						}
					}
				break
				case 8: case 107:
					if(a==2){
						this.midpoint.position.x=this.position.x
						this.midpoint.position.y=this.position.y
					}
					this.position.x+=this.velocity.x/4
					this.position.y+=this.velocity.y/4
					this.velocity.y+=0.1
					if(this.timer%(this.type==107?20:15)==0&&this.active&&a==0){
						let minimum=300
						for(let a=0,la=entities.players.length;a<la;a++){
							if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)){
								minimum=min(minimum,dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y))
							}
						}
						if(minimum<300){
							for(let a=0,la=entities.players.length;a<la;a++){
								if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)&&minimum==dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)){
									entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),this.id,this.base.damage/2,30,this.crit,this.index))
									a=la
								}
							}
						}
					}
				break
				case 29:
					if(a==2){
						this.midpoint.position.x=this.position.x
						this.midpoint.position.y=this.position.y
					}
					this.position.x+=this.velocity.x/4
					this.position.y+=this.velocity.y/4
					this.velocity.y+=0.1
					if(this.timer%15==0&&this.active&&a==0){
						let minimum=300
						for(let a=0,la=entities.players.length;a<la;a++){
							if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)){
								minimum=min(minimum,dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y))
							}
						}
						if(minimum<300){
							for(let a=0,la=entities.players.length;a<la;a++){
								if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)&&minimum==dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)){
									entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,5,atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),this.id,this.base.damage/2,120,this.crit,this.index))
									a=la
								}
							}
						}
					}
				break
				case 42:
					if(a==2){
						this.midpoint.position.x=this.position.x
						this.midpoint.position.y=this.position.y
					}
					this.position.x+=this.velocity.x/4
					this.position.y+=this.velocity.y/4
					this.velocity.y+=0.1
					if(this.timer%6==0&&this.active&&a==0){
						let minimum=300
						for(let a=0,la=entities.players.length;a<la;a++){
							if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)){
								minimum=min(minimum,dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y))
							}
						}
						if(minimum<300){
							for(let a=0,la=entities.players.length;a<la;a++){
								if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)&&minimum==dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)){
									entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),this.id,this.base.damage/4,30,this.crit,this.index))
									a=la
								}
							}
						}
					}
				break
				case 69:
					if(a==2){
						this.midpoint.position.x=this.position.x
						this.midpoint.position.y=this.position.y
					}
					this.position.x+=this.velocity.x/4
					this.position.y+=this.velocity.y/4
					this.velocity.y+=0.1
					if(this.timer%15==0&&this.active&&a==0){
						let minimum=300
						for(let a=0,la=entities.players.length;a<la;a++){
							if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)){
								minimum=min(minimum,dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y))
							}
						}
						if(minimum<300){
							for(let a=0,la=entities.players.length;a<la;a++){
								if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)&&minimum==dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)){
									entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,86,atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),this.id,this.base.damage*0.8,60,this.crit,this.index))
									a=la
								}
							}
						}
					}
				break
				case 70:
					if(a==2){
						this.midpoint.position.x=this.position.x
						this.midpoint.position.y=this.position.y
					}
					this.position.x+=this.velocity.x/4
					this.position.y+=this.velocity.y/4
					this.velocity.y+=0.1
					if(this.timer%30==0&&this.active&&a==0){
						let minimum=300
						for(let a=0,la=entities.players.length;a<la;a++){
							if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)){
								minimum=min(minimum,dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y))
							}
						}
						if(minimum<300){
							for(let a=0,la=entities.players.length;a<la;a++){
								if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)&&minimum==dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)){
									entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,8,atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),this.id,this.base.damage,240,this.crit,this.index))
									a=la
								}
							}
						}
					}
				break
				case 80:
					this.position.x+=this.speed*lsin(this.direction)
				    this.position.y-=this.speed*lcos(this.direction)
					if(this.timer%5==0&&this.active&&a==0){
						let minimum=300
						for(let a=0,la=entities.players.length;a<la;a++){
							if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)){
								minimum=min(minimum,dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y))
							}
						}
						if(minimum<300){
							for(let a=0,la=entities.players.length;a<la;a++){
								if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)&&minimum==dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)){
									this.direction=atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y)
									a=la
								}
							}
						}
					}
				break
				case 85:
					this.position.x+=this.speed*lsin(this.direction)
				    this.position.y-=this.speed*lcos(this.direction)
					if(this.active&&a==0){
						entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,6,random(0,360),this.id,this.base.damage/5,10,this.crit,this.index))
					}
				break
				case 89: case 103:
					if(a==0){
						if(this.timer%8==0&&this.active){
							this.shocks.push([random(0,360),random(0,360),1])
						}
						for(let a=0,la=this.shocks.length;a<la;a++){
							this.shocks[a][2]-=0.05
							if(this.shocks[a][2]<=0){
								this.shocks.splice(a,1)
								a--
								la--
							}
						}
					}
					if(this.type==103){
						for(let b=0,lb=entities.projectiles.length;b<lb;b++){
							if(inBoxBox(this,entities.projectiles[b])&&(((this.id==0?1:0)!=(entities.projectiles[b].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.projectiles[b].id))&&entities.projectiles[b].active){
								entities.projectiles[b].active=false
								if(entities.projectiles[b].exploder){
									entities.projectiles[b].explode()
								}
							}
						}
					}
				break
				case 91: case 92: case 93: case 108:
					this.position.x+=this.speed*lsin(this.direction)
				    this.position.y-=this.speed*lcos(this.direction)
					this.velocity.x=this.speed*lsin(this.direction)
				    this.velocity.y=-this.speed*lcos(this.direction)
					if(this.active){
						this.speed-=this.base.speed/this.base.time*0.48
					}else{
						this.speed*=0.9
					}
					if(this.type==93&&this.time%4==0&&a==0&&this.active){
						entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,this.direction+(this.speed<0?0:180),this.id,this.base.damage,30,this.crit,this.index))
					}
					if(this.speed<0&&!this.trigger){
						this.trigger=true
						this.hit=[]
					}
					this.spin+=this.speed
					/*if(this.width<16){
						this.width+=2
					}
					if(this.height<16){
						this.height+=2
					}*/
				break
				case 95:
					if(a==2){
						this.midpoint.position.x=this.position.x
						this.midpoint.position.y=this.position.y
					}
					this.position.x+=this.velocity.x/4
					this.position.y+=this.velocity.y/4
					this.velocity.y+=0.1
					if(this.timer%5==0&&this.active&&a==0){
						let minimum=300
						for(let a=0,la=entities.players.length;a<la;a++){
							if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)){
								minimum=min(minimum,dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y))
							}
						}
						if(minimum<300){
							for(let a=0,la=entities.players.length;a<la;a++){
								if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)&&minimum==dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)){
									entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y)+random(-5,5),this.id,this.base.damage/2,30,this.crit))
									a=la
								}
							}
						}
					}
				break
				case 96:
					this.position.x+=this.speed*lsin(this.direction)
				    this.position.y-=this.speed*lcos(this.direction)
					this.velocity.x=this.speed*lsin(this.direction)
				    this.velocity.y=-this.speed*lcos(this.direction)
					if(this.active){
						this.speed+=this.base.speed/this.base.time*10*0.48*(this.trigger==2||this.trigger==3?1:-1)
					}else{
						this.speed*=0.9
					}
					if(this.type==93&&this.time%4==0&&a==0&&this.active){
						entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,this.direction+(this.speed<0?0:180),this.id,this.base.damage,30,this.crit,this.index))
					}
					if(this.speed<0&&this.trigger==0){
						this.trigger=1
						this.hit=[]
					}
					if(this.speed<-this.base.speed&&this.trigger==1){
						this.trigger=2
					}
					if(this.speed>0&&this.trigger==2){
						this.trigger=3
						this.hit=[]
					}
					if(this.speed>this.base.speed&&this.trigger==3){
						this.trigger=0
					}
					this.spin+=this.speed
				break
				case 111: case 134: case 138: case 139: case 140: case 141: case 142: case 143: case 144: case 157:
				case 158: case 159: case 160: case 161: case 162: case 164: case 165:
					if(a==1){
						if(this.goal>=entities.players.length||this.goal>=0&&entities.players[this.goal].index!=this.index){
							this.goal=-1
							for(let a=0,la=entities.players.length;a<la;a++){
								if(entities.players[a].index==this.index&&!entities.players[a].sidekick){
									this.goal=a
								}
							}
						}
						if(this.goal>=0){
							let dir=this.type==138?
								atan2(entities.players[this.goal].position.x+lsin(entities.players[this.goal].direction.main)*200+lsin((this.time+this.offset)*10)*15-this.position.x,entities.players[this.goal].position.y+lcos((this.time+this.offset)*10)*15-this.position.y):
								this.type==144?
								atan2(entities.players[this.goal].position.x+lsin(entities.players[this.goal].direction.main)*100+lsin((this.time+this.offset)*6)*10-this.position.x,entities.players[this.goal].position.y+lcos((this.time+this.offset)*6)*10-60-this.position.y):
								atan2(entities.players[this.goal].position.x+lsin(entities.players[this.goal].direction.main)*100+lsin((this.time+this.offset)*6)*25-this.position.x,entities.players[this.goal].position.y+lcos((this.time+this.offset)*6)*25-60-this.position.y)
							this.velocity.x+=lsin(dir)*(this.type==138?1:this.type==144?0.3:0.6)
							this.velocity.y+=lcos(dir)*(this.type==138?1:this.type==144?0.3:0.6)
						}
						this.velocity.x*=(this.type==138?0.92:0.95)
						this.velocity.y*=(this.type==138?0.92:0.95)
					}
					if(a==2){
						this.midpoint.position.x=this.position.x
						this.midpoint.position.y=this.position.y
					}
					this.position.x+=this.velocity.x/4
					this.position.y+=this.velocity.y/4
					switch(this.type){
						case 111: case 144:
							if(this.timer%15==0&&this.active&&a==0&&entities.players[this.goal].pointer.hit){
								entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,atan2(entities.players[this.goal].pointer.x-this.position.x,this.position.y-entities.players[this.goal].pointer.y),this.id,this.base.damage/2,30,this.crit,this.index))
							}
						break
						case 134:
							if(this.timer%15==0&&this.active&&a==0){
								let minimum=[450,450,450,450]
								for(let a=0,la=entities.players.length;a<la;a++){
									if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)){
										let dir=atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y)
										let diff=(this.time%360-dir+360)%360
										for(let b=0,lb=minimum.length;b<lb;b++){
											if(abs(diff-b*90)<75||abs(diff-b*90+360)<75||abs(diff-b*90-360)<75){
												minimum[b]=min(minimum[b],dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y))
											}
										}
									}
								}
								for(let b=0,lb=minimum.length;b<lb;b++){
									if(minimum[b]<450){
										for(let a=0,la=entities.players.length;a<la;a++){
											if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)&&minimum[b]==dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)){
												entities.projectiles.push(new projectile(this.layer,this.position.x+lsin(this.timer+b*90)*10,this.position.y-lcos(this.timer+b*90)*10,1,atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),this.id,this.base.damage/10,30,this.crit,this.index))
												a=la
											}
										}
									}
								}
							}
						break
						case 139:
							if(this.timer%15==0&&this.active&&a==0&&entities.players[this.goal].pointer.hit){
								let dir=atan2(entities.players[this.goal].pointer.x-this.position.x,this.position.y-entities.players[this.goal].pointer.y)
								entities.projectiles.push(new projectile(this.layer,this.position.x+lcos(dir)*2,this.position.y+lsin(dir)*2,1,dir,this.id,this.base.damage/2,30,this.crit,this.index))
								entities.projectiles.push(new projectile(this.layer,this.position.x-lcos(dir)*2,this.position.y-lsin(dir)*2,1,dir,this.id,this.base.damage/2,30,this.crit,this.index))
							}
						break
						case 140:
							if(this.timer%15==0&&this.active&&a==0&&entities.players[this.goal].pointer.hit){
								let dir=atan2(entities.players[this.goal].pointer.x-this.position.x,this.position.y-entities.players[this.goal].pointer.y)
								entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,dir,this.id,this.base.damage/2,30,this.crit,this.index))
								entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,dir+20,this.id,this.base.damage/2,30,this.crit,this.index))
								entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,dir-20,this.id,this.base.damage/2,30,this.crit,this.index))
							}
						break
						case 141:
							if(this.timer%30==0&&this.active&&a==0&&entities.players[this.goal].pointer.hit){
								let dir=atan2(entities.players[this.goal].pointer.x-this.position.x,this.position.y-entities.players[this.goal].pointer.y)
								entities.projectiles.push(new projectile(this.layer,this.position.x+lsin(dir)*10,this.position.y-lcos(dir)*10,4,dir,this.id,this.base.damage*2,30,this.crit,this.index))
							}
						break
						case 142:
							if(this.timer%3==0&&this.timer%120<75&&this.active&&a==0&&entities.players[this.goal].pointer.hit){
								entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,atan2(entities.players[this.goal].pointer.x-this.position.x,this.position.y-entities.players[this.goal].pointer.y)+random(-5,5),this.id,this.base.damage/2,30,this.crit,this.index))
							}
						break
						case 143:
							if(this.timer%20==0&&this.active&&a==0&&entities.players[this.goal].pointer.hit){
								entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,atan2(entities.players[this.goal].pointer.x-this.position.x,this.position.y-entities.players[this.goal].pointer.y),this.id,this.base.damage/2,30,this.crit,this.index))
							}
						break
						case 157:
							if(this.timer%15==0&&this.active&&a==0&&entities.players[this.goal].pointer.hit){
								entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,112,atan2(entities.players[this.goal].pointer.x-this.position.x,this.position.y-entities.players[this.goal].pointer.y),this.id,this.base.damage/2,30,this.crit,this.index))
							}
						break
						case 158:
							if(this.timer%60==0&&this.active&&a==0&&entities.players[this.goal].pointer.hit){
								entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,130,atan2(entities.players[this.goal].pointer.x-this.position.x,this.position.y-entities.players[this.goal].pointer.y),this.id,this.base.damage*4,30,this.crit,this.index))
							}
						break
						case 159:
							if(this.timer%45==0&&this.active&&a==0&&entities.players[this.goal].pointer.hit){
								let dir=atan2(entities.players[this.goal].pointer.x-this.position.x,this.position.y-entities.players[this.goal].pointer.y)
								entities.projectiles.push(new projectile(this.layer,this.position.x+lsin(dir)*10,this.position.y-lcos(dir)*10,4,dir,this.id,this.base.damage*3,30,this.crit,this.index))
							}
						break
						case 160:
							if(this.timer%30==0&&this.active&&a==0&&entities.players[this.goal].pointer.hit){
								entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,168,atan2(entities.players[this.goal].pointer.x-this.position.x,this.position.y-entities.players[this.goal].pointer.y),this.id,this.base.damage,30,this.crit,this.index))
							}
						break
						case 161:
							if(this.timer%90==0&&this.active&&a==0&&entities.players[this.goal].pointer.hit){
								for(let a=0,la=3;a<la;a++){
									entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,113,atan2(entities.players[this.goal].pointer.x-this.position.x,this.position.y-entities.players[this.goal].pointer.y)+a*120,this.id,this.base.damage,300,this.crit,this.index))
								}
							}
						break
						case 162:
							if(this.timer%15==0&&this.active&&a==0){
								let minimum=[450,450,450,450]
								for(let a=0,la=entities.players.length;a<la;a++){
									if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)){
										let dir=atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y)
										let diff=(this.time%360-dir+360)%360
										for(let b=0,lb=minimum.length;b<lb;b++){
											if(abs(diff-b*90)<75||abs(diff-b*90+360)<75||abs(diff-b*90-360)<75){
												minimum[b]=min(minimum[b],dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y))
											}
										}
									}
								}
								for(let b=0,lb=minimum.length;b<lb;b++){
									if(minimum[b]<450){
										for(let a=0,la=entities.players.length;a<la;a++){
											if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)&&minimum[b]==dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)){
												entities.projectiles.push(new projectile(this.layer,this.position.x+lsin(this.timer+b*90)*10,this.position.y-lcos(this.timer+b*90)*10,168,atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),this.id,this.base.damage*0.15,300,this.crit,this.index))
												a=la
											}
										}
									}
								}
							}
						break
						case 164:
							if(this.timer%15==0&&this.active&&a==0){
								let minimum=[450,450,450,450,450,450]
								for(let a=0,la=entities.players.length;a<la;a++){
									if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)){
										let dir=atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y)
										let diff=(this.time%360-dir+360)%360
										for(let b=0,lb=minimum.length;b<lb;b++){
											if(abs(diff-b*60)<75||abs(diff-b*60+360)<75||abs(diff-b*60-360)<75){
												minimum[b]=min(minimum[b],dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y))
											}
										}
									}
								}
								for(let b=0,lb=minimum.length;b<lb;b++){
									if(minimum[b]<450){
										for(let a=0,la=entities.players.length;a<la;a++){
											if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)&&minimum[b]==dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)){
												entities.projectiles.push(new projectile(this.layer,this.position.x+lsin(this.timer+b*60)*10,this.position.y-lcos(this.timer+b*60)*10,[168,1][b%2],atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),this.id,this.base.damage/10,[150,30][b%2],this.crit,this.index))
												a=la
											}
										}
									}
								}
							}
						break
						case 165:
							if(this.timer%15==0&&this.active&&a==0){
								let minimum=[450,450,450,450,450]
								for(let a=0,la=entities.players.length;a<la;a++){
									if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)){
										let dir=atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y)
										let diff=(this.time%360-dir+360)%360
										for(let b=0,lb=minimum.length;b<lb;b++){
											if(abs(diff-b*90)<75||abs(diff-b*90+360)<75||abs(diff-b*90-360)<75||b==4){
												minimum[b]=min(minimum[b],dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y))
											}
										}
									}
								}
								for(let b=0,lb=minimum.length;b<lb;b++){
									if(minimum[b]<450){
										for(let a=0,la=entities.players.length;a<la;a++){
											if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)&&minimum[b]==dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)){
												entities.projectiles.push(new projectile(this.layer,this.position.x+lsin(this.timer+b*90)*(b==4?0:10),this.position.y-lcos(this.timer+b*90)*(b==4?0:10),1,atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),this.id,this.base.damage/10,30,this.crit,this.index))
												a=la
											}
										}
									}
								}
							}
						break
					}
				break
				case 112:
					this.position.x+=this.speed*lsin(this.direction)
				    this.position.y-=this.speed*lcos(this.direction)
					if(this.active&&a==0){
						let minimum=450
						for(let a=0,la=entities.players.length;a<la;a++){
							if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)){
								minimum=min(minimum,dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y))
							}
						}
						if(minimum<450){
							for(let a=0,la=entities.players.length;a<la;a++){
								if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)&&minimum==dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)){
									let goal=atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y)
									if(
										abs(this.direction-goal)<12||
										abs(this.direction-goal-360)<12||
										abs(this.direction-goal+360)<12
									){
										this.direction=goal
									}else if(
										this.direction>goal-180&&this.direction<goal||
										this.direction>goal-180-360&&this.direction<goal-360||
										this.direction>goal-180+360&&this.direction<goal+360
									){
										this.direction+=12
									}else if(
										this.direction<goal+180&&this.direction>goal||
										this.direction<goal+180-360&&this.direction>goal-360||
										this.direction<goal+180+360&&this.direction>goal+360
									){
										this.direction-=12
									}
									a=la
								}
							}
						}
					}
				break
				case 113: case 114: case 115: case 116: case 146: case 156: case 181:
					if(!this.stop){
						if(a==2){
							this.midpoint.position.x=this.position.x
							this.midpoint.position.y=this.position.y
						}
						this.position.x+=this.velocity.x/4
						this.position.y+=this.velocity.y/4
						this.velocity.y+=0.1
					}
					if(this.type==156&&this.timer==240&&this.active){
						this.active=false
						this.explode()
					}
				break
				case 117:
					if(this.stop){
						if(this.timer>150&&this.timer%5==0&&this.active&&a==0&&this.ammo>0){
							let minimum=120
							for(let a=0,la=entities.players.length;a<la;a++){
								if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)){
									minimum=min(minimum,dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y))
								}
							}
							if(minimum<120){
								this.ammo--
								for(let a=0,la=entities.players.length;a<la;a++){
									if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)&&minimum==dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)){
										entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),this.id,this.base.damage/4,30,this.crit,this.index))
										entities.projectiles[entities.projectiles.length-1].update()
										a=la
									}
								}
							}
						}
					}else{
						if(a==2){
							this.midpoint.position.x=this.position.x
							this.midpoint.position.y=this.position.y
						}
						this.position.x+=this.velocity.x/4
						this.position.y+=this.velocity.y/4
						this.velocity.y+=0.1
					}
				break
				case 118: case 119: case 121: case 122: case 123: case 124: case 128: case 129: case 132: case 137:
				case 168: case 171: case 184:
					if(a==1){
						if(this.aggro){
							if(this.goal==-1||this.goal>=entities.players.length||entities.players[this.goal].index!=this.goalIndex){
								this.goal=-1
								for(let a=0,la=entities.players.length;a<la;a++){
									if(entities.players[a].index==this.goalIndex){
										this.goal=a
									}
								}
								if(this.goal==-1){
									this.aggro=false
								}
							}
							if(this.goal>=0){
								let dir=atan2(entities.players[this.goal].position.x-this.position.x,entities.players[this.goal].position.y-this.position.y)
								this.velocity.x+=lsin(dir)*(this.type==119||this.type==121||this.type==132?1:0.6)*2
								this.velocity.y+=lcos(dir)*(this.type==119||this.type==121||this.type==132?1:0.6)*2
							}
							this.velocity.x*=0.91
							this.velocity.y*=0.91
						}else{
							if(this.time%5==0&&this.type!=184){
								let range=this.type==137?constrain(this.timer/2,40,80):80
								let minimum=range
								for(let a=0,la=entities.players.length;a<la;a++){
									if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)){
										minimum=min(minimum,dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y))
									}
								}
								if(minimum<range){
									for(let a=0,la=entities.players.length;a<la;a++){
										if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)&&minimum==dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)){
											this.aggro=true
											this.goal=a
											this.goalIndex=entities.players[this.goal].index
										}
									}
								}
							}
							if(this.goal==-1||this.goal>=entities.players.length||entities.players[this.goal].index!=this.index){
								this.goal=-1
								for(let a=0,la=entities.players.length;a<la;a++){
									if(entities.players[a].index==this.index&&!entities.players[a].sidekick){
										this.goal=a
									}
								}
							}
							if(this.goal>=0){
								/*let dir=this.type==129||this.type==132||this.type==137?
								atan2(entities.players[this.goal].position.x+lsin((this.time+this.offset)*(this.type==119||this.type==121||this.type==132?this.speed:6))*this.orbit-this.position.x,entities.players[this.goal].position.y+lcos((this.time+this.offset)*(this.type==119||this.type==121?this.speed:6))*this.orbit-35-this.position.y):
								atan2(entities.players[this.goal].position.x+lsin(entities.players[this.goal].direction.main)*300+lsin((this.time+this.offset)*(this.type==119||this.type==121||this.type==132?this.speed:6))*this.orbit-this.position.x,entities.players[this.goal].position.y+lcos((this.time+this.offset)*(this.type==119||this.type==121||this.type==132?this.speed:6))*this.orbit-30-this.position.y)*/
								let dir=this.type==132||this.type==137?atan2(entities.players[this.goal].position.x+lsin(this.time*(this.type==119||this.type==121||this.type==132?this.speed:6)+this.offset)*this.orbit-this.position.x,entities.players[this.goal].position.y+lcos(this.time*(this.type==119||this.type==121?this.speed:6)+this.offset)*this.orbit-35-this.position.y):
								atan2(entities.players[this.goal].pointer.x+lsin(this.time*(this.type==119||this.type==121||this.type==132?this.speed:6)+this.offset)*this.orbit-this.position.x,entities.players[this.goal].pointer.y+lcos(this.time*(this.type==119||this.type==121||this.type==132?this.speed:6)+this.offset)*this.orbit-15-this.position.y)
								this.velocity.x+=lsin(dir)*(this.type==119||this.type==121||this.type==132?1:0.6)
								this.velocity.y+=lcos(dir)*(this.type==119||this.type==121||this.type==132?1:0.6)
							}
							this.velocity.x*=0.95
							this.velocity.y*=0.95
						}
					}
					if(a==2){
						this.midpoint.position.x=this.position.x
						this.midpoint.position.y=this.position.y
					}
					this.position.x+=this.velocity.x/4
					this.position.y+=this.velocity.y/4
					if(this.type==122&&this.time%60==0&&a==0&&this.active){
						entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,114,0,this.id,this.base.damage,3600,this.crit,this.index))
						entities.projectiles[entities.projectiles.length-1].velocity.x=0
						entities.projectiles[entities.projectiles.length-1].velocity.y=0
					}
					if(this.type==123&&this.time%6==0&&a==0&&this.active){
						entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,atan2(this.velocity.x,-this.velocity.y)-165,this.id,this.base.damage/2,30,this.crit,this.index))
						entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,atan2(this.velocity.x,-this.velocity.y)+165,this.id,this.base.damage/2,30,this.crit,this.index))
					}
					if(this.type==128&&this.time%10==0&&a==0&&this.active){
						entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,atan2(this.velocity.x,-this.velocity.y),this.id,this.base.damage/2,30,this.crit,this.index))
					}
					if(this.type==129&&this.time%30==0&&a==0&&this.active){
						entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,68,atan2(this.velocity.x,-this.velocity.y),this.id,this.base.damage*0.8,300,this.crit,this.index))
					}
					if(this.type==171&&this.time==900&&this.active){
						this.active=false
						this.explode()
					}
					if(this.type==184&&this.time%12==0&&a==0&&this.active){
						entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,atan2(this.velocity.x,-this.velocity.y),this.id,this.base.damage/2,30,this.crit,this.index))
						if(this.time%60==0){
							entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,114,180-atan2(this.velocity.x,-this.velocity.y),this.id,this.base.damage/2,30,this.crit,this.index))
						}
					}
				break
				case 120: case 177: case 178: case 179: case 180: case 182: case 183:
					if(a==2){
						this.midpoint.position.x=this.position.x
						this.midpoint.position.y=this.position.y
					}
					this.position.x+=this.velocity.x/4
					this.position.y+=this.velocity.y/4
					this.velocity.y+=0.1
					this.direction+=this.spin
					if(this.time%(this.type==183?120:90)==0&&a==0&&this.active){
						switch(this.type){
							case 120:
								for(let a=0,la=2;a<la;a++){
									entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,121,this.direction+a/la*360,this.id,this.base.damage/6,300,this.crit,this.index))
								}
							break
							case 177:
								for(let a=0,la=3;a<la;a++){
									entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,119,this.direction+a/la*360,this.id,this.base.damage/6,300,this.crit,this.index))
									if(this.time%180==0){
										entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,114,this.direction+(a+0.5)/la*360,this.id,this.base.damage/2,300,this.crit,this.index))
									}
								}
							break
							case 178: case 179: case 182: case 183:
								for(let a=0,la=3;a<la;a++){
									entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,119,this.direction+a/la*360,this.id,this.base.damage/6,300,this.crit,this.index))
								}
							break
							case 180:
								for(let a=0,la=2;a<la;a++){
									entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,119,this.direction+a/la*360,this.id,this.base.damage/6,300,this.crit,this.index))
								}
							break
						}
					}
				break
				case 126:
					this.position.x+=this.speed*lsin(this.direction)
				    this.position.y-=this.speed*lcos(this.direction)
					if(this.time%10==0&&a==0&&this.active){
						entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,this.direction,this.id,this.base.damage/10,15,this.crit,this.index))
					}
				break
				case 133: case 148: case 149:
				    this.position.x+=this.speed*lsin(this.direction)
				    this.position.y-=this.speed*lcos(this.direction)
					if(a==0){
						this.speed+=this.base.speed*0.05
					}
					if(this.type==148&&a==0&&this.active){
						if(lsin(this.direction)>0){
							if(this.direction<0){
								this.direction+=360
							}else if(this.direction>360){
								this.direction-=360
							}
							this.direction=90*0.05+this.direction*0.95
						}else if(lsin(this.direction)<0){
							if(this.direction<0){
								this.direction+=360
							}else if(this.direction>360){
								this.direction-=360
							}
							this.direction=270*0.05+this.direction*0.95
						}
					}
				break
				case 145:
					if(a==1){
						if(this.aggro){
							if(this.goal==-1||this.goal>=entities.players.length||entities.players[this.goal].index!=this.goalIndex){
								this.goal=-1
								for(let a=0,la=entities.players.length;a<la;a++){
									if(entities.players[a].index==this.goalIndex){
										this.goal=a
									}
								}
								if(this.goal==-1){
									this.aggro=false
								}
							}
							if(this.goal>=0){
								let dir=atan2(entities.players[this.goal].position.x-this.position.x,entities.players[this.goal].position.y-this.position.y)
								this.velocity.x+=lsin(dir)*2
								this.velocity.y+=lcos(dir)*2
							}
							this.velocity.x*=0.8
							this.velocity.y*=0.8
						}else{
							if(this.time%5==0){
								let range=40
								let minimum=range
								for(let a=0,la=entities.players.length;a<la;a++){
									if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)){
										minimum=min(minimum,dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y))
									}
								}
								if(minimum<range){
									for(let a=0,la=entities.players.length;a<la;a++){
										if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)&&minimum==dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)){
											this.aggro=true
											this.goal=a
											this.goalIndex=entities.players[this.goal].index
										}
									}
								}
							}
							if(this.goal==-1||this.goal>=entities.projectiles.length||entities.projectiles[this.goal].projectileIndex!=this.target){
								this.goal=-1
								for(let a=0,la=entities.projectiles.length;a<la;a++){
									if(entities.projectiles[a].projectileIndex==this.target){
										this.goal=a
									}
								}
								if(this.goal==-1){
									this.type=119
								}
							}
							if(this.goal>=0){
								let dir=atan2(entities.projectiles[this.goal].position.x+lsin(this.time*6+this.offset)*this.orbit-this.position.x,entities.projectiles[this.goal].position.y+lcos(this.time*6+this.offset)*this.orbit-this.position.y)
								this.velocity.x+=lsin(dir)*(0.6)
								this.velocity.y+=lcos(dir)*(0.6)
							}
							this.velocity.x*=0.95
							this.velocity.y*=0.95
						}
					}
					if(a==2){
						this.midpoint.position.x=this.position.x
						this.midpoint.position.y=this.position.y
					}
					this.position.x+=this.velocity.x/4
					this.position.y+=this.velocity.y/4
					if(this.type==122&&this.time%60==0&&a==0&&this.active){
						entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,114,0,this.id,this.base.damage,3600,this.crit,this.index))
						entities.projectiles[entities.projectiles.length-1].velocity.x=0
						entities.projectiles[entities.projectiles.length-1].velocity.y=0
					}
					if(this.type==123&&this.time%6==0&&a==0&&this.active){
						entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,atan2(this.velocity.x,-this.velocity.y)-165,this.id,this.base.damage/2,30,this.crit,this.index))
						entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,atan2(this.velocity.x,-this.velocity.y)+165,this.id,this.base.damage/2,30,this.crit,this.index))
					}
					if(this.type==128&&this.time%10==0&&a==0&&this.active){
						entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,atan2(this.velocity.x,-this.velocity.y),this.id,this.base.damage/2,30,this.crit,this.index))
					}
					if(this.type==129&&this.time%30==0&&a==0&&this.active){
						entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,68,atan2(this.velocity.x,-this.velocity.y),this.id,this.base.damage*0.8,300,this.crit,this.index))
					}
				break
				case 150:
				    this.position.x+=this.speed*lsin(this.direction)
				    this.position.y-=this.speed*lcos(this.direction)
					if(a==0&&this.speed>0){
						this.speed-=this.base.speed*0.025
						if(this.speed<0){
							this.speed=0
						}
					}
				break
				case 154:
					this.position.x+=this.speed*lsin(this.direction)
				    this.position.y-=this.speed*lcos(this.direction)
					if(this.time%5==0&&a==0&&this.active){
						entities.projectiles.push(new projectile(this.layer,this.position.x+lsin(this.direction+this.time*5)*15,this.position.y-lcos(this.direction+this.time*5)*15,1,this.direction+this.time*5,this.id,this.base.damage/5,10,this.crit,this.index))
						entities.projectiles.push(new projectile(this.layer,this.position.x-lsin(this.direction+this.time*5)*15,this.position.y+lcos(this.direction+this.time*5)*15,1,this.direction+this.time*5+180,this.id,this.base.damage/5,10,this.crit,this.index))
					}
				break
				case 173:
					this.position.x+=this.speed*lsin(this.direction)
				    this.position.y-=this.speed*lcos(this.direction)
					if(this.time%15==0&&a==0&&this.active){
						entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,this.direction,this.id,this.base.damage/4,15,this.crit,this.index))
					}
				break
				case 174:
				    this.position.x+=this.speed*lsin(this.direction)
				    this.position.y-=this.speed*lcos(this.direction)
					if(this.timer%20==0&&this.active&&a==0){
						let minimum=300
						for(let a=0,la=entities.players.length;a<la;a++){
							if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)){
								minimum=min(minimum,dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y))
							}
						}
						if(minimum<300){
							for(let a=0,la=entities.players.length;a<la;a++){
								if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)&&minimum==dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)){
									entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),this.id,this.base.damage,30,this.crit,this.index))
									a=la
								}
							}
						}
					}
				break
				case 163:
					if(a==0){
						if(this.goal>=entities.players.length||this.goal>=0&&entities.players[this.goal].index!=this.index){
							this.goal=-1
							for(let a=0,la=entities.players.length;a<la;a++){
								if(entities.players[a].index==this.index&&!entities.players[a].sidekick){
									this.goal=a
								}
							}
						}
						let inputSet=this.id==0||this.id>game.gaming?[
							this.position.x>entities.players[this.goal].position.x+25,
							this.position.x<entities.players[this.goal].position.x-25,
							this.position.y>entities.players[this.goal].position.y+25,
							this.position.y<entities.players[this.goal].position.y-25
						]:inputs.keys[game.gaming==1?1:this.id-1]
						if(inputSet[0]){
							this.velocity.x-=0.8
						}
						if(inputSet[1]){
							this.velocity.x+=0.8
						}
						if(inputSet[2]){
							this.velocity.y-=0.8
						}
						if(inputSet[3]){
							this.velocity.y+=0.8
						}
						this.velocity.x*=0.9
						this.velocity.y*=0.9
					}
					if(a==2){
						this.midpoint.position.x=this.position.x
						this.midpoint.position.y=this.position.y
					}
					this.position.x+=this.velocity.x/4
					this.position.y+=this.velocity.y/4
					switch(this.type){
						case 163:
							if(this.timer%15==0&&this.active&&a==0){
								let minimum=[450,450,450,450]
								for(let a=0,la=entities.players.length;a<la;a++){
									if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)){
										let dir=atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y)
										let diff=(this.time%360-dir+360)%360
										for(let b=0,lb=minimum.length;b<lb;b++){
											if(abs(diff-b*90)<75||abs(diff-b*90+360)<75||abs(diff-b*90-360)<75){
												minimum[b]=min(minimum[b],dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y))
											}
										}
									}
								}
								for(let b=0,lb=minimum.length;b<lb;b++){
									if(minimum[b]<450){
										for(let a=0,la=entities.players.length;a<la;a++){
											if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)&&minimum[b]==dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)){
												entities.projectiles.push(new projectile(this.layer,this.position.x+lsin(this.timer+b*90)*10,this.position.y-lcos(this.timer+b*90)*10,1,atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),this.id,this.base.damage/10,30,this.crit,this.index))
												a=la
											}
										}
									}
								}
							}
						break
					}
				break
				case 172:
					if(a==1){
						if(this.aggro){
							if(this.goal==-1||this.goal>=entities.players.length||entities.players[this.goal].index!=this.goalIndex){
								this.goal=-1
								for(let a=0,la=entities.players.length;a<la;a++){
									if(entities.players[a].index==this.goalIndex){
										this.goal=a
									}
								}
								if(this.goal==-1){
									this.aggro=false
								}
							}
							if(this.goal>=0){
								let dir=atan2(entities.players[this.goal].position.x-this.position.x,entities.players[this.goal].position.y-this.position.y)
								this.velocity.x+=lsin(dir)*4
								this.velocity.y+=lcos(dir)*4
							}
							this.velocity.x*=0.75
							this.velocity.y*=0.75
						}else{
							if(this.time%5==0){
								let range=this.type==137?constrain(this.timer/2,40,80):80
								let minimum=range
								for(let a=0,la=entities.players.length;a<la;a++){
									if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)){
										minimum=min(minimum,dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y))
									}
								}
								if(minimum<range){
									for(let a=0,la=entities.players.length;a<la;a++){
										if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)&&minimum==dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)){
											this.aggro=true
											this.goal=a
											this.goalIndex=entities.players[this.goal].index
										}
									}
								}
							}
							if(this.goal==-1||this.goal>=entities.players.length||entities.players[this.goal].index!=this.index){
								this.goal=-1
								for(let a=0,la=entities.players.length;a<la;a++){
									if(entities.players[a].index==this.index&&!entities.players[a].sidekick){
										this.goal=a
									}
								}
							}
							if(this.goal>=0){
								let dir=atan2(entities.players[this.goal].position.x+lsin(this.time*15+this.offset)*this.orbit-this.position.x,entities.players[this.goal].position.y+lcos(this.time*15+this.offset)*this.orbit-35-this.position.y)
								this.velocity.x+=lsin(dir)*2
								this.velocity.y+=lcos(dir)*2
							}
							this.velocity.x*=0.85
							this.velocity.y*=0.85
						}
					}
					if(a==2){
						this.midpoint.position.x=this.position.x
						this.midpoint.position.y=this.position.y
					}
					this.position.x+=this.velocity.x/4
					this.position.y+=this.velocity.y/4
				break
				case 185:
				    this.position.x+=this.speed*lsin(this.direction)
				    this.position.y-=this.speed*lcos(this.direction)
					if(this.timer%15==0&&this.active&&a==0){
						if(this.timer%90==0){
							for(let a=0,la=3;a<la;a++){
								entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,114,this.direction+this.position.x+a/la*360,this.id,this.base.damage*0.25,1800,this.crit,this.index))
							}
						}
						let minimum=600
						for(let a=0,la=entities.players.length;a<la;a++){
							if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)){
								minimum=min(minimum,dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y))
							}
						}
						if(minimum<600){
							for(let a=0,la=entities.players.length;a<la;a++){
								if(entities.players[a].life>0&&((this.id==0?1:0)!=(entities.players[a].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[a].id)&&minimum==dist(this.position.x,this.position.y,entities.players[a].position.x,entities.players[a].position.y)){
									entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,1,atan2(entities.players[a].position.x-this.position.x,this.position.y-entities.players[a].position.y),this.id,this.base.damage*0.125,30,this.crit,this.index))
									a=la
								}
							}
						}
					}
				break
				
			}
			if(this.active&&this.type!=85){
				for(let b=0,lb=entities.players.length;b<lb;b++){
				    if(inBoxBox(this,entities.players[b])&&(((this.id==0?1:0)!=(entities.players[b].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[b].id)||(this.type==9||this.type==10||this.type==11||this.type==38||this.type==63||this.type==72||this.type==82)&&!entities.players[b].playerData.name.includes('Medic'))&&
						!(this.id==-1&&this.timer<10&&entities.players[b].id>0)&&
						!((this.type==9||this.type==10||this.type==11||this.type==38||this.type==63||this.type==72||this.type==82||this.type==155)&&this.index==entities.players[b].index)&&
						!((this.type==4||this.type==14||this.type==39||this.type==50||this.type==57||this.type==88)&&this.timer<5&&this.id==0)&&
						entities.players[b].life>0&&entities.players[b].invincible<=0&&this.active&&
						!((this.type==91||this.type==92||this.type==93||this.type==96||this.type==108)&&this.hit.includes(entities.players[b].index))&&
						!(this.type==98&&this.timer<15)&&
						!(this.type==100&&this.timer<3)&&
						!((this.type==113||this.type==114||this.type==115||this.type==116||this.type==117||this.type==146||this.type==181)&&this.timer<150)&&
						this.type!=156
					){
						if(this.type==91||this.type==92||this.type==93||this.type==96||this.type==108){
							this.hit.push(entities.players[b].index)
							if(this.type==92){
								let minimum=300
								for(let c=0,lc=entities.players.length;c<lc;c++){
									if(entities.players[c].life>0&&((this.id==0?1:0)!=(entities.players[c].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[c].id)&&!this.hit.includes(entities.players[c].index)){
										minimum=min(minimum,dist(this.position.x,this.position.y,entities.players[c].position.x,entities.players[c].position.y))
									}
								}
								if(minimum<300){
									for(let c=0,lc=entities.players.length;c<lc;c++){
										if(entities.players[c].life>0&&((this.id==0?1:0)!=(entities.players[c].id==0?1:0)||this.id==-1||game.pvp&&this.id!=entities.players[c].id)&&minimum==dist(this.position.x,this.position.y,entities.players[c].position.x,entities.players[c].position.y)&&!this.hit.includes(entities.players[c].index)){
											this.direction=atan2(entities.players[c].position.x-this.position.x,this.position.y-entities.players[c].position.y)
											a=la
										}
									}
								}
								this.speed=this.base.speed
							}
						}else if(this.type==179){
							this.time-=180
							if(this.time<=0){
								this.active=false
							}
							let dir=atan2(this.position.x-entities.players[b].position.x,this.position.y-entities.players[b].position.y)
							this.velocity.x=sin(dir)*6
							this.velocity.y=cos(dir)*6
							entities.players[b].velocity.x-=sin(dir)*6
							entities.players[b].velocity.y-=cos(dir)*6
						}else if(this.type!=89&&this.type!=103&&this.type!=138&&this.type!=152&&this.type!=155){
				        	this.active=false
						}
						if(this.id==-1&&entities.players[b].id>0&&this.type==6){
							this.damage*=0.25
						}
						if((this.type==9||this.type==155)&&(this.id==0?1:0)==(entities.players[b].id==0?1:0)&&!game.pvp){
							entities.players[b].life=min(entities.players[b].life+this.damage*(min(4,entities.players[b].base.life/100)),entities.players[b].base.life*2)
						}else if(this.type==10&&(this.id==0?1:0)==(entities.players[b].id==0?1:0)&&!game.pvp){
							entities.players[b].life=min(entities.players[b].life+this.damage*3*(min(4,entities.players[b].base.life/100)),entities.players[b].base.life*2)
						}else if(this.type==11&&(this.id==0?1:0)==(entities.players[b].id==0?1:0)&&!game.pvp){
							entities.players[b].life=entities.players[b].base.life
						}else if(this.type==38&&(this.id==0?1:0)==(entities.players[b].id==0?1:0)&&!game.pvp){
							entities.players[b].life=min(entities.players[b].life+this.damage*(min(4,entities.players[b].base.life/100)),entities.players[b].base.life*2)
							entities.players[b].critBuff=max(480,entities.players[b].critBuff)
						}else if(this.type==63&&(this.id==0?1:0)==(entities.players[b].id==0?1:0)&&!game.pvp){
							entities.players[b].life=min(entities.players[b].life+this.damage*(min(4,entities.players[b].base.life/100)),entities.players[b].base.life*2)
							entities.players[b].defendBuff=max(240,entities.players[b].defendBuff)
						}else if(this.type==82&&(this.id==0?1:0)==(entities.players[b].id==0?1:0)&&!game.pvp){
							entities.players[b].life=min(entities.players[b].life+this.damage*(min(4,entities.players[b].base.life/100)),entities.players[b].base.life*2)
							entities.players[b].stunTime=0
							entities.players[b].stuckTime=0
							entities.players[b].vulnerableTime=0
							entities.players[b].confuseTime=0
							entities.players[b].dizzyTime=0
							entities.players[b].DOT.active=0
						}else if(this.type==6||this.type==15||this.type==33||this.type==74||this.type==75||this.type==81){
							entities.players[b].takeDamage(this.damage*(entities.players[b].life>=1000?3:entities.players[b].life>=500?2:1))
							if(this.type==75){
								this.explode()
							}
						}else if(this.type==72&&(this.id==0?1:0)==(entities.players[b].id==0?1:0)&&!game.pvp){
							entities.players[b].life=min(entities.players[b].life+this.damage*(entities.players[b].base.life/100),entities.players[b].base.life*2)
							entities.players[b].jump.double=1
						}else if(this.type==131){
							entities.players[b].takeDamage(this.damage*(1+8*this.timer/this.base.time))
						}else if(
							this.exploder
						){
							if(this.type==41||this.type==98||this.type==117||this.type==121||this.type==146){
								entities.players[b].takeDamage(this.damage)
							}
							this.explode()
						}else if(this.type==149){
				        	entities.players[b].takeDamage(this.damage*this.speed/this.base.speed)
						}else{
				        	entities.players[b].takeDamage(this.damage)
						}
						if(this.type==12){
							entities.players[b].velocity.x+=this.speed*lsin(this.direction)*3
							entities.players[b].velocity.y-=this.speed*lcos(this.direction)*3
						}else if(this.type==13){
							entities.players[b].weapon.cooldown=min(entities.players[b].weaponData.cooldown+15,entities.players[b].weapon.cooldown+15)
						}else if(this.type==40){
							entities.players[b].weapon.cooldown=min(entities.players[b].weaponData.cooldown+60,entities.players[b].weapon.cooldown+60)
						}else if(this.type==14||this.type==46){
							entities.players[b].weaponType=-1
						}else if(this.type==16){
							entities.players[b].velocity.x+=this.speed*lsin(this.direction)*3.6
							entities.players[b].velocity.y-=this.speed*lcos(this.direction)*3.6
						}else if(this.type==18){
							entities.players[b].velocity.y-=this.speed*abs(lsin(this.direction)*3)
						}else if(this.type==19){
							entities.players[b].velocity.x+=this.speed*lsin(this.direction)*-3
							entities.players[b].velocity.y-=this.speed*lcos(this.direction)*-3
						}else if(this.type==55){
							entities.players[b].velocity.x+=this.speed*lsin(this.direction)*6
							entities.players[b].velocity.y-=this.speed*lcos(this.direction)*6
						}else if(this.type==56){
							entities.players[b].velocity.y-=this.speed*abs(lsin(this.direction)*2)
						}else if(this.type==74||this.type==81){
							entities.players[b].velocity.x+=this.speed*lsin(this.direction)*1.8
							entities.players[b].velocity.y-=this.speed*lcos(this.direction)*1.8
						}else if(this.type==77){
							entities.players[b].velocity.x+=this.speed*lsin(this.direction)*24
							entities.players[b].velocity.y-=this.speed*lcos(this.direction)*24
						}else if(this.type==87){
							entities.players[b].velocity.x+=this.speed*lsin(this.direction)*7.5
							entities.players[b].velocity.y-=this.speed*lcos(this.direction)*7.5
						}else if(this.type==127){
							entities.players[b].velocity.x+=lsin(this.direction)*20
							entities.players[b].velocity.y-=lcos(this.direction)*20
							entities.players[b].lastingForce[0]+=lsin(this.direction)*12
							entities.players[b].lastingForce[1]-=lcos(this.direction)*12
						}else if(
							this.type==23||this.type==24||this.type==33||this.type==35||this.type==39||
							this.type==51
						){
							for(let d=0,ld=entities.players.length;d<ld;d++){
								if(entities.players[d].index==this.index){
									entities.players[d].life=min(entities.players[d].life+this.damage,entities.players[d].base.life)
								}
							}
						}else if(this.type==36){
							for(let d=0,ld=entities.players.length;d<ld;d++){
								if(entities.players[d].index==this.index){
									entities.players[d].critBuff=max(300,entities.players[d].critBuff)
								}
							}
						}else if(this.type==43){
							entities.players[b].vulnerableTime=max(entities.players[b].vulnerableTime,300)
						}else if(this.type==44){
							entities.players[b].stunTime=max(entities.players[b].stunTime,30)
						}else if(this.type==49){
							for(let d=0,ld=entities.players.length;d<ld;d++){
								if(entities.players[d].index==this.index){
									entities.players[d].life=entities.players[d].base.life
								}
							}
						}else if(this.type==57){
							entities.players[b].newWeapon()
						}else if(this.type==59){
							entities.players[b].vulnerableTime=max(entities.players[b].vulnerableTime,300)
							entities.players[b].stunTime=max(entities.players[b].stunTime,30)
						}else if(this.type==61){
							for(let d=0,ld=entities.players.length;d<ld;d++){
								if(entities.players[d].index==this.index){
									entities.players[d].life=min(entities.players[d].life+this.damage,entities.players[d].base.life)
								}
							}
							entities.players[b].stunTime=max(entities.players[b].stunTime,60)
						}else if(this.type==67){
							entities.players[b].confuseTime=max(entities.players[b].confuseTime,360)
						}else if(this.type==76){
							entities.players[b].stunTime=max(entities.players[b].stunTime,30)
						}else if(this.type==94){
							entities.players[b].stunTime=max(entities.players[b].stunTime,600)
						}else if(this.type==99){
							entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,100,this.direction,this.id,this.base.damage,this.time,this.crit,this.index))
						}else if(this.type==102||this.type==115||this.type==151||this.type==167||this.type==175){
							if(entities.players[b].chillTime==0){
								entities.players[b].color.skin.head=[200,250,250]
								entities.players[b].color.skin.body=[190,240,240]
								entities.players[b].color.skin.legs=[175,225,225]
								entities.players[b].color.skin.arms=[180,230,230]
								entities.players[b].base.color.skin.head=[200,250,250]
								entities.players[b].base.color.skin.body=[190,240,240]
								entities.players[b].base.color.skin.legs=[175,225,225]
								entities.players[b].base.color.skin.arms=[180,230,230]
							}
							entities.players[b].chillTime=max(entities.players[b].chillTime,3600)
						}else if(this.type==105){
							for(let d=0,ld=entities.players.length;d<ld;d++){
								if(entities.players[d].index==this.index){
									entities.players[d].life=min(entities.players[d].life+this.damage,entities.players[d].base.life*2)
								}
							}
						}
						if(game.invis){
							entities.players[b].visible=15
						}
						if(this.type==20){
							entities.players[b].DOT.damage+=this.damage/180
							entities.players[b].DOT.active=min(120,entities.players[b].DOT.active+20)
						}else if(this.type==37||this.type==51){
							entities.players[b].DOT.damage+=this.damage/180
							entities.players[b].DOT.active=min(120,entities.players[b].DOT.active+60)
						}else if(this.type==50){
							entities.players[b].DOT.damage+=this.damage/360
							entities.players[b].DOT.active=min(240,entities.players[b].DOT.active+90)
						}
				        entities.players[b].die.killer=this.index
				        entities.players[b].collect.time=450
				    }
				}
			}
        }
		if(this.time>0){
			this.time--
        }else{
			if(this.type==178&&this.active){
				this.explode()
			}
			this.active=false
		}
    }
}