const {chromium}=require('playwright');const {spawn}=require('child_process');const fs=require('fs');
const [,,name,f0,f1]=process.argv;
(async()=>{const b=await chromium.launch({args:['--allow-file-access-from-files']});const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+__dirname+'/index.html');await p.evaluate(()=>window.readyP);
const tmp=`parts/${name}.tmp.mp4`;
const ff=spawn('ffmpeg',['-y','-v','error','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','19','-pix_fmt','yuv420p','-r','30',tmp]);
for(let n=+f0;n<+f1;n++){await p.evaluate(t=>seek(t),n/30);const buf=await p.screenshot({type:'jpeg',quality:92});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));}
ff.stdin.end();ff.on('close',c=>{if(c===0)fs.renameSync(tmp,`parts/${name}.mp4`);console.log(name,c);b.close();});
})();
