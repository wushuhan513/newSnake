
var SoundType = require('SoundType');

cc.Class({
    extends: cc.Component,

    properties: {

        SoundList:
        {
            default: [],   
            type: [cc.AudioClip],
        },

        //是否暂停背景音乐
        _EnableMusic: true,
        _OldVolume: 1,
        _BgVolume: 1,
        //音效
        _OldSoundVolume: 1,
        _SoundVolume: 1,
        //当前播放背景音乐ID
        _CurPlayMusic: -1,
    },

    onLoad ()
    {
        cc.log('SoundManager onLoad----------------------------------');    
    },

    start () 
    {
        cc.log('SoundManager start-------------------------');

       this.playSound(SoundType.SoundType_Bg);
    },

    //播放声音 resIndex：声音索引
    playSound(soundInfo)
    {
        
        if(soundInfo.ID >= this.SoundList.length)
        {
            cc.log("playSound resIndex invalid ");
            return;
        }
        //背景音乐
        if(soundInfo.IsLoop)
        {
            if(this._CurPlayMusic == -1)
            {
                var retID =  cc.audioEngine.play(this.SoundList[soundInfo.ID], soundInfo.IsLoop);
                this._CurPlayMusic  = retID;
                cc.audioEngine.setVolume(retID, this._BgVolume);
            }
        }else
        {
            var retID =  cc.audioEngine.play(this.SoundList[soundInfo.ID], soundInfo.IsLoop);
            cc.audioEngine.setVolume(retID, this._SoundVolume);
        }

    },
    
    //停止声音
    stopSound(soundInfo)
    {
        
        //cc.log('stopSound', soundInfo, this._PlayList);
        if(soundInfo.ID >= this.SoundList.length)
        {
            cc.log("stopSound resIndex invalid ");
            return;
        }

    },


    //停止所有
    stopAll()
    {
        this._CurPlayMusic = -1;
        cc.audioEngine.stopAll();       
    },
    
    //开启背景音乐
    enableBgMusic(isEnable)
    {
        if(isEnable)
        {
            this._BgVolume = this._OldVolume;                      
        }else
        {
            this._BgVolume = 0;    
        }
        if(this._CurPlayMusic != -1)
        {
            cc.audioEngine.setVolume(this._CurPlayMusic, this._BgVolume);
        }
    },

    //开启音效
    enableSound(isEnable)
    {
        if(isEnable)
        {
            this._SoundVolume = this._OldSoundVolume;                      
        }else
        {
            this._SoundVolume = 0;    
        }

    },

    //设置音乐音量
    setMusicVolume(volume)
    {
        this._OldVolume = volume;

        if(this._CurPlayMusic != -1)
        {
            cc.audioEngine.setVolume(this._CurPlayMusic, volume);
        }
    },

    setSoundVolume(volume)
    {
        this._OldSoundVolume = volume;
        
    },
    
    // update (dt) {},
});
