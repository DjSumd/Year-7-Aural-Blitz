// content.js — MOUNT LAWLEY SHS · Year 7 Music Aural Blitz (WA Curriculum Years 7–10).
// Every setting carries a year tag (yr). Defaults = the Year 7 column of the curriculum map;
// the year selector raises the defaults, and ⚙ lets a student open any item up to Year 10.
// Kinds: 'choice' | 'notate' | 'pitchdict' | 'melodydict' | 'rhythmdict' | 'numerals' | 'contour'.

function A_pick(a){return a[(Math.random()*a.length)|0];}
function A_shuf(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];}return a;}
function A_root(lo,hi){return lo+((Math.random()*(hi-lo+1))|0);}
function A_opts(pool,must,n){const others=A_shuf(pool.filter(x=>x!==must));const out=[must];
  for(const o of others){if(out.length>=n)break;if(!out.includes(o))out.push(o);}return A_shuf(out);}
// cfg groups: items {id,label,yr}; single groups: def may be a string or {year:value}
const G=(key,label,items)=>({key,type:'multi',label,items});
const SG=(key,label,items,def)=>({key,type:'single',label,items,def});
const Y=(id,label,yr)=>({id,label:label||id,yr:yr||7});
const ACC_TXT={'':'',s:'♯',f:'♭',n:'♮',ss:'𝄪',ff:'♭♭'};
const noteName=n=>n.letter+ACC_TXT[n.acc||''];
const ROOTS=[['G','',55],['A','',57],['B','f',58],['C','',60],['D','',62],['E','f',63],['E','',64],['F','',65]];
const LET7=['C','D','E','F','G','A','B'];
function spellFrom(rootLetter,rootMidi,semi,lstep){const L=LET7[(LET7.indexOf(rootLetter)+lstep)%7];return ENGRAVE.spellNote(rootMidi+semi,L);}
const INSTR={
  flute:{name:'Flute',fam:'Woodwind',lo:67,hi:79}, clarinet:{name:'Clarinet',fam:'Woodwind',lo:55,hi:67}, saxophone:{name:'Saxophone',fam:'Woodwind',lo:55,hi:67},
  trumpet:{name:'Trumpet',fam:'Brass',lo:58,hi:70}, trombone:{name:'Trombone',fam:'Brass',lo:43,hi:53},
  violin:{name:'Violin',fam:'Strings',lo:62,hi:76}, cello:{name:'Cello',fam:'Strings',lo:41,hi:53},
  guitar:{name:'Acoustic guitar',fam:'Guitars',lo:48,hi:60}, piano:{name:'Piano',fam:'Keyboard',lo:55,hi:72},
  xylophone:{name:'Xylophone',fam:'Percussion',lo:79,hi:88}
};
const IVL={m2:{n:'Minor 2nd (semitone)',s:1,l:1,up:'Jaws',dn:'Für Elise'},M2:{n:'Major 2nd (tone)',s:2,l:1,up:'Happy Birthday',dn:'Mary Had a Little Lamb'},
  m3:{n:'Minor 3rd',s:3,l:2,up:'Greensleeves',dn:'Hey Jude'},M3:{n:'Major 3rd',s:4,l:2,up:'When the Saints',dn:'Swing Low, Sweet Chariot'},
  P4:{n:'Perfect 4th',s:5,l:3,up:'Here Comes the Bride',dn:'Eine kleine Nachtmusik'},P5:{n:'Perfect 5th',s:7,l:4,up:'Star Wars / Twinkle Twinkle',dn:'The Flintstones'},
  m6:{n:'Minor 6th',s:8,l:5,up:'The Entertainer',dn:'Love Story'},M6:{n:'Major 6th',s:9,l:5,up:'My Bonnie',dn:'Nobody Knows the Trouble'},
  m7:{n:'Minor 7th',s:10,l:6,up:'Star Trek',dn:'Watermelon Man'},M7:{n:'Major 7th',s:11,l:6,up:'Take On Me',dn:'I Love You'},P8:{n:'Octave',s:12,l:7,up:'Somewhere Over the Rainbow',dn:'Willow Weep for Me'}};
const CHORDQ={'Major':{iv:[0,4,7],cue:'bright, happy, settled'},'Minor':{iv:[0,3,7],cue:'darker, sadder — the middle note is lower'},'Dominant 7th':{iv:[0,4,7,10],cue:'a major chord with an extra note on top that wants to move on'},'Diminished':{iv:[0,3,6],cue:'tense and unsettled'}};
function voiced(root,ivls,inv){let n=ivls.map(i=>root+i);const k=Math.min(inv||0,n.length-1);for(let j=0;j<k;j++){const mn=Math.min.apply(null,n);n[n.indexOf(mn)]+=12;}return n;}
const TY={'':[0,4,7],'mi':[0,3,7],'dim':[0,3,6],'7':[0,4,7,10]};
const PROGSET={
 'Major':[['I',0,'','I',8],['IV',5,'','IV',8],['V',7,'','V',8],['vi',9,'mi','vi',9],['V7',7,'7','V',9],['ii',2,'mi','ii',10]],
 'Minor':[['i',0,'mi','I',9],['iv',5,'mi','IV',9],['V',7,'','V',9],['VI',8,'','vi',10],['V7',7,'7','V',10]]
};
const GRAMMAR={I:['IV','V','vi','IV','V','ii'],ii:['V','V'],IV:['V','I','ii','V'],V:['I','vi','I'],vi:['IV','ii','V']};
function fmtRN(l){return l.replace(/(7)$/,'<sup>$1</sup>');}
function genProgression(set,L){const byFn=f=>set.filter(e=>e[3]===f);const has=f=>byFn(f).length>0;
  for(let attempt=0;attempt<60;attempt++){
    const fns=['I']; for(let i=1;i<L-1;i++){const prev=fns[i-1];const opts=(GRAMMAR[prev]||['V']).filter(has);fns.push(opts.length?A_pick(opts):'V');}
    if(L>2&&fns[L-2]!=='V'&&fns[L-2]!=='IV'){ if(has('V'))fns[L-2]='V'; else continue; }
    fns.push('I'); if(fns.some((f,i)=>i>0&&f===fns[i-1]))continue;
    const seq=fns.map((f,i)=>{const c=byFn(f);if(i===L-1||i===0)return c[0];return A_pick(c);}); return seq; }
  return [set[0],byFn('IV')[0]||set[0],byFn('V')[0]||set[0],set[0]];}
const _pc=m=>((m%12)+12)%12;
function _nearOct(from,pc){const LO=52,HI=81;const base=from-_pc(from)+pc;let best=base;[base-12,base,base+12].forEach(c=>{if(Math.abs(c-from)<Math.abs(best-from))best=c;});while(best<LO)best+=12;while(best>HI)best-=12;return best;}
const _PERMS=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
function _realizeNear(prev,t){let best=null,bc=1e9;for(const pm of _PERMS){const v=[0,0,0];let cost=0;for(let j=0;j<3;j++){const m=_nearOct(prev[j],t[pm[j]]);v[j]=m;cost+=Math.abs(m-prev[j]);}if(cost<bc){bc=cost;best=v;}}return best;}
function _upper3(t){return t.length<=3?[t[0],t[1],t[2]]:[t[1],t[2],t[3]];}
function voiceProg(seq,keyRoot){const upperPC=seq.map(e=>_upper3((TY[e[2]]||[0,4,7]).map(iv=>_pc(keyRoot+e[1]+iv))));
  let prev=_realizeNear([60,64,67],upperPC[0]);const voices=[prev.slice()];for(let i=1;i<upperPC.length;i++){prev=_realizeNear(prev,upperPC[i]);voices.push(prev.slice());}
  return seq.map((e,i)=>{let bm=keyRoot+e[1];while(bm>=48)bm-=12;while(bm<33)bm+=12;return [bm].concat(voices[i]);});}
function outlineMelody(root,steps,len,rhythmic){const pool=steps.filter(s=>s<12);const idxs=[0];let i=0;len=len||8;
  for(let k=1;k<len-1;k++){i=Math.max(0,Math.min(pool.length-1,i+A_pick([-2,-1,-1,1,1,2])));idxs.push(i);}
  idxs.push(0);const mids=idxs.map(x=>root+pool[x]);const durs=idxs.map(()=>rhythmic?A_pick([1,1,0.5,0.5,1.5,0.5]):A_pick([1,1,1,0.5]));durs[durs.length-1]=2;return {mids,durs};}
function colourMelody(root,steps,colours,len){len=len||12;const pool=steps.filter(s=>s<=12);const want=(colours||[]).map(c=>c%12);
  const build=()=>{let i=pool.indexOf(0);if(i<0)i=0;const idxs=[i];for(let k=1;k<len-1;k++){const dir=k<len*0.45?A_pick([1,1,2,-1,1]):A_pick([-1,-1,-2,1,-1]);i=Math.max(0,Math.min(pool.length-1,i+dir));idxs.push(i);}idxs.push(pool.indexOf(0)>=0?pool.indexOf(0):0);return idxs;};
  let idxs=build(),tries=0;const has=ix=>want.every(w=>ix.some(i=>pool[i]%12===w));while(!has(idxs)&&tries++<40)idxs=build();
  if(!has(idxs)){const missing=want.filter(w=>!idxs.some(i=>pool[i]%12===w));let pos=Math.floor(len/2)-1;missing.forEach(w=>{const pi=pool.findIndex(p=>p%12===w);if(pi>=0){idxs[pos]=pi;pos+=2;}});}
  const mids=idxs.map(x=>root+pool[x]);const durs=idxs.map(()=>A_pick([1,1,0.5,0.5,1.5,0.5]));durs[durs.length-1]=2;return {mids,durs};}
function chordMelody(chords,cb,keyRoot,scale){const mids=[],durs=[];let last=keyRoot+12;
  chords.forEach(ch=>{const tones=ch.slice(1).map(_pc);let beat=0;
    while(beat<cb-1e-6){const strong=beat===0;const d=(cb-beat>=1&&Math.random()<0.55)?1:0.5;let cand;
      if(strong||Math.random()<0.5){const opts=[];for(let m=last-7;m<=last+7;m++)if(tones.includes(_pc(m))&&m>=keyRoot+7&&m<=keyRoot+24)opts.push(m);cand=opts.length?opts.reduce((b,m)=>Math.abs(m-last)<Math.abs(b-last)?m:b,opts[0]):last;if(Math.random()<0.4&&opts.length>1)cand=A_pick(opts);}
      else{const opts=[];for(let m=last-2;m<=last+2;m++)if(m!==last&&scale.includes(_pc(m-keyRoot))&&m>=keyRoot+7&&m<=keyRoot+24)opts.push(m);cand=opts.length?A_pick(opts):last;}
      mids.push(cand);durs.push(Math.min(d,cb-beat));last=cand;beat+=Math.min(d,cb-beat);}});return {mids,durs};}
const MAJ=[0,2,4,5,7,9,11], MINN=[0,2,3,5,7,8,10], MINH=[0,2,3,5,7,8,11], PENT=[0,2,4,7,9], MPENT=[0,3,5,7,10];
const KEYS_MAJ=[['C',60],['G',67],['F',65],['D',62],['B',70],['A',69],['E',63]]; const KEYS_MIN=[['A',57],['E',64],['D',62],['B',59],['G',67]];
const KEY_KS={60:0,67:1,65:-1,62:2,70:-2,69:3,63:-3,57:0,64:1,59:2};
const KEY_ACC={70:'f',63:'f'};
const SUFFIX={'':'','mi':'m','dim':'°','7':'7'};
const OFF_STEP={0:0,2:1,3:2,4:2,5:3,7:4,8:5,9:5,10:6,11:6};
function chordName(keyLetter,keyMidi,entry){const n=spellFrom(keyLetter,keyMidi,entry[1]%12,OFF_STEP[entry[1]%12]);return noteName(n)+(SUFFIX[entry[2]]||'');}
function keyDisplay(k){return k[0]+(KEY_ACC[k[1]]==='f'?'♭':'');}
const maxKsFor=yr=>yr>=10?7:yr-6;   // Year 7: 1 accidental, Year 8: 2, Year 9: 3, Year 10: any
// rhythm vocabulary from ticked chips
function vocabFrom(v){return {vocab:{semis:v.includes('semis'),mixedSemis:v.includes('mixed'),dotted:v.includes('dotted'),quaverCrotchet:v.includes('qc'),sixSemis:v.includes('sixsemis'),crotDotQuav:v.includes('cdq'),whole:true},
  vocabEasy:true,rests:v.some(x=>x.indexOf('rest')===0),restDurs:[v.includes('rest1')?1:null,v.includes('rest1')?2:null,v.includes('rest4')?4:null,v.includes('rest05')?0.5:null].filter(x=>x!=null),
  ties:v.includes('ties'),syncopation:v.includes('synco'),anacrusis:v.includes('anac'),triplets:v.includes('trip')};}
const RHYTHM_VOCAB=[Y('semis','Four semiquavers',7),Y('rest1','Crotchet & minim rests',7),Y('mixed','Quaver–semiquaver mixes',8),Y('dotted','Dotted notes',8),Y('sixsemis','Six-semiquaver groups (6/8)',8),Y('rest4','Semibreve rest',8),Y('anac','Anacrusis',8),Y('ties','Ties',8),
  Y('qc','Quaver–crotchet (6/8)',9),Y('synco','Syncopation',9),Y('rest05','Quaver rest',9),Y('trip','Triplets',9),Y('cdq','Crotchet–dotted crotchet–quaver (6/8)',10)];
const METRE_ITEMS=[Y('2/4','2/4',7),Y('3/4','3/4',7),Y('4/4','4/4',7),Y('6/8','6/8',7),Y('12/8','12/8',9),Y('9/8','9/8',10),Y('5/4','5/4',10),Y('7/8','7/8',10)];
// a scale-based tune that resolves on the tonic, for tonality/texture/form
const TUNE=(root,steps,len)=>colourMelody(root,steps.concat([12]),steps.includes(3)?[3]:steps.includes(4)?[4]:[],len||10);

const UNITS=[
 {name:'Pulse & metre', key:'met', ask:'Listen — what is the metre?',
  guide:`<p class="prompt">Pulse &amp; metre</p><ul><li>Tap the beat. Find the <b>strong</b> beat (beat 1) and count until it comes again: 2, 3 or 4 beats a bar.</li>
   <li>Does each beat split in <b>two</b> (simple time — march, waltz) or in <b>three</b> (compound time — a lilt or jig, 6/8)?</li>
   <li>In ⚙ choose <b>Groove</b> (a band-style pattern) or <b>Click pulse</b>.</li></ul>`,
  cfg:[ G('metres','Metres',METRE_ITEMS), SG('style','Play as',[{id:'music',label:'Groove'},{id:'pulse',label:'Click pulse'}],'music') ],
  gen(ctx){const MET={
     '2/4':{l:'2/4 — two beats a bar (simple duple)',p:['S','s','b','s'],spb:0.32,why:'two beats, each splitting in two — like a march.'},
     '3/4':{l:'3/4 — three beats a bar (simple triple)',p:['S','s','b','s','b','s'],spb:0.32,why:'strong, weak, weak — a waltz.'},
     '4/4':{l:'4/4 — four beats a bar (simple quadruple)',p:['S','s','b','s','M','s','b','s'],spb:0.30,why:'four beats, with a lighter accent on beat 3 — most pop songs.'},
     '6/8':{l:'6/8 — two big beats, each in three (compound duple)',p:['S','s','s','M','s','s'],spb:0.24,why:'two dotted-crotchet beats, each splitting into three quavers — a lilt or jig.'},
     '9/8':{l:'9/8 — three beats in three (compound triple)',p:['S','s','s','M','s','s','M','s','s'],spb:0.23,why:'three dotted-crotchet beats, each in three.'},
     '12/8':{l:'12/8 — four beats in three (compound quadruple)',p:['S','s','s','b','s','s','M','s','s','b','s','s'],spb:0.21,why:'four dotted-crotchet beats in three — a slow blues shuffle.'},
     '5/4':{l:'5/4 — irregular (3+2)',p:['S','s','b','s','b','s','M','s','b','s'],spb:0.30,why:'five beats grouped 3+2 — the accents fall unevenly.'},
     '7/8':{l:'7/8 — irregular (2+2+3)',p:['S','s','M','s','M','s','s'],spb:0.26,why:'seven quavers grouped 2+2+3 — the last group is longer.'}};
    const ids=ctx.cfg('metres'),id=A_pick(ids),m=MET[id],asMusic=ctx.cfg('style')==='music';
    return {kind:'choice',options:A_shuf(ids.map(x=>MET[x].l)),answer:m.l,
      play:()=>asMusic?AUDIO.metreGroove(m.p,m.spb):AUDIO.groove(m.p,m.spb),playLabel:asMusic?'A groove — find beat 1 and count':'Click pulse — find beat 1 and count',why:`${m.l}: ${m.why}`};}},

 {name:'Rhythm patterns', key:'rd', ask:'Notate the rhythm you hear.',
  guide:`<p class="prompt">Rhythm patterns</p><ul><li>You get a one-bar count-in. Count the beats first, then work out how each beat is split.</li>
   <li>Tap a note value (or Rest), then tap the stave to write it at the cursor. ✕ removes a note. Check when the bars are full.</li>
   <li>Year 7 uses semibreves, minims, crotchets, quaver pairs and four semiquavers (plus dotted crotchets and three quavers in 6/8). ⚙ opens up dotted notes, ties, anacrusis, syncopation and more for Years 8–10.</li></ul>`,
  cfg:[ G('metres','Time signatures',METRE_ITEMS.map(m=>m.id==='6/8'?Y('6/8','6/8',8):m)), SG('bars','Length',[{id:'1',label:'1 bar'},{id:'2',label:'2 bars'},{id:'4',label:'4 bars'}],{7:'2',9:'4'}),
        G('vocab','Rhythm vocabulary',RHYTHM_VOCAB), SG('swing','Feel',[{id:'off',label:'Straight'},{id:'on',label:'Swing (Year 9)'}],'off') ],
  gen(ctx){const bars=parseInt(ctx.cfg('bars'),10)||2,v=ctx.cfg('vocab'),metre=A_pick(ctx.cfg('metres'));
    const compound=['6/8','9/8','12/8'].indexOf(metre)>=0,swing=!compound&&ctx.cfg('swing')==='on';
    const vo=vocabFrom(v); if(swing)vo.triplets=false;
    const dict=ENGRAVE.buildDictation(Object.assign({diff:ctx.diff,bars,metre},vo));
    const MID=34; dict.notes.forEach(n=>{ if(!n.rest)n.midi=74; n.d=MID; n.acc=''; n.letter='B'; }); dict.ks=0;
    return {kind:'rhythmdict',dict,rhythmOnly:true,swing,given:1,multiPlay:true,scaleName:metre+(dict.pickup?' · starts with an upbeat (anacrusis)':''),
      prompt:'Notate the rhythm you hear in '+metre+(swing?' (swing)':''),why:(compound?'Compound time — each beat is a dotted crotchet that splits into three quavers.':'Simple time — each beat splits into two quavers.')+' Count the beats first, then the splits.'};}},

 {name:'Steps & leaps', key:'ivl', ask:'Listen — how does the melody move?', canNotate:true,
  guide:`<p class="prompt">Steps, leaps &amp; intervals</p><ul><li>A <b>step</b> moves to the next note (a 2nd); a <b>leap</b> jumps further. A <b>semitone</b> is the smallest step (like Jaws); a <b>tone</b> is two semitones (Happy Birthday).</li>
   <li>The <b>perfect 5th</b> is the Star Wars leap; the <b>octave</b> is "Somewhere Over the Rainbow".</li>
   <li>Year 8 names every interval up to the octave (ascending); Year 9 adds 6ths and 7ths and descending. Switch the question type in ⚙.</li></ul>`,
  cfg:[ G('qtype','Question type',[Y('move','Step, leap or repeat?',7),Y('st','Semitone or tone?',7),Y('name','Name the interval',8)]),
        G('ivls','Intervals (for "Name the interval")',[Y('m2','Minor 2nd (semitone)',8),Y('M2','Major 2nd (tone)',8),Y('m3','Minor 3rd',8),Y('M3','Major 3rd',8),Y('P4','Perfect 4th',8),Y('P5','Perfect 5th',7),Y('P8','Octave',7),Y('m6','Minor 6th',9),Y('M6','Major 6th',9),Y('m7','Minor 7th',9),Y('M7','Major 7th',9)]),
        G('dir','Direction',[Y('up','Ascending',7),Y('down','Descending',9),Y('harm','Together (harmonic)',10)]) ],
  gen(ctx){const qts=ctx.cfg('qtype'),qt=A_pick(qts),dirs=ctx.cfg('dir'),R=A_pick(ROOTS),root=R[2],rootN={letter:R[0],acc:R[1]};
    if(qt==='move'&&ctx.mode!=='notate'){const kind=A_pick(['step','leap','repeat']);const semi=kind==='repeat'?0:kind==='step'?A_pick([1,2]):A_pick([5,7,9,12]);const dir=A_pick(dirs.filter(d=>d!=='harm').length?dirs.filter(d=>d!=='harm'):['up']);
      return {kind:'choice',options:['Step','Leap','Repeat (same note)'],answer:kind==='step'?'Step':kind==='leap'?'Leap':'Repeat (same note)',
        play:()=>AUDIO.interval(root,semi,dir),playLabel:'Two notes — step, leap or the same note?',why:kind==='step'?'A step: the second note is the very next note up or down.':kind==='leap'?'A leap: the melody jumps over at least one note ('+semi+' semitones).':'The same note twice — a repeat.'};}
    if(qt==='st'&&ctx.mode!=='notate'){const semi=A_pick([1,2]);const dir=A_pick(dirs.filter(d=>d!=='harm').length?dirs.filter(d=>d!=='harm'):['up']);
      return {kind:'choice',options:['Semitone','Tone'],answer:semi===1?'Semitone':'Tone',play:()=>AUDIO.interval(root,semi,dir),playLabel:'Two notes — semitone or tone?',why:semi===1?'A semitone — the smallest step (one key to the very next). Think Jaws.':'A tone — two semitones. Think the first two notes of Happy Birthday.'};}
    const ivls=ctx.cfg('ivls'),code=A_pick(ivls),iv=IVL[code],topN=spellFrom(R[0],root,iv.s,iv.l);
    if(ctx.mode==='notate'){return {kind:'notate',clef:'treble',given:1,enharm:true,notes:[[R[0],Math.floor(root/12)-1,R[1]],[topN.letter,topN.octave,topN.acc]],mids:[root,root+iv.s],
        play:()=>AUDIO.interval(root,iv.s,'up'),playLabel:'Ascending interval — write the top note',prompt:'Write the note that completes the interval',why:`${iv.n} above ${noteName(rootN)} is <b>${noteName(topN)}</b> (${iv.s} semitones).`};}
    const dir=A_pick(dirs),names=ivls.map(x=>IVL[x].n);const hook=dir==='down'?(iv.dn?'Descending hook: '+iv.dn+'.':''):(iv.up?'Hook: '+iv.up+'.':'');
    return {kind:'choice',options:A_shuf(names),answer:iv.n,play:()=>AUDIO.interval(root,iv.s,dir),playLabel:dir==='harm'?'Two notes together':dir==='down'?'Descending interval':'Ascending interval',why:`${iv.n} — ${iv.s} semitones (${noteName(rootN)} to ${noteName(topN)}). ${hook}`};}},

 {name:'Melody patterns', key:'pd', ask:'Listen — then show the shape or write the notes.',
  guide:`<p class="prompt">Melody patterns</p><ul><li><b>Shape</b> questions: does each note go up, down or stay? Pick the matching contour.</li>
   <li><b>Write the notes</b>: the rhythm is given and the first note is written. The tonic chord and starting note are played, then a count-in. Click each empty note at the pitch you hear (drag to adjust).</li>
   <li>Think in scale steps from the first note: up a step, down a step, a leap to the 5th…</li></ul>`,
  cfg:[ G('qtype','Question type',[Y('contour','Shape (contour)',7),Y('pitch','Write the notes (rhythm given)',7),Y('melody','Melodic dictation (rhythm and pitch)',10)]),
        G('scales','Scales',[Y('major pentatonic','Major pentatonic',7),Y('major','Major',7),Y('minor pentatonic','Minor pentatonic',7),Y('natural minor','Natural minor',8),Y('harmonic minor','Harmonic minor',9),Y('blues','Blues',9),Y('melodic minor','Melodic minor',10)]),
        SG('bars','Length',[{id:'1',label:'1 bar'},{id:'2',label:'2 bars'},{id:'4',label:'4 bars'}],{7:'2',10:'4'}),
        G('metres','Time signatures',[Y('2/4','2/4',7),Y('3/4','3/4',7),Y('4/4','4/4',7),Y('6/8','6/8',8)]),
        SG('clef','Clef',[{id:'treble',label:'Treble'},{id:'bass',label:'Bass (Year 8)'},{id:'both',label:'Both'}],{7:'treble',8:'both'}) ],
  gen(ctx){const qt=A_pick(ctx.cfg('qtype')),scales=ctx.cfg('scales'),bars=parseInt(ctx.cfg('bars'),10)||1,metre=A_pick(ctx.cfg('metres'));
    const clef=ctx.cfg('clef')==='both'?A_pick(['treble','bass']):ctx.cfg('clef');
    if(qt==='contour'){const n=4+((Math.random()*2)|0);const sc=A_pick(scales);const steps={'major pentatonic':PENT,'major':MAJ,'minor pentatonic':MPENT,'natural minor':MINN,'harmonic minor':MINH,'blues':[0,3,5,6,7,10],'melodic minor':[0,2,3,5,7,9,11]}[sc]||MAJ;
      const pool=steps.concat(steps.map(s=>s+12));let i=A_root(1,3);const idx=[i];for(let k=1;k<n;k++){i=Math.max(0,Math.min(pool.length-1,i+A_pick([-2,-1,0,1,2,1,-1])));idx.push(i);}
      const mids=idx.map(x=>60+pool[x]);const arrows=idx.slice(1).map((x,k)=>x>idx[k]?'↑':x<idx[k]?'↓':'→');const ans=arrows.join(' ');
      const allShapes=new Set([ans]);let tries=0;while(allShapes.size<4&&tries++<50){allShapes.add(arrows.map(()=>A_pick(['↑','↓','→'])).join(' '));}
      return {kind:'choice',options:A_shuf([...allShapes]),answer:ans,play:()=>AUDIO.melody(mids,mids.map(()=>0.75),0.6),playLabel:n+' notes — which way does each one move?',why:'The notes move '+arrows.join(', ')+'.'};}
    const dict=ENGRAVE.buildDictation({diff:ctx.diff,scaleNames:scales,bars,clef,metre,maxKs:maxKsFor(ctx.year),rests:ctx.year>=8,restDurs:ctx.year>=9?[0.5,1,2]:[1,2],ties:ctx.year>=8,syncopation:ctx.year>=9,anacrusis:ctx.year>=8&&bars>1,triplets:false,vocab:vocabFrom(RHYTHM_VOCAB.filter(x=>x.yr<=ctx.year).map(x=>x.id)).vocab,vocabEasy:false});
    if(qt==='melody')return {kind:'melodydict',dict,scaleName:dict.scaleName,given:1,multiPlay:true,cue:true,prompt:'Notate the melody — rhythm and pitch',why:'Key: '+dict.scaleName+'. '+dict.notes.filter(n=>!n.rest).map(noteName).join(' ')+'.'};
    return {kind:'pitchdict',dict,scaleName:dict.scaleName,given:1,multiPlay:true,cue:true,prompt:'Write the pitches — the rhythm is given',why:'Key: '+dict.scaleName+'. Answer: '+dict.notes.filter(n=>!n.rest).map(noteName).join(' ')+'.'};}},

 {name:'Scales', key:'scl', ask:'Listen — which scale?', canNotate:true,
  guide:`<p class="prompt">Scales</p><ul><li><b>Major</b> sounds bright and complete. <b>Major pentatonic</b> is five notes with no semitones — the "black notes" sound.</li>
   <li><b>Minor</b> scales have a lowered 3rd (darker). <b>Harmonic minor</b> raises the 7th — a big "exotic" step near the top. The <b>blues</b> scale adds the bent ♭5.</li>
   <li>Choose <b>Melody in context</b> in ⚙ to hear the scale used in a tune — the giveaway notes are always in it.</li></ul>`,
  cfg:[ G('scales','Scales',[Y('Major pentatonic','Major pentatonic',7),Y('Major','Major (Ionian)',7),Y('Minor pentatonic','Minor pentatonic',7),Y('Natural minor','Natural minor (Aeolian)',8),Y('Harmonic minor','Harmonic minor',9),Y('Blues','Blues',9),Y('Melodic minor','Melodic minor',10),Y('Chromatic','Chromatic',10)]),
        SG('play','How to play it',[{id:'scale',label:'Ascending scale'},{id:'context',label:'Melody in context'}],'scale') ],
  gen(ctx){const D={'Major':[[0,0],[2,1],[4,2],[5,3],[7,4],[9,5],[11,6],[12,7]],'Natural minor':[[0,0],[2,1],[3,2],[5,3],[7,4],[8,5],[10,6],[12,7]],'Harmonic minor':[[0,0],[2,1],[3,2],[5,3],[7,4],[8,5],[11,6],[12,7]],'Melodic minor':[[0,0],[2,1],[3,2],[5,3],[7,4],[9,5],[11,6],[12,7]],
      'Major pentatonic':[[0,0],[2,1],[4,2],[7,4],[9,5],[12,7]],'Minor pentatonic':[[0,0],[3,2],[5,3],[7,4],[10,6],[12,7]],'Blues':[[0,0],[3,2],[5,3],[6,4],[7,4],[10,6],[12,7]],'Chromatic':[[0,0],[1,0],[2,1],[3,1],[4,2],[5,3],[6,3],[7,4],[8,4],[9,5],[10,5],[11,6],[12,7]]};
    const LAB={'Major':'Major (Ionian)','Natural minor':'Natural minor (Aeolian)'};const disp=id=>LAB[id]||id;
    const COL={'Major':[4,11],'Natural minor':[3,8,10],'Harmonic minor':[3,8,11],'Melodic minor':[3,9,11],'Major pentatonic':[4,9],'Minor pentatonic':[3,10],'Blues':[3,6,10],'Chromatic':[1,3,6,8,10]};
    const TELL={'Major':'bright, with semitones between 3–4 and 7–8','Natural minor':'darker — lowered 3rd, 6th and 7th','Harmonic minor':'minor with a raised 7th — the big step near the top','Melodic minor':'minor going up with raised 6th and 7th — almost major at the top','Major pentatonic':'five notes, no semitones, bright','Minor pentatonic':'five notes, minor colour — rock riffs','Blues':'minor pentatonic plus the "blue" ♭5','Chromatic':'every semitone — all the keys in a row'};
    const names=ctx.cfg('scales'),ch=A_pick(names),R=A_pick(ch==='Chromatic'?ROOTS.filter(r=>!r[1]):ROOTS.filter(r=>r[1]!=='f'||ctx.year>=8)),root=R[2],deg=D[ch],steps=deg.map(d=>d[0]),inContext=ctx.cfg('play')==='context';
    const spelled=deg.map(d=>spellFrom(R[0],root,d[0],d[1])),rootName=noteName({letter:R[0],acc:R[1]});
    if(ctx.mode==='notate'){const mids=steps.map(s=>root+s);return {kind:'notate',clef:'treble',given:1,enharm:true,notes:spelled.map(n=>[n.letter,n.octave,n.acc]),mids,play:()=>AUDIO.scale(root,steps),playLabel:'Scale going up — write it',prompt:'Write the scale you hear',why:`${disp(ch)} from ${rootName}: ${spelled.map(noteName).join(' ')}.`};}
    const ex=inContext?colourMelody(root,steps,COL[ch],12):null;
    return {kind:'choice',options:A_shuf(names.map(disp)),answer:disp(ch),play:()=>inContext?AUDIO.melody(ex.mids,ex.durs,0.42):AUDIO.scale(root,steps),playLabel:inContext?'A tune built on this scale':'A scale going up',why:`${disp(ch)} (from ${rootName}) — ${TELL[ch]}.`};}},

 {name:'Tonality', key:'ton', ask:'Listen — what is the tonality?',
  guide:`<p class="prompt">Tonality</p><ul><li><b>Major</b> = bright; <b>minor</b> = darker, sadder; <b>pentatonic</b> = open, folky, no semitones (hum it — only five different notes).</li>
   <li>Year 9: does the music <b>modulate</b> (change key) to its relative major or minor? Year 10: <b>consonant</b> (smooth, agreeing) or <b>dissonant</b> (clashing, tense)?</li></ul>`,
  cfg:[ G('qtype','Question type',[Y('tone','Major, minor or pentatonic',7),Y('mod','Modulation to the relative key',9),Y('cd','Consonant or dissonant',10)]),
        SG('play','Play as',[{id:'melody',label:'Melody'},{id:'harm',label:'Melody with chords'}],{7:'melody',8:'harm'}) ],
  gen(ctx){const qt=A_pick(ctx.cfg('qtype')),root=A_root(57,64);
    if(qt==='cd'){const cons=Math.random()<0.5;const iv=cons?A_pick([[0,4],[0,3],[0,7],[0,12],[0,9],[0,8],[0,4,7],[0,3,7]]):A_pick([[0,1],[0,2],[0,6],[0,11],[0,10],[0,1,2],[0,6,11]]);
      return {kind:'choice',options:['Consonant','Dissonant'],answer:cons?'Consonant':'Dissonant',play:()=>AUDIO.chord(0,iv.map(i=>root+i),'block'),playLabel:'Notes sounding together',why:cons?'Consonant — the notes agree (3rds, 6ths, perfect 5ths and octaves, triads).':'Dissonant — the notes clash and feel tense (2nds, 7ths, the tritone).'};}
    if(qt==='mod'){const mod=Math.random()<0.5;const isMin=Math.random()<0.5;const I=isMin?['i',0,'mi']:['I',0,''],IV=isMin?['iv',5,'mi']:['IV',5,''],V=['V',7,''],V7=['V7',7,'7'];
      let seq=[I,IV,V,I]; if(mod)seq=seq.concat(isMin?[['VI',8,''],['V7/III',10,'7'],['III',3,''],['V7/III',10,'7'],['III',3,'']]:[['IV',5,''],['V7/vi',4,'7'],['vi',9,'mi'],['V7/vi',4,'7'],['vi',9,'mi']]); else seq=seq.concat([IV,V7,I,IV,V7,I]);
      const vc=voiceProg(seq,root);const mel=chordMelody(vc,2,root,[]);
      return {kind:'choice',options:['Stays in the home key','Modulates to the relative '+(isMin?'major':'minor')],answer:mod?'Modulates to the relative '+(isMin?'major':'minor'):'Stays in the home key',play:()=>AUDIO.progMelody(vc,mel.mids,mel.durs,0.5,2),playLabel:(isMin?'Minor':'Major')+' home key first — does it change key?',why:mod?(isMin?'It brightens into the relative major (three semitones up) — the raised 7th disappears.':'It darkens into the relative minor (three semitones down) — a new raised note appears as the minor key’s leading note.'):'No modulation — it stays home and cadences on the tonic.'};}
    const id=A_pick(['Major','Minor','Pentatonic']);const T={'Major':{steps:MAJ,col:[4,11],set:PROGSET.Major},'Minor':{steps:MINH,col:[3,11],set:PROGSET.Minor},'Pentatonic':{steps:PENT,col:[4,9],set:PROGSET.Major}};
    const WHY={'Major':'bright — a major 3rd above the tonic and a leading note pulling home.','Minor':'darker — the 3rd is lowered.','Pentatonic':'five notes only, no semitones — open and folky.'};
    let play; if(ctx.cfg('play')==='harm'){const seq=genProgression(T[id].set,5);const prog=voiceProg(seq,root);const mel=id==='Pentatonic'?chordMelody(prog,2,root,PENT):chordMelody(prog,2,root,T[id].steps);play=()=>AUDIO.progMelody(prog,mel.mids,mel.durs,0.42,2);}
    else {const ex=colourMelody(root,T[id].steps.concat([12]),T[id].col,12);play=()=>AUDIO.melody(ex.mids,ex.durs,0.42);}
    return {kind:'choice',options:A_shuf(['Major','Minor','Pentatonic']),answer:id,play,playLabel:'A short tune',why:`${id}: ${WHY[id]}`};}},

 {name:'Chords', key:'chd', ask:'Listen — what do you hear?',
  guide:`<p class="prompt">Chords</p><ul><li>A <b>triad</b> is three notes stacked in 3rds. Year 7: can you tell one note, two notes and a full chord apart?</li>
   <li>Year 8: <b>major</b> (bright) or <b>minor</b> (darker — the middle note is a semitone lower). Year 9 adds the <b>dominant 7th</b> (four notes, wants to resolve).</li>
   <li>Year 10: <b>inversions</b> — the same chord with a different note at the bottom (root, 3rd or 5th in the bass).</li></ul>`,
  cfg:[ G('qtype','Question type',[Y('count','One note, two notes or a triad?',7),Y('qual','Major, minor or 7th?',7),Y('inv','Which inversion?',10)]),
        G('quals','Chord types',[Y('Major','Major',7),Y('Minor','Minor',7),Y('Dominant 7th','Dominant 7th',9),Y('Diminished','Diminished',10)]),
        SG('play','Play as',[{id:'block',label:'Block chord'},{id:'arp',label:'Arpeggiated (one note at a time)'},{id:'mix',label:'Mixed'}],'block') ],
  gen(ctx){const qt=A_pick(ctx.cfg('qtype')),root=A_root(52,60),pm=ctx.cfg('play'),style=pm==='mix'?A_pick(['block','arp']):pm;
    if(qt==='count'){const n=A_pick([1,2,3]);const notes=n===1?[root]:n===2?[root,root+A_pick([4,7,12,5])]:voiced(root,[0,4,7],0);const lab=['One note','Two notes','A triad (three-note chord)'][n-1];
      return {kind:'choice',options:['One note','Two notes','A triad (three-note chord)'],answer:lab,play:()=>AUDIO.chord(0,notes,style),playLabel:'How many different notes are sounding?',why:n===3?'Three notes stacked in 3rds — a major triad.':n===2?'Two notes together — an interval, not a chord.':'A single note.'};}
    const quals=ctx.cfg('quals').filter(q=>CHORDQ[q]),q=A_pick(quals.length?quals:['Major']),Q=CHORDQ[q];
    if(qt==='inv'){const base=['Major','Minor'].includes(q)?q:'Major';const inv=A_pick([0,1,2]);const INV=['Root position','1st inversion','2nd inversion'];
      return {kind:'choice',options:INV,answer:INV[inv],play:()=>AUDIO.chord(0,voiced(root,CHORDQ[base].iv,inv),style),playLabel:base+' triad — which note is at the bottom?',why:`${INV[inv]} — the bass note is the ${inv===0?'root':inv===1?'3rd':'5th'}.`};}
    return {kind:'choice',options:A_shuf(quals),answer:q,play:()=>AUDIO.chord(0,voiced(root,Q.iv,0),style),playLabel:style==='arp'?'A chord, one note at a time':'A chord',why:`${q} — ${Q.cue}.`};}},

 {name:'Chord changes', key:'prog', ask:'Listen — follow the chords.',
  guide:`<p class="prompt">Chord changes &amp; progressions</p><ul><li>Year 7: can you hear when the chord <b>changes</b>? Count the changes, or say whether two chords are the same or different.</li>
   <li>Year 8: write the <b>primary chords</b> I, IV and V. Hum the bass note: 1 is home, 4 is up a 4th, 5 is up a 5th. Year 9 adds vi, V7 and minor keys; Year 10 adds ii.</li>
   <li>In ⚙ you can label chords with Roman numerals or chord names in the key.</li></ul>`,
  cfg:[ G('qtype','Question type',[Y('same','Same chord or different?',7),Y('count','How many chord changes?',7),Y('write','Write the chords',8)]),
        G('chords','Chords available',[Y('I','I',8),Y('IV','IV',8),Y('V','V',8),Y('vi','vi',9),Y('V7','V7',9),Y('minor','Minor keys (i iv V)',9),Y('ii','ii',10)]),
        SG('length','Chords in a row',[{id:'3',label:'3'},{id:'4',label:'4'},{id:'6',label:'6'}],'4'),
        SG('labels','Label chords as',[{id:'rn',label:'Roman numerals'},{id:'names',label:'Chord names'},{id:'both',label:'Both'}],'rn') ],
  gen(ctx){const qt=A_pick(ctx.cfg('qtype')),ch=ctx.cfg('chords');
    if(qt==='same'){const root=A_root(55,62);const same=Math.random()<0.5;const a=voiced(root,[0,4,7],0),b=same?a:voiced(root+A_pick([5,7,-3,2]),[0,A_pick([3,4]),7],0);
      return {kind:'choice',options:['Same chord','Different chord'],answer:same?'Same chord':'Different chord',play:()=>AUDIO.progression([a,b].map(c=>[c[0]-12].concat(c)),1.3,[0.5]),playLabel:'Two chords, one after the other',why:same?'The same chord played twice.':'A different chord — the bass and the notes moved.'};}
    if(qt==='count'){const root=A_root(55,62);const set=PROGSET.Major.filter(e=>e[4]<=8);const n=A_pick([0,1,2,3]);const seq=[set[0]];let last=set[0];
      for(let i=1;i<4;i++){if(seq.filter((e,k)=>k>0&&e!==seq[k-1]).length<n&&(n-(seq.filter((e,k)=>k>0&&e!==seq[k-1]).length))>=(4-i)){let nx;do{nx=A_pick(set);}while(nx===last);seq.push(nx);last=nx;}else if(Math.random()<0.5&&seq.filter((e,k)=>k>0&&e!==seq[k-1]).length<n){let nx;do{nx=A_pick(set);}while(nx===last);seq.push(nx);last=nx;}else seq.push(last);}
      const changes=seq.filter((e,k)=>k>0&&e!==seq[k-1]).length;const vc=voiceProg(seq,root);
      return {kind:'choice',options:['0','1','2','3'],answer:''+changes,play:()=>AUDIO.progression(vc,1.1),playLabel:'Four beats of chords — how many times does the chord change?',why:changes+' change'+(changes===1?'':'s')+': '+seq.map(e=>e[0]).join(' – ')+'.'};}
    const isMin=ch.includes('minor')&&Math.random()<0.4;const base=(isMin?PROGSET.Minor:PROGSET.Major).filter(e=>isMin?(e[4]<=9||ch.includes('V7')&&e[0]==='V7'||ch.includes('ii')):(ch.includes(e[0])||e[0]==='I'));
    const set=base.length>=3?base:PROGSET.Major.slice(0,3);const L=parseInt(ctx.cfg('length'),10)||4;
    const K=A_pick(isMin?KEYS_MIN:KEYS_MAJ),R=K[1]>64?K[1]-12:K[1],keyName=keyDisplay(K)+' '+(isMin?'minor':'major');
    const lab=ctx.cfg('labels'),nameOf=e=>chordName(K[0],K[1],e),show=e=>lab==='names'?nameOf(e):lab==='both'?e[0]+' ('+nameOf(e)+')':e[0];
    const fmtL=l=>{const m=l.match(/^(\\S+)(.*)$/);return m?fmtRN(m[1])+m[2]:l;};
    const seq=genProgression(set,L),labels=seq.map(show);const vc=voiceProg(seq,R);
    return {kind:'numerals',palette:set.map(show),fmt:fmtL,answer:labels,given:1,play:()=>AUDIO.progression(vc,1.45),playLabel:keyName+' · '+L+' chords · the first chord is given',prompt:'Write each chord in '+keyName,why:seq.map(e=>fmtRN(e[0])+' ('+nameOf(e)+')').join(' – ')+'. Listen to the bass: it moves to the root of each chord.'};}},

 {name:'Texture', key:'tex', ask:'Listen — what texture?',
  guide:`<p class="prompt">Texture</p><ul><li><b>Unison / monophonic</b>: everyone plays the same tune (even in octaves) — one line.</li>
   <li><b>Homophonic</b>: a melody with accompaniment (chords or a bass line) underneath.</li>
   <li>Year 8: a <b>counter-melody</b> or descant — a second tune that goes along with the first. Year 9: <b>polyphonic</b> — several independent tunes at once.</li></ul>`,
  cfg:[ G('texs','Textures',[Y('Unison / monophonic','Unison / monophonic',7),Y('Melody and accompaniment (homophonic)','Melody and accompaniment (homophonic)',7),Y('Melody with a counter-melody','Melody with a counter-melody',8),Y('Polyphonic','Polyphonic',9)]) ],
  gen(ctx){const texs=ctx.cfg('texs'),id=A_pick(texs),isMin=Math.random()<0.35,root=A_root(57,64),steps=isMin?MINH:MAJ;let play,sub='';
    if(id==='Unison / monophonic'){const ex=TUNE(root+12,steps,12);const v=A_pick(['solo','oct']);play=v==='solo'?()=>AUDIO.melody(ex.mids,ex.durs,0.4):()=>AUDIO.lines([{mids:ex.mids,durs:ex.durs,offset:0,amp:1},{mids:ex.mids.map(m=>m-12),durs:ex.durs,offset:0,amp:0.8}],0.4);sub=v==='solo'?'one tune on its own.':'one tune doubled in octaves — still a single line.';}
    else if(id==='Melody and accompaniment (homophonic)'){const seq=genProgression(isMin?PROGSET.Minor:PROGSET.Major,6);const prog=voiceProg(seq,root);const mel=chordMelody(prog,2,root,steps);const st=A_pick(['block','broken']);play=()=>AUDIO.progMelody(prog,mel.mids,mel.durs,0.42,2,st);sub='a tune on top with '+(st==='broken'?'broken-chord':'block-chord')+' accompaniment underneath.';}
    else if(id==='Melody with a counter-melody'){const seq=genProgression(isMin?PROGSET.Minor:PROGSET.Major,6);const prog=voiceProg(seq,root);const mel=chordMelody(prog,2,root,steps);const cm=chordMelody(prog,2,root-12,steps);cm.durs=cm.durs.map(d=>d<1?1:d);
      play=()=>AUDIO.lines([{mids:mel.mids,durs:mel.durs,offset:0,amp:1},{mids:cm.mids.map(m=>m),durs:cm.durs,offset:0,amp:0.75}],0.42);sub='the main tune with a second, slower tune (a counter-melody) running underneath it.';}
    else {const subj=TUNE(root+12,steps,8);const cont=outlineMelody(root+12,steps.concat([12]),7,true);const v1={mids:subj.mids.concat(cont.mids),durs:subj.durs.concat(cont.durs),offset:0,amp:1};const ans={mids:subj.mids.map(m=>m-5).concat(cont.mids.map(m=>m-5)),durs:subj.durs.concat(cont.durs),offset:2,amp:0.9};play=()=>AUDIO.lines([v1,ans],0.4);sub='two independent tunes — the second copies the first a little later (imitation).';}
    return {kind:'choice',options:A_shuf(texs),answer:id,play,playLabel:'A short excerpt',why:`${id}: ${sub}`};}},

 {name:'Form', key:'form', ask:'Listen — what is the form?',
  guide:`<p class="prompt">Form</p><ul><li>Give each section a letter as you hear it. Is this <b>new</b> (B, C) or a <b>return</b> (A)? Repetition and contrast make form.</li>
   <li><b>Binary</b> AB · <b>Ternary</b> ABA · <b>Verse–chorus</b> ABAB · <b>Rondo</b> ABACA · <b>Call and response</b>: a short phrase answered by another.</li>
   <li>Year 8: <b>12-bar blues</b> and <b>theme and variations</b>. Year 10: <b>through-composed</b> (nothing returns) and <b>strophic</b> (AAA).</li></ul>`,
  cfg:[ G('forms','Forms',[Y('Binary (AB)','Binary (AB)',7),Y('Ternary (ABA)','Ternary (ABA)',7),Y('Verse–chorus (ABAB)','Verse–chorus (ABAB)',7),Y('Rondo (ABACA)','Rondo (ABACA)',7),Y('Call and response','Call and response',7),Y('12-bar blues','12-bar blues',8),Y('Theme and variations','Theme and variations',8),Y('Through-composed (ABC)','Through-composed (ABC)',10),Y('Strophic (AAA)','Strophic (AAA)',10)]) ],
  gen(ctx){const forms=ctx.cfg('forms'),id=A_pick(forms),root=A_root(57,62);let chords=[],mel={mids:[],durs:[]};
    const push=(s)=>{chords=chords.concat(s.prog);mel.mids=mel.mids.concat(s.m.mids);mel.durs=mel.durs.concat(s.m.durs);};
    if(id==='12-bar blues'){const bars=[0,0,0,0,5,5,0,0,7,5,0,0];const seq=bars.map(o=>['',o,'7']);chords=voiceProg(seq,root);const base=[root+12,root+15,root+17,root+18,root+19];
      bars.forEach(o=>{const sh=o===7?-5:o;const pat=A_pick([[0,1,2,3,4],[0,2,4,2,0],[4,3,2,1,0]]);const d=[1,0.5,0.5,1,1];pat.forEach((p,k)=>{mel.mids.push(base[p]+sh);mel.durs.push(d[k]);});});
      return {kind:'choice',options:A_shuf(forms),answer:id,play:()=>AUDIO.progMelody(chords,mel.mids,mel.durs,0.3,4),playLabel:'Twelve bars with a riff',why:'12-bar blues: I I I I · IV IV I I · V IV I I.'};}
    if(id==='Call and response'){const seq=[['I',0,''],['V',7,''],['V',7,''],['I',0,'']];const prog=voiceProg(seq,root);const call=chordMelody(prog.slice(0,2),2,root,MAJ),resp=chordMelody(prog.slice(2),2,root-12,MAJ);
      const play=()=>AUDIO.lines([{mids:call.mids.concat(call.mids.map(()=>null)).concat(call.mids).concat(call.mids.map(()=>null)),durs:call.durs.concat(call.durs).concat(call.durs).concat(call.durs),offset:0,amp:1},{mids:call.mids.map(()=>null).concat(resp.mids).concat(call.mids.map(()=>null)).concat(resp.mids),durs:call.durs.concat(resp.durs).concat(call.durs).concat(resp.durs),offset:0,amp:0.85}],0.4);
      return {kind:'choice',options:A_shuf(forms),answer:id,play,playLabel:'Phrases taking turns',why:'Call and response — a high "call" phrase is answered by a lower "response", then again.'};}
    const PLAN={'Binary (AB)':'AB','Ternary (ABA)':'ABA','Verse–chorus (ABAB)':'ABAB','Rondo (ABACA)':'ABACA','Through-composed (ABC)':'ABC','Strophic (AAA)':'AAA','Theme and variations':'AVW'};
    const SEC={};const mk=(k)=>{let seq,r=root,steps=MAJ;if(k==='A'){seq=genProgression(PROGSET.Major.filter(e=>e[4]<=8),4);}else if(k==='B'){seq=[['IV',5,''],['V',7,''],['vi',9,'mi'],['V7',7,'7']];}else if(k==='C'){r=root+9;steps=MINH;seq=[['i',0,'mi'],['iv',5,'mi'],['V7',7,'7'],['i',0,'mi']];}
      if(k==='V'||k==='W'){const a=SEC.A;const m={mids:[],durs:[]};a.m.mids.forEach((x,i)=>{if(k==='V'){m.mids.push(x,x+(Math.random()<0.5?2:-1));m.durs.push(a.m.durs[i]/2,a.m.durs[i]/2);}else{m.mids.push(x+12);m.durs.push(a.m.durs[i]);}});return {prog:a.prog,m};}
      const prog=voiceProg(seq,r);const m=chordMelody(prog,2,r,steps);if(k==='B')m.mids=m.mids.map(x=>x+(x<r+17?12:0));return {prog,m};};
    PLAN[id].split('').forEach(k=>{if(!SEC[k])SEC[k]=mk(k);push(SEC[k]);});
    const WHY={'Binary (AB)':'two different sections, no return.','Ternary (ABA)':'A, a contrasting B, then A comes back.','Verse–chorus (ABAB)':'verse and chorus alternate — the chorus is the bigger, higher section.','Rondo (ABACA)':'A keeps returning between new episodes.','Through-composed (ABC)':'new material all the way — nothing returns.','Strophic (AAA)':'the same section repeated for every verse.','Theme and variations':'the theme, then the same chords with the tune decorated, then up an octave.'};
    return {kind:'choice',options:A_shuf(forms),answer:id,play:()=>AUDIO.progMelody(chords,mel.mids,mel.durs,0.33,2),playLabel:PLAN[id].length+' sections of four bars',why:`${id}: ${WHY[id]}`};}},

 {name:'Dynamics & articulation', key:'dyn', ask:'Listen — how is it played?',
  guide:`<p class="prompt">Dynamics &amp; articulation</p><ul><li>Dynamics are how loud: <b>pp</b> pianissimo · <b>p</b> piano · <b>mp</b> mezzo piano · <b>mf</b> mezzo forte · <b>f</b> forte · <b>ff</b> fortissimo. You hear a phrase at <b>mf</b> first as a reference.</li>
   <li><b>Legato</b> = smooth and joined; <b>staccato</b> = short and detached.</li>
   <li>Year 8: <b>crescendo</b> (getting louder), <b>decrescendo / diminuendo</b> (getting softer), and <b>accents</b> (one note hit harder).</li></ul>`,
  cfg:[ G('qtype','Question type',[Y('level','Name the dynamic (after an mf reference)',7),Y('cmp','Louder or softer than the first?',7),Y('art','Legato or staccato?',7),Y('hair','Crescendo, decrescendo or steady?',8),Y('acc','Which beat is accented?',8)]) ],
  gen(ctx){const qt=A_pick(ctx.cfg('qtype')),root=A_root(60,67),ex=TUNE(root,MAJ,8);const LV=[['pp',0.12],['p',0.22],['mp',0.36],['mf',0.52],['f',0.78],['ff',1.1]];
    if(qt==='level'){const L=A_pick(LV);const play=()=>{const a=AUDIO.melody(ex.mids,ex.durs,0.4,false,ex.mids.map(()=>0.52));setTimeout(()=>AUDIO.melody(ex.mids,ex.durs,0.4,false,ex.mids.map(()=>L[1])),a*1000+300);return a*2+0.5;};
      return {kind:'choice',options:LV.map(l=>l[0]),answer:L[0],play,playLabel:'First at mf (reference), then the question phrase',why:`${L[0]} — ${{pp:'pianissimo, very soft',p:'piano, soft',mp:'mezzo piano, moderately soft',mf:'mezzo forte, moderately loud',f:'forte, loud',ff:'fortissimo, very loud'}[L[0]]}.`};}
    if(qt==='cmp'){const a=A_pick(LV),b=A_pick(LV.filter(l=>Math.abs(LV.indexOf(l)-LV.indexOf(a))>=2));const play=()=>{const t=AUDIO.melody(ex.mids,ex.durs,0.4,false,ex.mids.map(()=>a[1]));setTimeout(()=>AUDIO.melody(ex.mids,ex.durs,0.4,false,ex.mids.map(()=>b[1])),t*1000+300);return t*2+0.5;};
      return {kind:'choice',options:['Louder','Softer'],answer:b[1]>a[1]?'Louder':'Softer',play,playLabel:'The same phrase twice',why:`The second time was ${b[0]} after ${a[0]} — ${b[1]>a[1]?'louder':'softer'}.`};}
    if(qt==='art'){const st=Math.random()<0.5;return {kind:'choice',options:['Legato','Staccato'],answer:st?'Staccato':'Legato',play:()=>AUDIO.melody(ex.mids,ex.durs,0.4,false,null,{lens:ex.mids.map(()=>st?0.3:1.0)}),playLabel:'A phrase',why:st?'Staccato — short, detached notes with gaps between them.':'Legato — smooth, joined notes with no gaps.'};}
    if(qt==='hair'){const k=A_pick(['cresc','dim','steady']);const n=ex.mids.length;const amps=ex.mids.map((m,i)=>k==='cresc'?0.15+0.9*i/(n-1):k==='dim'?1.05-0.9*i/(n-1):0.55);
      return {kind:'choice',options:['Crescendo','Decrescendo / diminuendo','Steady'],answer:k==='cresc'?'Crescendo':k==='dim'?'Decrescendo / diminuendo':'Steady',play:()=>AUDIO.melody(ex.mids,ex.durs,0.4,false,amps),playLabel:'A phrase — does the volume change?',why:k==='cresc'?'Crescendo — gradually louder.':k==='dim'?'Decrescendo (diminuendo) — gradually softer.':'Steady — the same level throughout.'};}
    const beat=A_pick([1,2,3,4]);const mids=[root,root+2,root+4,root+5,root,root+2,root+4,root+5];const amps=mids.map((m,i)=>(i%4)+1===beat?1.3:0.4);
    return {kind:'choice',options:['Beat 1','Beat 2','Beat 3','Beat 4'],answer:'Beat '+beat,play:()=>AUDIO.melody(mids,mids.map(()=>1),0.5,false,amps,{countIn:{n:4,beat:1}}),playLabel:'Count-in, then two bars of 4/4 — one beat is accented',why:'The accent (sforzando) falls on beat '+beat+' of each bar.'};}},

 {name:'Tempo', key:'tmp', ask:'Listen — how fast, and does it change?',
  guide:`<p class="prompt">Tempo</p><ul><li>Tempo terms are Italian words for speed: <b>largo</b> (very slow) · <b>adagio</b> (slow) · <b>moderato</b> (medium) · <b>allegro</b> (fast) · <b>presto</b> (very fast).</li>
   <li>Year 8: <b>rallentando / ritardando</b> = getting slower; <b>accelerando</b> = getting faster. Year 9 adds <b>andante</b> (walking pace) and <b>allegretto</b>. Year 10: <b>rubato</b> (flexible, pushed and pulled) and <b>a tempo</b> (back to the original speed).</li></ul>`,
  cfg:[ G('qtype','Question type',[Y('term','Name the tempo',7),Y('change','Does the tempo change?',8),Y('rub','Strict time or rubato?',10)]),
        G('terms','Tempo terms',[Y('Largo','Largo (very slow, ~45)',7),Y('Adagio','Adagio (slow, ~65)',7),Y('Moderato','Moderato (medium, ~105)',7),Y('Allegro','Allegro (fast, ~140)',7),Y('Presto','Presto (very fast, ~180)',7),Y('Andante','Andante (walking, ~85)',9),Y('Allegretto','Allegretto (fairly fast, ~120)',9)]) ],
  gen(ctx){const qt=A_pick(ctx.cfg('qtype')),root=A_root(57,64);const BPM={Largo:45,Adagio:65,Andante:85,Moderato:105,Allegretto:120,Allegro:140,Presto:180};
    const seq=genProgression(PROGSET.Major.filter(e=>e[4]<=9),4);const prog=voiceProg(seq,root);const mel=chordMelody(prog,2,root,MAJ);
    if(qt==='term'){const terms=ctx.cfg('terms'),t=A_pick(terms);return {kind:'choice',options:A_shuf(terms),answer:t,play:()=>AUDIO.progMelody(prog.concat(prog),mel.mids.concat(mel.mids),mel.durs.concat(mel.durs),60/BPM[t],2),playLabel:'A phrase — tap along and judge the speed',why:`${t} — about ${BPM[t]} beats per minute.`};}
    if(qt==='rub'){const rub=Math.random()<0.5;const play=()=>{const spb=0.5;const durs=mel.durs.map((d,i)=>rub?d*(0.7+0.6*Math.abs(Math.sin(i*0.9))):d);return AUDIO.progMelody(prog,mel.mids,durs,spb,2);};
      return {kind:'choice',options:['Strict time','Rubato'],answer:rub?'Rubato':'Strict time',play,playLabel:'A phrase — is the beat steady or stretched?',why:rub?'Rubato — the melody pushes and pulls against the beat for expression.':'Strict time — every beat the same length.'};}
    const k=A_pick(['accel','rall','steady']);const play=()=>{const n=mel.mids.length;let t=0;const a=AUDIO.lines([{mids:mel.mids,durs:mel.durs.map((d,i)=>k==='steady'?d:k==='accel'?d*(1.25-0.5*i/(n-1)):d*(0.8+0.6*i/(n-1))),offset:0,amp:1}],0.5);return a;};
    return {kind:'choice',options:['Accelerando','Rallentando / ritardando','Steady'],answer:k==='accel'?'Accelerando':k==='rall'?'Rallentando / ritardando':'Steady',play,playLabel:'A phrase — does the speed change?',why:k==='accel'?'Accelerando — gradually faster.':k==='rall'?'Rallentando (ritardando) — gradually slower.':'Steady — the tempo stays the same.'};}},

 {name:'Timbre', key:'tim', ask:'Listen — what is making the sound?',
  guide:`<p class="prompt">Timbre</p><ul><li>Timbre is the <b>tone colour</b> — what makes a trumpet sound different from a flute on the same note.</li>
   <li>Decide how the sound is made — <b>blown</b> (woodwind, brass), <b>bowed</b> (strings), <b>plucked</b> (guitar), <b>struck</b> (piano, xylophone) — then the family, then the instrument.</li>
   <li>Year 8: <b>acoustic</b> (a real instrument) or <b>electronic</b> (a synthesiser)?</li></ul>`,
  cfg:[ G('qtype','Question type',[Y('Family','Instrument family',7),Y('Instrument','Name the instrument',7),Y('AE','Acoustic or electronic?',8),Y('Two','Two instruments together',9)]),
        G('instruments','Instruments',Object.keys(INSTR).map(k=>Y(k,INSTR[k].name,7))) ],
  gen(ctx){const qts=ctx.cfg('qtype');let keys=ctx.cfg('instruments');if(keys.length<2)keys=Object.keys(INSTR);const type=A_pick(qts);
    const phrase=(k)=>{const I=INSTR[k];const r=A_root(I.lo,Math.max(I.lo,I.hi-12));const steps=A_pick([[0,2,4,5,7,5,4,2,0,4,7,12,7,4],[0,4,7,12,9,7,5,4,2,4,0],[7,5,4,2,0,2,4,7,9,7,12]]);return {mids:steps.map(s=>r+s),durs:steps.map(()=>A_pick([1,0.5,1,1.5]))};};
    const TELL={flute:'airy and pure',clarinet:'hollow and woody low down, smooth higher up',saxophone:'reedy with an edge',trumpet:'bright and brassy',trombone:'broad and brassy, lower than a trumpet',violin:'bowed and singing — the highest string',cello:'bowed, rich and warm',guitar:'plucked, quick decay',piano:'struck strings, clear attack',xylophone:'struck wooden bars — short and bright'};
    if(type==='AE'){const k=A_pick(keys),ph=phrase(k),elec=Math.random()<0.5;
      return {kind:'choice',options:['Acoustic','Electronic'],answer:elec?'Electronic':'Acoustic',needsSamples:!elec,play:()=>elec?AUDIO.synthMelody(ph.mids.map(m=>Math.max(48,Math.min(84,m))),ph.durs,0.42,A_pick(['sawtooth','square'])):AUDIO.sampleMelody(k,ph.mids,ph.durs,0.42),playLabel:'A phrase — real instrument or synthesiser?',why:elec?'Electronic — a synthesiser: a buzzy, filtered electronic tone with no breath or bow.':'Acoustic — a real '+INSTR[k].name.toLowerCase()+': '+TELL[k]+'.'};}
    if(type==='Two'&&keys.length>=2){const two=A_shuf(keys).slice(0,2),label=two.map(k=>INSTR[k].name).sort().join(' & ');const opts=[label];let tries=0;while(opts.length<4&&tries<40){const pr=A_shuf(keys).slice(0,2).map(k=>INSTR[k].name).sort().join(' & ');if(!opts.includes(pr))opts.push(pr);tries++;}
      const p1=phrase(two[0]),p2=phrase(two[1]);return {kind:'choice',options:A_shuf(opts),answer:label,needsSamples:true,play:async()=>{AUDIO.sampleMelody(two[0],p1.mids,p1.durs,0.4);return AUDIO.sampleMelody(two[1],p2.mids,p2.durs,0.4);},playLabel:'Two instruments — a phrase each',why:two.map(k=>INSTR[k].name+' ('+TELL[k]+')').join(' and ')+'.'};}
    const k=A_pick(keys),ph=phrase(k);
    if(type==='Instrument'){return {kind:'choice',options:A_shuf(keys.map(x=>INSTR[x].name)),answer:INSTR[k].name,needsSamples:true,play:()=>AUDIO.sampleMelody(k,ph.mids,ph.durs,0.42),playLabel:'A phrase — which instrument?',why:`${INSTR[k].name} (${INSTR[k].fam}) — ${TELL[k]}.`};}
    const fams=[...new Set(keys.map(x=>INSTR[x].fam))];return {kind:'choice',options:A_shuf(fams),answer:INSTR[k].fam,needsSamples:true,play:()=>AUDIO.sampleMelody(k,ph.mids,ph.durs,0.42),playLabel:'A phrase — which family?',why:`${INSTR[k].fam} — this was the ${INSTR[k].name.toLowerCase()}: ${TELL[k]}.`};}},

 {name:'Devices', key:'dev', ask:'Listen — which device is being used?',
  guide:`<p class="prompt">Compositional devices</p><ul><li><b>Drone / pedal</b>: one note held (or repeated) underneath while the tune moves. <b>Ostinato / riff</b>: a short pattern repeated over and over.</li>
   <li>Year 8: <b>sequence</b> — the same little idea repeated starting on a different note (usually a step higher or lower).</li>
   <li>Year 10: a motif played in <b>augmentation</b> (notes twice as long), <b>diminution</b> (half as long) or <b>inversion</b> (upside down).</li></ul>`,
  cfg:[ G('devs','Devices',[Y('Drone / pedal','Drone / pedal',7),Y('Ostinato / riff','Ostinato / riff',7),Y('Sequence','Sequence',8),Y('Augmentation','Augmentation',10),Y('Diminution','Diminution',10),Y('Inversion','Inversion',10)]) ],
  gen(ctx){const devs=ctx.cfg('devs'),id=A_pick(devs),root=A_root(55,62);let play,why;
    if(id==='Drone / pedal'){const ex=TUNE(root+12,MAJ,12);play=()=>AUDIO.lines([{mids:ex.mids,durs:ex.durs,offset:0,amp:1},{mids:[root-12,root-5,root-12,root-5],durs:[4,4,4,4],offset:0,amp:0.9}],0.42);why='a drone (pedal note) — the bass holds the same note while the tune moves above it.';}
    else if(id==='Ostinato / riff'){const riff=[root,root+3,root+5,root+7,root+5,root+3],rd=[0.5,0.5,0.5,1,0.5,1];const ex=TUNE(root+12,MINN,12);play=()=>AUDIO.lines([{mids:ex.mids,durs:ex.durs,offset:0,amp:0.95},{mids:riff.concat(riff,riff,riff),durs:rd.concat(rd,rd,rd),offset:0,amp:1}],0.42);why='an ostinato (riff) — the same short bass pattern repeats over and over.';}
    else if(id==='Sequence'){const motif=A_pick([[0,2,4,2],[4,2,0,2],[0,4,2,0],[0,2,0,-1]]);const sc=MAJ.concat(MAJ.map(x=>x+12),MAJ.map(x=>x+24));const at=(deg)=>sc[Math.max(0,Math.min(sc.length-1,deg+7))];const mids=[];[0,1,2,3].forEach(k=>motif.forEach(m=>mids.push(root+at(m+k))));play=()=>AUDIO.melody(mids,mids.map(()=>0.5),0.42);why='a sequence — the same four-note idea repeated, each time starting one step higher.';}
    else {const motif=[0,2,4,7,4,2,0],md=[0.5,0.5,0.5,1,0.5,0.5,1];const base=motif.map(m=>root+12+MAJ[m%7]+(m>=7?12:0));let second,sd,desc;
      if(id==='Augmentation'){second=base;sd=md.map(d=>d*2);desc='the motif, then the same motif with every note twice as long (augmentation).';}
      else if(id==='Diminution'){second=base;sd=md.map(d=>d/2);desc='the motif, then the same motif at double speed — every note half as long (diminution).';}
      else {second=motif.map(m=>root+12-(MAJ[m%7]+(m>=7?12:0)));sd=md;desc='the motif, then the motif turned upside down — every rise becomes a fall (inversion).';}
      const mids=base.concat([null],second),durs=md.concat([1],sd);play=()=>AUDIO.melody(mids,durs,0.42);why=desc;}
    return {kind:'choice',options:A_shuf(devs),answer:id,play,playLabel:'A short excerpt',why:`${id}: ${why}`};}}
];
