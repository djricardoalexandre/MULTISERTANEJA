import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ChevronRight,
  Disc3,
  Facebook,
  Headphones,
  Instagram,
  LoaderCircle,
  MapPin,
  Menu,
  Pause,
  Play,
  Radio,
  Send,
  ShieldCheck,
  Sparkles,
  Volume2,
  X,
  Youtube,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const streamUrl = 'https://listen.nobexradio.com/station_multisertaneja';
const heroImage = 'https://images.pexels.com/photos/38011571/pexels-photo-38011571.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

const rankingSlots = Array.from({ length: 10 }, (_, index) => index + 1);

function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioError, setAudioError] = useState('');
  const [volume, setVolume] = useState(0.8);
  const [formState, setFormState] = useState({ nickname: '', city: '', region: '', country: 'Brasil', message: '', allowPublication: false, website: '' });
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    const handlePlaying = () => { setIsPlaying(true); setIsLoading(false); setAudioError(''); };
    const handlePause = () => { setIsPlaying(false); setIsLoading(false); };
    const handleWaiting = () => setIsLoading(true);
    const handleError = () => { setIsPlaying(false); setIsLoading(false); setAudioError('Não conseguimos conectar agora. Tente novamente em instantes.'); };
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('error', handleError);
    return () => {
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('error', handleError);
    };
  }, [volume]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    setAudioError('');
    if (isPlaying) {
      audio.pause();
      return;
    }
    setIsLoading(true);
    audio.src = streamUrl;
    try {
      await audio.play();
    } catch {
      setIsLoading(false);
      setAudioError('O navegador bloqueou a reprodução. Clique novamente para ouvir a rádio.');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus({ type: '', text: '' });
    if (formState.website) return;
    setIsSubmitting(true);
    const { error } = await supabase.from('listener_messages').insert({
      nickname: formState.nickname.trim() || null,
      city: formState.city.trim(),
      region: formState.region.trim(),
      country: formState.country.trim(),
      message: formState.message.trim() || null,
      allow_publication: formState.allowPublication,
    });
    setIsSubmitting(false);
    if (error) {
      setFormStatus({ type: 'error', text: 'Não foi possível registrar sua participação. Confira os campos e tente novamente.' });
      return;
    }
    setFormStatus({ type: 'success', text: 'Obrigado por fazer parte da família Multisertaneja! Um grande abraço para você e para todos os ouvintes da sua região!' });
    setFormState({ nickname: '', city: '', region: '', country: 'Brasil', message: '', allowPublication: false, website: '' });
  };

  const scrollToPlayer = () => document.querySelector('#player')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen overflow-x-hidden bg-ink text-white">
      <audio ref={audioRef} preload="none" aria-label="Player da Multisertaneja" />
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="#inicio" className="flex items-center gap-3" aria-label="Multisertaneja - início">
            <img src="/Logo_multisertaneja.png" alt="Multisertaneja" className="h-12 w-auto object-contain" />
          </a>
          <nav className="hidden items-center gap-7 xl:flex" aria-label="Navegação principal">
            {['Início', 'Ouça ao vivo', 'Top 10', 'Ouvintes', 'Sobre nós', 'Contato'].map((item, index) => (
              <a key={item} href={['#inicio', '#player', '#top-10', '#ouvintes', '#sobre', '#contato'][index]} className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65 transition-colors hover:text-gold-300">{item}</a>
            ))}
          </nav>
          <button onClick={scrollToPlayer} className="hidden items-center gap-2 rounded-full bg-gold-400 px-5 py-3 text-[11px] font-black tracking-[0.18em] text-ink shadow-gold transition hover:bg-gold-300 md:flex">
            <Radio size={15} /> OUÇA AO VIVO
          </button>
          <button className="rounded-full border border-white/15 p-2 text-gold-300 xl:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Abrir menu">
            {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
        {isMenuOpen && <nav className="border-t border-white/10 bg-ink px-5 py-5 xl:hidden">{['Início', 'Ouça ao vivo', 'Top 10', 'Ouvintes', 'Sobre nós', 'Contato'].map((item, index) => <a onClick={() => setIsMenuOpen(false)} key={item} href={['#inicio', '#player', '#top-10', '#ouvintes', '#sobre', '#contato'][index]} className="block border-b border-white/10 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white/75">{item}</a>)}</nav>}
      </header>

      <main>
        <section id="inicio" className="relative flex min-h-[720px] items-center overflow-hidden border-b border-white/10 pt-[76px]">
          <div className="absolute inset-0 bg-cover bg-center opacity-35" style={{ backgroundImage: `url(${heroImage})` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/30" />
          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-5 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
            <div className="max-w-2xl">
              <div className="mb-6 flex items-center gap-3 text-gold-300"><span className="h-px w-10 bg-gold-400" /><span className="text-[11px] font-bold uppercase tracking-[0.32em]">A rádio que toca o seu coração</span></div>
              <img src="/Logo_multisertaneja.png" alt="Multisertaneja - Todos os estilos, um só coração" className="mb-8 w-full max-w-[570px] object-contain object-left" />
              <p className="max-w-xl text-lg leading-relaxed text-white/70 md:text-xl">Do modão aos lançamentos, os grandes clássicos e os sucessos que conquistam o Brasil. A sua paixão sertaneja toca aqui!</p>
              <div className="mt-9 flex flex-wrap gap-4"><button onClick={scrollToPlayer} className="group flex items-center gap-3 rounded-full bg-gold-400 px-7 py-4 text-xs font-black tracking-[0.16em] text-ink shadow-gold transition hover:-translate-y-0.5 hover:bg-gold-300">OUVIR AGORA <ChevronRight size={17} className="transition-transform group-hover:translate-x-1" /></button><a href="#sobre" className="flex items-center gap-2 rounded-full border border-white/20 px-7 py-4 text-xs font-bold tracking-[0.16em] text-white/80 transition hover:border-gold-400 hover:text-gold-300">CONHEÇA A RÁDIO</a></div>
              <div className="mt-12 flex items-center gap-6 text-xs text-white/45"><span className="flex items-center gap-2"><ShieldCheck size={16} className="text-gold-400" /> Transmissão oficial Waveo</span><span className="hidden h-4 w-px bg-white/20 sm:block" /><span>24 horas de música</span></div>
            </div>
            <div id="player" className="scroll-mt-28 lg:justify-self-end"><RadioPlayer isPlaying={isPlaying} isLoading={isLoading} audioError={audioError} volume={volume} setVolume={setVolume} onToggle={togglePlayback} /></div>
          </div>
          <a href="#sobre" className="absolute bottom-7 left-1/2 -translate-x-1/2 text-white/35 transition hover:text-gold-300" aria-label="Rolar para baixo"><ArrowDown size={20} className="animate-bounce" /></a>
        </section>

        <section id="sobre" className="mx-auto grid max-w-7xl gap-14 px-5 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-8 lg:py-32">
          <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-gold-400/20 bg-[#151411] p-8 shadow-2xl"><div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gold-400/10 blur-3xl" /><Disc3 size={44} className="mb-16 text-gold-400" /><p className="relative max-w-xs font-display text-6xl font-bold leading-[0.95] text-white/10 sm:text-7xl">Rio Espera<br />MG</p><div className="absolute bottom-8 left-8 right-8 flex items-end justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-300">Nossa casa</p><p className="mt-2 text-2xl font-bold">Com você, onde estiver.</p></div><Sparkles className="text-gold-400" size={26} /></div></div>
          <div><SectionKicker text="Nossa essência" /><h2 className="mt-5 max-w-2xl font-display text-4xl font-bold leading-tight sm:text-5xl">Uma rádio, todas as paixões sertanejas.</h2><p className="mt-7 max-w-2xl text-base leading-8 text-white/60">A Multisertaneja reúne os grandes clássicos, os modões inesquecíveis, o sertanejo romântico, o universitário e os lançamentos que conquistam o país. Uma programação feita para quem tem música sertaneja no coração, onde quer que esteja.</p><div className="mt-9 grid max-w-lg grid-cols-2 gap-6 border-t border-white/10 pt-7"><div><p className="font-display text-3xl font-bold text-gold-300">100%</p><p className="mt-1 text-xs uppercase tracking-widest text-white/40">Paixão sertaneja</p></div><div><p className="font-display text-3xl font-bold text-gold-300">24/7</p><p className="mt-1 text-xs uppercase tracking-widest text-white/40">No ar para você</p></div></div></div>
        </section>

        <section id="top-10" className="border-y border-white/10 bg-[#0d0d0c] px-5 py-24 lg:px-8 lg:py-32"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><SectionKicker text="A seleção dos ouvintes" /><h2 className="mt-5 font-display text-4xl font-bold sm:text-5xl">Top 10 Multisertaneja</h2><p className="mt-4 text-white/50">Os sucessos que estão conquistando os nossos ouvintes!</p></div><div className="flex items-center gap-2 text-xs text-white/35"><span className="h-2 w-2 rounded-full bg-gold-400" /> Ranking aguardando atualização</div></div><div className="mt-12 grid gap-3 md:grid-cols-2">{rankingSlots.map((position) => <div key={position} className="group flex min-h-[92px] items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.025] px-5 transition hover:border-gold-400/40 hover:bg-gold-400/[0.04]"><span className={`w-9 font-display text-2xl font-bold ${position < 4 ? 'text-gold-300' : 'text-white/25'}`}>{String(position).padStart(2, '0')}</span><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-dashed border-white/15 text-white/25"><Disc3 size={20} /></div><div className="min-w-0"><p className="truncate text-sm font-bold text-white/75">Artista ou dupla</p><p className="mt-1 truncate text-xs text-white/35">Música será cadastrada em breve</p></div><ChevronRight className="ml-auto text-white/15 transition group-hover:translate-x-1 group-hover:text-gold-300" size={18} /></div>)}</div><p className="mt-7 text-center text-xs text-white/30">As posições serão atualizadas pela equipe Multisertaneja.</p></div></section>

        <section id="ouvintes" className="mx-auto grid max-w-7xl gap-14 px-5 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-32"><div><SectionKicker text="Nossa comunidade" /><h2 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl">De onde você está ouvindo a Multisertaneja?</h2><p className="mt-6 max-w-lg leading-8 text-white/60">Estamos chegando a todos os cantos do Brasil e do mundo! Conte para nós de onde você está ouvindo a Multisertaneja. Queremos conhecer a nossa audiência e mandar um abraço para a sua região!</p><div className="mt-9 flex items-center gap-4 text-sm text-white/50"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-400/10 text-gold-300"><MapPin size={19} /></div><span>Sem endereço residencial.<br /><b className="font-medium text-white/75">Só queremos conhecer sua região.</b></span></div></div><div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8"><form onSubmit={handleSubmit} className="space-y-5"><div className="grid gap-5 sm:grid-cols-2"><Field label="Nome ou apelido" value={formState.nickname} placeholder="Opcional" onChange={(value) => setFormState({ ...formState, nickname: value })} /><Field label="Cidade" value={formState.city} placeholder="Obrigatório" required onChange={(value) => setFormState({ ...formState, city: value })} /></div><div className="grid gap-5 sm:grid-cols-2"><Field label="Estado ou região" value={formState.region} placeholder="Ex.: Minas Gerais" required onChange={(value) => setFormState({ ...formState, region: value })} /><Field label="País" value={formState.country} placeholder="Obrigatório" required onChange={(value) => setFormState({ ...formState, country: value })} /></div><div><label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">Mensagem para a rádio</label><textarea value={formState.message} onChange={(event) => setFormState({ ...formState, message: event.target.value })} maxLength={500} rows={4} placeholder="Mande um abraço para a nossa equipe..." className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-gold-400/70" /></div><input tabIndex={-1} aria-hidden="true" autoComplete="off" className="hidden" value={formState.website} onChange={(event) => setFormState({ ...formState, website: event.target.value })} /><label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-white/45"><input type="checkbox" checked={formState.allowPublication} onChange={(event) => setFormState({ ...formState, allowPublication: event.target.checked })} className="mt-1 accent-[#e9b83f]" />Autorizo que meu nome, cidade e mensagem possam aparecer no mural, caso sejam aprovados pela equipe.</label><button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-3 rounded-xl bg-gold-400 px-5 py-4 text-xs font-black tracking-[0.15em] text-ink transition hover:bg-gold-300 disabled:cursor-wait disabled:opacity-60">{isSubmitting ? <LoaderCircle size={17} className="animate-spin" /> : <Send size={16} />} {isSubmitting ? 'ENVIANDO...' : 'ESTOU OUVINDO DAQUI!'}</button>{formStatus.text && <p role="status" className={`rounded-xl px-4 py-3 text-sm leading-6 ${formStatus.type === 'success' ? 'bg-emerald-400/10 text-emerald-300' : 'bg-red-400/10 text-red-300'}`}>{formStatus.text}</p>}<p className="flex items-center gap-2 text-[11px] text-white/30"><ShieldCheck size={14} /> Seus dados ficam protegidos e passam por moderação antes de qualquer publicação.</p></form></div></section>
      </main>

      <footer id="contato" className="border-t border-white/10 bg-[#0b0b0a] px-5 py-12 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between"><div><img src="/Logo_multisertaneja.png" alt="Multisertaneja" className="h-14 w-auto" /><p className="mt-3 text-xs text-white/35">Todos os estilos, um só coração!</p></div><div className="flex items-center gap-3"><a href="#" aria-label="Instagram" className="rounded-full border border-white/10 p-3 text-white/45 transition hover:border-gold-400 hover:text-gold-300"><Instagram size={17} /></a><a href="#" aria-label="Facebook" className="rounded-full border border-white/10 p-3 text-white/45 transition hover:border-gold-400 hover:text-gold-300"><Facebook size={17} /></a><a href="#" aria-label="YouTube" className="rounded-full border border-white/10 p-3 text-white/45 transition hover:border-gold-400 hover:text-gold-300"><Youtube size={17} /></a></div><p className="text-xs text-white/25">© 2025 Multisertaneja. A sua rádio sertaneja.</p></div></footer>
    </div>
  );
}

function RadioPlayer({ isPlaying, isLoading, audioError, volume, setVolume, onToggle }: { isPlaying: boolean; isLoading: boolean; audioError: string; volume: number; setVolume: (value: number) => void; onToggle: () => void }) {
  return <div className="w-full max-w-[440px] rounded-[2rem] border border-gold-400/25 bg-[#11110f]/95 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8"><div className="flex items-start justify-between"><div><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-gold-300"><span className={`h-2 w-2 rounded-full ${isPlaying ? 'animate-pulse bg-red-400' : 'bg-white/25'}`} /> {isPlaying ? 'No ar' : 'Pronto para ouvir'}</div><h3 className="mt-3 font-display text-3xl font-bold">Multisertaneja</h3><p className="mt-1 text-sm text-white/40">Todos os estilos, um só coração</p></div><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-400/10 text-gold-300"><Headphones size={22} /></div></div><div className="my-8 flex items-center gap-4"><button onClick={onToggle} className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gold-400 text-ink shadow-gold transition hover:scale-105 hover:bg-gold-300" aria-label={isPlaying ? 'Pausar transmissão' : 'Iniciar transmissão'}>{isLoading ? <LoaderCircle size={25} className="animate-spin" /> : isPlaying ? <Pause size={25} fill="currentColor" /> : <Play size={25} fill="currentColor" className="ml-1" />}</button><div className="flex-1"><div className="flex h-10 items-end gap-1">{Array.from({ length: 28 }, (_, index) => <span key={index} className={`w-1 rounded-full bg-gold-400/70 ${isPlaying ? 'wave-bar' : ''}`} style={{ height: `${12 + ((index * 17) % 24)}px`, animationDelay: `${index * 0.04}s` }} />)}</div><div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/30">Transmissão ao vivo</div></div></div><div className="flex items-center gap-3 border-t border-white/10 pt-5"><Volume2 size={17} className="text-white/45" /><input type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => setVolume(Number(event.target.value))} className="volume-slider" aria-label="Volume" /><span className="w-8 text-right text-xs text-white/35">{Math.round(volume * 100)}%</span></div>{audioError && <p role="alert" className="mt-4 rounded-xl bg-red-400/10 px-4 py-3 text-xs leading-5 text-red-300">{audioError}</p>}</div>;
}

function SectionKicker({ text }: { text: string }) { return <div className="flex items-center gap-3 text-gold-300"><span className="h-px w-8 bg-gold-400" /><span className="text-[11px] font-bold uppercase tracking-[0.28em]">{text}</span></div>; }
function Field({ label, value, placeholder, required, onChange }: { label: string; value: string; placeholder: string; required?: boolean; onChange: (value: string) => void }) { return <div><label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">{label}{required && <span className="text-gold-300"> *</span>}</label><input required={required} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-gold-400/70" /></div>; }

export default App;
