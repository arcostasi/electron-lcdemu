/*
 * Troy's HD44780U Lcd Display Emulator
 * Copyright (c) 2020 Troy Schrapel
 *
 * This code is licensed under the MIT license
 * https://github.com/visrealm/VrEmuLcd
 */
vrEmuLcd={newLCD:function(){alert("vrEmuLcdModule not yet loaded")},setLoadedCallback:function(e){vrEmuLcd._onLoaded=e,vrEmuLcd._isLoaded&&e()},CharacterRom:{A00:0,Japanese:0,A02:1,European:1},_isLoaded:!1,_onLoaded:function(){}};const LCD_CMD_CLEAR=1,LCD_CMD_HOME=2,LCD_CMD_ENTRY_MODE=4,LCD_CMD_ENTRY_MODE_INCREMENT=2,LCD_CMD_ENTRY_MODE_DECREMENT=0,LCD_CMD_ENTRY_MODE_SHIFT=1,LCD_CMD_DISPLAY=8,LCD_CMD_DISPLAY_ON=4,LCD_CMD_DISPLAY_CURSOR=2,LCD_CMD_DISPLAY_CURSOR_BLINK=1,LCD_CMD_SHIFT=16,LCD_CMD_SHIFT_CURSOR=0,LCD_CMD_SHIFT_DISPLAY=8,LCD_CMD_SHIFT_LEFT=0,LCD_CMD_SHIFT_RIGHT=4,LCD_CMD_SET_CGRAM_ADDR=64,LCD_CMD_SET_DRAM_ADDR=128;vrEmuLcd.Schemes={WhiteOnBlue:{BackColor:"#1f1fff",PixelOnColor:"#f0f0ff",PixelOffColor:"#0000e0"},BlackOnBlue:{BackColor:"#5CAAEA",PixelOnColor:"#000941",PixelOffColor:"#518BCA"},BlackOnGreen:{BackColor:"#7DBE00",PixelOnColor:"#000",PixelOffColor:"#6FB900"},RedOnBlack:{BackColor:"#212225",PixelOnColor:"#FB3349",PixelOffColor:"#202729"},BlueOnBlack:{BackColor:"#212225",PixelOnColor:"#B0F7FE",PixelOffColor:"#202729"}},vrEmuLcdModule={onRuntimeInitialized:function(){let e=vrEmuLcdModule.cwrap("vrEmuLcdNew","number",["number","number","number"]),n=vrEmuLcdModule.cwrap("vrEmuLcdDestroy",null,["number"]),r=vrEmuLcdModule.cwrap("vrEmuLcdSendCommand",null,["number","number"]),t=vrEmuLcdModule.cwrap("vrEmuLcdWriteByte",null,["number","number"]),o=vrEmuLcdModule.cwrap("vrEmuLcdWriteString",null,["number","string"]),u=vrEmuLcdModule.cwrap("vrEmuLcdGetDataOffset","number",["number","number","number"]),i=vrEmuLcdModule.cwrap("vrEmuLcdReadByte","number",["number"]),l=vrEmuLcdModule.cwrap("vrEmuLcdReadAddress","number",["number"]),a=vrEmuLcdModule.cwrap("vrEmuLcdUpdatePixels",null,["number"]),d=vrEmuLcdModule.cwrap("vrEmuLcdNumPixelsX","number",["number"]),c=vrEmuLcdModule.cwrap("vrEmuLcdNumPixelsY","number",["number"]),s=vrEmuLcdModule.cwrap("vrEmuLcdPixelState","number",["number","number","number"]);vrEmuLcd.newLCD=function(m,f,_){null==_&&(_=vrEmuLcd.CharacterRom.European);let E=e(m,f,_);return{destroy:function(){n(E)},sendCommand:function(e){r(E,e)},writeByte:function(e){t(E,e)},writeString:function(e){o(E,e)},getDataOffset:function(e,n){u(E,e,n)},readByte:function(){return i(E)},readAddress:function(){return l(E)},numPixelsX:d(E),numPixelsY:c(E),updatePixels:function(){a(E)},pixelState:function(e,n){return s(E,e,n)},colorScheme:vrEmuLcd.Schemes.WhiteOnBlue,render:function(e,n,r,t,o){let u=this.numPixelsX+14,i=this.numPixelsY+7,l=Math.min(o/i,t/u);e.fillStyle=this.colorScheme.BackColor,e.fillRect(n,r,u*l,i*l),this.updatePixels();for(let t=0;t<this.numPixelsY;++t)for(let o=0;o<this.numPixelsX;++o){switch(this.pixelState(o,t)){case-1:continue;case 0:e.fillStyle=this.colorScheme.PixelOffColor;break;case 1:e.fillStyle=this.colorScheme.PixelOnColor}e.fillRect(n+(o+7)*l,r+(t+3.5)*l,.75*l,.75*l)}}}},vrEmuLcd.isLoaded=!0,vrEmuLcd._onLoaded()}};let key,Module="undefined"!=typeof vrEmuLcdModule?vrEmuLcdModule:{},moduleOverrides={};for(key in Module)Module.hasOwnProperty(key)&&(moduleOverrides[key]=Module[key]);let arguments_=[],thisProgram="./this.program",quit_=function(e,n){throw n},ENVIRONMENT_IS_WEB=!1,ENVIRONMENT_IS_WORKER=!1,ENVIRONMENT_IS_NODE=!1,ENVIRONMENT_HAS_NODE=!1,ENVIRONMENT_IS_SHELL=!1;ENVIRONMENT_IS_WEB="object"==typeof window,ENVIRONMENT_IS_WORKER="function"==typeof importScripts,ENVIRONMENT_IS_NODE=(ENVIRONMENT_HAS_NODE="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node)&&!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_WORKER,ENVIRONMENT_IS_SHELL=!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_NODE&&!ENVIRONMENT_IS_WORKER;let read_,readAsync,readBinary,setWindowTitle,scriptDirectory="";function locateFile(e){return Module.locateFile?Module.locateFile(e,scriptDirectory):scriptDirectory+e}if(ENVIRONMENT_IS_NODE){let e,n;scriptDirectory=__dirname+"/",read_=function(r,t){let o;return e||(e=require("fs")),n||(n=require("path")),r=n.normalize(r),o=e.readFileSync(r),t?o:o.toString()},readBinary=function(e){let n=read_(e,!0);return n.buffer||(n=new Uint8Array(n)),assert(n.buffer),n},process.argv.length>1&&(thisProgram=process.argv[1].replace(/\\/g,"/")),arguments_=process.argv.slice(2),"undefined"!=typeof module&&(module.exports=Module),process.on("uncaughtException",function(e){if(!(e instanceof ExitStatus))throw e}),process.on("unhandledRejection",abort),quit_=function(e){process.exit(e)},Module.inspect=function(){return"[Emscripten Module object]"}}else ENVIRONMENT_IS_SHELL?("undefined"!=typeof read&&(read_=function(e){return read(e)}),readBinary=function(e){let n;return"function"==typeof readbuffer?new Uint8Array(readbuffer(e)):(assert("object"==typeof(n=read(e,"binary"))),n)},"undefined"!=typeof scriptArgs?arguments_=scriptArgs:"undefined"!=typeof arguments&&(arguments_=arguments),"function"==typeof quit&&(quit_=function(e){quit(e)}),"undefined"!=typeof print&&("undefined"==typeof console&&(console={}),console.log=print,console.warn=console.error="undefined"!=typeof printErr?printErr:print)):(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)&&(ENVIRONMENT_IS_WORKER?scriptDirectory=self.location.href:document.currentScript&&(scriptDirectory=document.currentScript.src),scriptDirectory=0!==scriptDirectory.indexOf("blob:")?scriptDirectory.substr(0,scriptDirectory.lastIndexOf("/")+1):"",read_=function(e){let n=new XMLHttpRequest;return n.open("GET",e,!1),n.send(null),n.responseText},ENVIRONMENT_IS_WORKER&&(readBinary=function(e){let n=new XMLHttpRequest;return n.open("GET",e,!1),n.responseType="arraybuffer",n.send(null),new Uint8Array(n.response)}),readAsync=function(e,n,r){let t=new XMLHttpRequest;t.open("GET",e,!0),t.responseType="arraybuffer",t.onload=function(){200==t.status||0==t.status&&t.response?n(t.response):r()},t.onerror=r,t.send(null)},setWindowTitle=function(e){document.title=e});let out=Module.print||console.log.bind(console),err=Module.printErr||console.warn.bind(console);for(key in moduleOverrides)moduleOverrides.hasOwnProperty(key)&&(Module[key]=moduleOverrides[key]);moduleOverrides=null,Module.arguments&&(arguments_=Module.arguments),Module.thisProgram&&(thisProgram=Module.thisProgram),Module.quit&&(quit_=Module.quit);let wasmBinary,noExitRuntime,wasmMemory,wasmTable,asm2wasmImports={"f64-rem":function(e,n){return e%n},debugger:function(){}},functionPointers=new Array(0);Module.wasmBinary&&(wasmBinary=Module.wasmBinary),Module.noExitRuntime&&(noExitRuntime=Module.noExitRuntime),"object"!=typeof WebAssembly&&err("no native wasm support detected");let ABORT=!1,EXITSTATUS=0;function assert(e,n){e||abort("Assertion failed: "+n)}function getCFunc(e){let n=Module["_"+e];return assert(n,"Cannot call unknown function "+e+", make sure it is exported"),n}function ccall(e,n,r,t,o){let u={string:function(e){let n=0;if(null!=e&&0!==e){let r=1+(e.length<<2);stringToUTF8(e,n=stackAlloc(r),r)}return n},array:function(e){let n=stackAlloc(e.length);return writeArrayToMemory(e,n),n}};let i=getCFunc(e),l=[],a=0;if(t)for(let e=0;e<t.length;e++){let n=u[r[e]];n?(0===a&&(a=stackSave()),l[e]=n(t[e])):l[e]=t[e]}let d=i.apply(null,l);return d=function(e){return"string"===n?UTF8ToString(e):"boolean"===n?Boolean(e):e}(d),0!==a&&stackRestore(a),d}function cwrap(e,n,r,t){let o=(r=r||[]).every(function(e){return"number"===e});return"string"!==n&&o&&!t?getCFunc(e):function(){return ccall(e,n,r,arguments,t)}}let UTF8Decoder="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;function UTF8ArrayToString(e,n,r){let t=n+r,o=n;for(;e[o]&&!(o>=t);)++o;if(o-n>16&&e.subarray&&UTF8Decoder)return UTF8Decoder.decode(e.subarray(n,o));{let r="";for(;n<o;){let t=e[n++];if(!(128&t)){r+=String.fromCharCode(t);continue}let o=63&e[n++];if(192==(224&t)){r+=String.fromCharCode((31&t)<<6|o);continue}let u=63&e[n++];if((t=224==(240&t)?(15&t)<<12|o<<6|u:(7&t)<<18|o<<12|u<<6|63&e[n++])<65536)r+=String.fromCharCode(t);else{let e=t-65536;r+=String.fromCharCode(55296|e>>10,56320|1023&e)}}}return str}function UTF8ToString(e,n){return e?UTF8ArrayToString(HEAPU8,e,n):""}function stringToUTF8Array(e,n,r,t){if(!(t>0))return 0;let o=r,u=r+t-1;for(let t=0;t<e.length;++t){let o=e.charCodeAt(t);if(o>=55296&&o<=57343){o=65536+((1023&o)<<10)|1023&e.charCodeAt(++t)}if(o<=127){if(r>=u)break;n[r++]=o}else if(o<=2047){if(r+1>=u)break;n[r++]=192|o>>6,n[r++]=128|63&o}else if(o<=65535){if(r+2>=u)break;n[r++]=224|o>>12,n[r++]=128|o>>6&63,n[r++]=128|63&o}else{if(r+3>=u)break;n[r++]=240|o>>18,n[r++]=128|o>>12&63,n[r++]=128|o>>6&63,n[r++]=128|63&o}}return n[r]=0,r-o}function stringToUTF8(e,n,r){return stringToUTF8Array(e,HEAPU8,n,r)}let UTF16Decoder="undefined"!=typeof TextDecoder?new TextDecoder("utf-16le"):void 0;function writeArrayToMemory(e,n){HEAP8.set(e,n)}let buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64,WASM_PAGE_SIZE=65536;function updateGlobalBufferAndViews(e){buffer=e,Module.HEAP8=HEAP8=new Int8Array(e),Module.HEAP16=HEAP16=new Int16Array(e),Module.HEAP32=HEAP32=new Int32Array(e),Module.HEAPU8=HEAPU8=new Uint8Array(e),Module.HEAPU16=HEAPU16=new Uint16Array(e),Module.HEAPU32=HEAPU32=new Uint32Array(e),Module.HEAPF32=HEAPF32=new Float32Array(e),Module.HEAPF64=HEAPF64=new Float64Array(e)}let DYNAMIC_BASE=5248080,DYNAMICTOP_PTR=5168,INITIAL_TOTAL_MEMORY=Module.TOTAL_MEMORY||16777216;function callRuntimeCallbacks(e){for(;e.length>0;){let n=e.shift();if("function"==typeof n){n();continue}let r=n.func;"number"==typeof r?void 0===n.arg?Module.dynCall_v(r):Module.dynCall_vi(r,n.arg):r(void 0===n.arg?null:n.arg)}}(wasmMemory=Module.wasmMemory?Module.wasmMemory:new WebAssembly.Memory({initial:INITIAL_TOTAL_MEMORY/WASM_PAGE_SIZE,maximum:INITIAL_TOTAL_MEMORY/WASM_PAGE_SIZE}))&&(buffer=wasmMemory.buffer),INITIAL_TOTAL_MEMORY=buffer.byteLength,updateGlobalBufferAndViews(buffer),HEAP32[DYNAMICTOP_PTR>>2]=DYNAMIC_BASE;let __ATPRERUN__=[],__ATINIT__=[],__ATMAIN__=[],__ATPOSTRUN__=[],runtimeInitialized=!1;function preRun(){if(Module.preRun)for("function"==typeof Module.preRun&&(Module.preRun=[Module.preRun]);Module.preRun.length;)addOnPreRun(Module.preRun.shift());callRuntimeCallbacks(__ATPRERUN__)}function initRuntime(){runtimeInitialized=!0,callRuntimeCallbacks(__ATINIT__)}function preMain(){callRuntimeCallbacks(__ATMAIN__)}function postRun(){if(Module.postRun)for("function"==typeof Module.postRun&&(Module.postRun=[Module.postRun]);Module.postRun.length;)addOnPostRun(Module.postRun.shift());callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(e){__ATPRERUN__.unshift(e)}function addOnPostRun(e){__ATPOSTRUN__.unshift(e)}let runDependencies=0,runDependencyWatcher=null,dependenciesFulfilled=null;function addRunDependency(e){runDependencies++,Module.monitorRunDependencies&&Module.monitorRunDependencies(runDependencies)}function removeRunDependency(e){if(runDependencies--,Module.monitorRunDependencies&&Module.monitorRunDependencies(runDependencies),0==runDependencies&&(null!==runDependencyWatcher&&(clearInterval(runDependencyWatcher),runDependencyWatcher=null),dependenciesFulfilled)){let e=dependenciesFulfilled;dependenciesFulfilled=null,e()}}Module.preloadedImages={},Module.preloadedAudios={};let dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(e){return String.prototype.startsWith?e.startsWith(dataURIPrefix):0===e.indexOf(dataURIPrefix)}let wasmBinaryFile="vrEmuLcd.wasm";function getBinary(){try{if(wasmBinary)return new Uint8Array(wasmBinary);if(readBinary)return readBinary(wasmBinaryFile);throw"both async and sync fetching of the wasm failed"}catch(e){abort(e)}}function getBinaryPromise(){return wasmBinary||!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_WORKER||"function"!=typeof fetch?new Promise(function(e,n){e(getBinary())}):fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(e){if(!e.ok)throw"failed to load wasm binary file at '"+wasmBinaryFile+"'";return e.arrayBuffer()}).catch(function(){return getBinary()})}function createWasm(e){let n={env:e,global:{NaN:NaN,Infinity:1/0},"global.Math":Math,asm2wasm:asm2wasmImports};function r(e,n){let r=e.exports;Module.asm=r,removeRunDependency("wasm-instantiate")}function t(e){r(e.instance)}function o(e){return getBinaryPromise().then(function(e){return WebAssembly.instantiate(e,n)}).then(e,function(e){err("failed to asynchronously prepare wasm: "+e),abort(e)})}if(addRunDependency("wasm-instantiate"),Module.instantiateWasm)try{return Module.instantiateWasm(n,r)}catch(e){return err("Module.instantiateWasm callback failed with error: "+e),!1}return function(){if(wasmBinary||"function"!=typeof WebAssembly.instantiateStreaming||isDataURI(wasmBinaryFile)||"function"!=typeof fetch)return o(t);fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(e){return WebAssembly.instantiateStreaming(e,n).then(t,function(e){err("wasm streaming compile failed: "+e),err("falling back to ArrayBuffer instantiation"),o(t)})})}(),{}}function _clock(){return void 0===_clock.start&&(_clock.start=Date.now()),1e3*(Date.now()-_clock.start)|0}function _emscripten_get_heap_size(){return HEAP8.length}function ___setErrNo(e){return Module.___errno_location&&(HEAP32[Module.___errno_location()>>2]=e),e}function abortOnCannotGrowMemory(e){abort("OOM")}function _emscripten_resize_heap(e){abortOnCannotGrowMemory(e)}isDataURI(wasmBinaryFile)||(wasmBinaryFile=locateFile(wasmBinaryFile)),Module.asm=function(e,n,r){return n.memory=wasmMemory,n.table=wasmTable=new WebAssembly.Table({initial:0,maximum:0,element:"anyfunc"}),n.__memory_base=1024,n.__table_base=0,createWasm(n)};let asmGlobalArg={},asmLibraryArg={b:___setErrNo,f:_clock,e:_emscripten_get_heap_size,d:_emscripten_resize_heap,c:abortOnCannotGrowMemory,a:DYNAMICTOP_PTR},asm=Module.asm(asmGlobalArg,asmLibraryArg,buffer);Module.asm=asm;let calledRun,___errno_location=Module.___errno_location=function(){return Module.asm.g.apply(null,arguments)},_vrEmuLcdCharBits=Module._vrEmuLcdCharBits=function(){return Module.asm.h.apply(null,arguments)},_vrEmuLcdDestroy=Module._vrEmuLcdDestroy=function(){return Module.asm.i.apply(null,arguments)},_vrEmuLcdGetDataOffset=Module._vrEmuLcdGetDataOffset=function(){return Module.asm.j.apply(null,arguments)},_vrEmuLcdNew=Module._vrEmuLcdNew=function(){return Module.asm.k.apply(null,arguments)},_vrEmuLcdNumPixels=Module._vrEmuLcdNumPixels=function(){return Module.asm.l.apply(null,arguments)},_vrEmuLcdNumPixelsX=Module._vrEmuLcdNumPixelsX=function(){return Module.asm.m.apply(null,arguments)},_vrEmuLcdNumPixelsY=Module._vrEmuLcdNumPixelsY=function(){return Module.asm.n.apply(null,arguments)},_vrEmuLcdPixelState=Module._vrEmuLcdPixelState=function(){return Module.asm.o.apply(null,arguments)},_vrEmuLcdReadAddress=Module._vrEmuLcdReadAddress=function(){return Module.asm.p.apply(null,arguments)},_vrEmuLcdReadByte=Module._vrEmuLcdReadByte=function(){return Module.asm.q.apply(null,arguments)},_vrEmuLcdSendCommand=Module._vrEmuLcdSendCommand=function(){return Module.asm.r.apply(null,arguments)},_vrEmuLcdUpdatePixels=Module._vrEmuLcdUpdatePixels=function(){return Module.asm.s.apply(null,arguments)},_vrEmuLcdWriteByte=Module._vrEmuLcdWriteByte=function(){return Module.asm.t.apply(null,arguments)},_vrEmuLcdWriteString=Module._vrEmuLcdWriteString=function(){return Module.asm.u.apply(null,arguments)},stackAlloc=Module.stackAlloc=function(){return Module.asm.v.apply(null,arguments)},stackRestore=Module.stackRestore=function(){return Module.asm.w.apply(null,arguments)},stackSave=Module.stackSave=function(){return Module.asm.x.apply(null,arguments)};function ExitStatus(e){this.name="ExitStatus",this.message="Program terminated with exit("+e+")",this.status=e}function run(e){function n(){calledRun||(calledRun=!0,ABORT||(initRuntime(),preMain(),Module.onRuntimeInitialized&&Module.onRuntimeInitialized(),postRun()))}e=e||arguments_,runDependencies>0||(preRun(),runDependencies>0||(Module.setStatus?(Module.setStatus("Running..."),setTimeout(function(){setTimeout(function(){Module.setStatus("")},1),n()},1)):n()))}function abort(e){throw Module.onAbort&&Module.onAbort(e),out(e+=""),err(e),ABORT=!0,EXITSTATUS=1,"abort("+e+"). Build with -s ASSERTIONS=1 for more info."}if(Module.asm=asm,Module.ccall=ccall,Module.cwrap=cwrap,dependenciesFulfilled=function e(){calledRun||run(),calledRun||(dependenciesFulfilled=e)},Module.run=run,Module.abort=abort,Module.preInit)for("function"==typeof Module.preInit&&(Module.preInit=[Module.preInit]);Module.preInit.length>0;)Module.preInit.pop()();noExitRuntime=!0,run();
