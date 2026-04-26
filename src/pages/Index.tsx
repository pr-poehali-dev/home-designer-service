import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const DESIGNERS = [
  {
    id: 1,
    name: "Арина Волкова",
    specialty: "Брендинг & Айдентика",
    experience: 7,
    rating: 4.9,
    reviews: 143,
    tags: ["Логотип", "Упаковка", "Гайдлайн"],
    image: "https://cdn.poehali.dev/projects/c2a1fd4c-9a55-4aee-83c6-c7f71ec236fe/files/b14cb03d-9f77-470d-91b9-7c31c94ed22c.jpg",
  },
  {
    id: 2,
    name: "Максим Орлов",
    specialty: "UX/UI Дизайн",
    experience: 5,
    rating: 4.8,
    reviews: 98,
    tags: ["Figma", "Прототип", "Веб"],
    image: "https://cdn.poehali.dev/projects/c2a1fd4c-9a55-4aee-83c6-c7f71ec236fe/files/3afc4a9b-06f5-4c83-8238-9e51d823182e.jpg",
  },
  {
    id: 3,
    name: "Дарья Климова",
    specialty: "Иллюстрация & Арт",
    experience: 9,
    rating: 5.0,
    reviews: 211,
    tags: ["Иллюстрация", "Анимация", "Концепт"],
    image: "https://cdn.poehali.dev/projects/c2a1fd4c-9a55-4aee-83c6-c7f71ec236fe/files/6750c721-ccde-4470-8a82-ad65abc69936.jpg",
  },
  {
    id: 4,
    name: "Иван Соколов",
    specialty: "Моушн & 3D",
    experience: 4,
    rating: 4.7,
    reviews: 67,
    tags: ["After Effects", "Blender", "3D"],
    image: "https://cdn.poehali.dev/projects/c2a1fd4c-9a55-4aee-83c6-c7f71ec236fe/files/f7dbc85f-c4b3-47cf-a439-1d0b82ac3987.jpg",
  },
];

const SERVICES = [
  { icon: "Palette", title: "Брендинг", desc: "Логотип, фирменный стиль, гайдлайн. Создаём узнаваемый образ вашего бизнеса." },
  { icon: "Layout", title: "UI/UX Дизайн", desc: "Интерфейсы, которые понятны пользователям и увеличивают конверсию." },
  { icon: "PenTool", title: "Иллюстрация", desc: "Уникальные иллюстрации и арт-дирекция для любых задач." },
  { icon: "Film", title: "Моушн & 3D", desc: "Анимации, видеографика и трёхмерные визуализации." },
  { icon: "Package", title: "Упаковка", desc: "Дизайн упаковки, который выделяет товар на полке." },
  { icon: "Globe", title: "Веб-дизайн", desc: "Современные сайты с продуманной структурой и эстетикой." },
];

const REVIEWS = [
  { name: "Ольга М.", company: "Стартап BeautyBox", text: "Арина создала для нас айдентику с нуля — теперь нас узнают везде. Невероятное чувство стиля!", rating: 5 },
  { name: "Денис К.", company: "Ресторан «Форест»", text: "Максим разработал меню и сайт. Гости постоянно спрашивают, кто сделал такой дизайн.", rating: 5 },
  { name: "Светлана Р.", company: "Издательство «Слово»", text: "Дарья нарисовала серию иллюстраций для детской книги — это настоящее волшебство.", rating: 5 },
];

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= Math.round(value) ? "hsl(36,80%,58%)" : "rgba(255,255,255,0.15)", fontSize: "11px" }}>★</span>
      ))}
    </div>
  );
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");

  const handleSubmit = async () => {
    setFormStatus("loading");
    setFormError("");
    try {
      const res = await fetch("https://functions.poehali.dev/06ee754c-0abe-4c24-b2b8-783d16adb9dc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFormStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setFormStatus("error");
        setFormError(data.error || "Что-то пошло не так. Попробуйте ещё раз.");
      }
    } catch {
      setFormStatus("error");
      setFormError("Ошибка соединения. Проверьте интернет и попробуйте снова.");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "services", "designers", "reviews", "contact"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom > 100) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navItems = [
    { id: "home", label: "Главная" },
    { id: "services", label: "Услуги" },
    { id: "designers", label: "Дизайнеры" },
    { id: "reviews", label: "Отзывы" },
    { id: "contact", label: "Контакты" },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "hsl(20, 14%, 4%)", color: "hsl(36, 20%, 92%)" }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5"
        style={{ background: "linear-gradient(to bottom, hsl(20, 14%, 4%, 0.95), transparent)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full" style={{ background: "linear-gradient(135deg, hsl(36,80%,58%), hsl(348,60%,55%))" }} />
          <span style={{ fontFamily: "'Golos Text', sans-serif", fontWeight: 700, letterSpacing: "0.2em", fontSize: "0.85rem", textTransform: "uppercase" }}>FORMA</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => scrollTo(item.id)}
              className="nav-link text-sm transition-colors"
              style={{ color: activeSection === item.id ? "hsl(36,80%,58%)" : "rgba(255,255,255,0.55)" }}>
              {item.label}
            </button>
          ))}
        </div>

        <button onClick={() => scrollTo("contact")}
          className="hidden md:block px-5 py-2 text-sm font-semibold rounded-full transition-all hover:scale-105"
          style={{ background: "hsl(36,80%,58%)", color: "hsl(20,14%,4%)" }}>
          Найти дизайнера
        </button>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden" style={{ color: "white" }}>
          <Icon name={menuOpen ? "X" : "Menu"} size={22} />
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8"
          style={{ background: "rgba(14, 10, 8, 0.98)" }}>
          {navItems.map((item) => (
            <button key={item.id} onClick={() => scrollTo(item.id)}
              className="text-3xl font-light hover:text-amber-400 transition-colors"
              style={{ fontFamily: "'Cormorant', serif", color: "rgba(255,255,255,0.8)" }}>
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="blob absolute w-96 h-96 opacity-25 top-1/4 -left-20"
            style={{ background: "radial-gradient(circle, hsl(36,80%,58%), transparent 70%)" }} />
          <div className="blob-slow absolute w-80 h-80 opacity-15 bottom-1/4 -right-10"
            style={{ background: "radial-gradient(circle, hsl(348,60%,55%), transparent 70%)" }} />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="fade-up-1 inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full"
            style={{ border: "1px solid hsl(36, 80%, 58%, 0.3)", background: "hsl(36, 80%, 58%, 0.06)" }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "hsl(36,80%,58%)" }} />
            <span style={{ fontSize: "0.7rem", color: "hsl(36,80%,68%)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500 }}>Платформа творческих дизайнеров</span>
          </div>

          <h1 className="fade-up-2 text-gold leading-none mb-6"
            style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)", fontFamily: "'Cormorant', serif", fontWeight: 300, letterSpacing: "-0.02em" }}>
            Дизайн,<br />
            <em>который</em> говорит
          </h1>

          <p className="fade-up-3 max-w-lg mx-auto mb-10 leading-relaxed"
            style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.45)" }}>
            Найди своего идеального дизайнера среди проверенных профессионалов.
            Рейтинги, портфолио, специализации — всё на одном экране.
          </p>

          <div className="fade-up-4 flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => scrollTo("designers")}
              className="px-8 py-3.5 rounded-full font-semibold text-sm transition-all hover:scale-105"
              style={{ background: "hsl(36,80%,58%)", color: "hsl(20,14%,4%)", boxShadow: "0 8px 32px hsl(36, 80%, 58%, 0.3)" }}>
              Смотреть дизайнеров
            </button>
            <button onClick={() => scrollTo("services")}
              className="px-8 py-3.5 rounded-full font-semibold text-sm transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.65)" }}>
              Наши услуги
            </button>
          </div>

          <div className="flex justify-center gap-12 mt-20 pt-12"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            {[["200+", "Проектов"], ["50+", "Дизайнеров"], ["4.9", "Средний рейтинг"]].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-gold font-bold" style={{ fontFamily: "'Cormorant', serif", fontSize: "2rem" }}>{num}</div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "4px" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ color: "rgba(255,255,255,0.25)" }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Скролл</span>
          <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)" }} />
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden py-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "hsl(20,12%,7%)" }}>
        <div className="flex animate-marquee whitespace-nowrap">
          {Array(4).fill(["Брендинг", "UX/UI Дизайн", "Иллюстрация", "Упаковка", "Моушн", "3D Визуализация", "Веб-дизайн", "Арт-дирекция"]).flat().map((item, i) => (
            <span key={i} className="mx-8 text-sm font-medium tracking-widest uppercase"
              style={{ color: i % 5 === 0 ? "hsl(36,80%,58%)" : "rgba(255,255,255,0.2)" }}>
              {item} {i % 3 === 0 ? "✦" : "·"}
            </span>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section id="services" className="py-28 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="mb-16">
          <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "hsl(36,80%,55%)", marginBottom: "1rem", fontWeight: 500 }}>— Что мы делаем</div>
          <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 300, color: "rgba(255,255,255,0.9)", lineHeight: 1.1 }}>
            Услуги для вашего<br /><em className="text-gold">бизнеса</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((s, i) => (
            <div key={i} className="card-lift p-6 rounded-2xl group cursor-pointer"
              style={{ background: "hsl(20,12%,7%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 transition-colors"
                style={{ background: "hsl(36, 80%, 58%, 0.1)" }}>
                <Icon name={s.icon} size={18} style={{ color: "hsl(36,80%,58%)" }} />
              </div>
              <h3 className="font-bold text-white mb-2" style={{ fontFamily: "'Golos Text', sans-serif", fontSize: "1rem" }}>{s.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem", lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DESIGNERS */}
      <section id="designers" className="py-28 overflow-hidden" style={{ background: "hsl(20,12%,6%)" }}>
        <div className="px-6 md:px-12 max-w-6xl mx-auto mb-14">
          <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "hsl(36,80%,55%)", marginBottom: "1rem", fontWeight: 500 }}>— Команда</div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 300, color: "rgba(255,255,255,0.9)", lineHeight: 1.1 }}>
              Наши<br /><em className="text-gold">дизайнеры</em>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.35)", maxWidth: "260px", fontSize: "0.875rem", lineHeight: 1.7 }}>
              Каждый прошёл отбор и подтвердил квалификацию реальными проектами.
            </p>
          </div>
        </div>

        <div className="h-scroll flex gap-6 px-6 md:px-12 overflow-x-auto pb-4">
          {DESIGNERS.map((d) => (
            <div key={d.id} className="card-lift flex-shrink-0 w-72 md:w-80 rounded-3xl overflow-hidden cursor-pointer"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="relative h-64 overflow-hidden">
                <img src={d.image} alt={d.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)" }} />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex gap-1.5 flex-wrap">
                    {d.tags.map((tag) => (
                      <span key={tag} className="tag-pill">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5" style={{ background: "hsl(20,12%,7%)" }}>
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-bold text-white text-base">{d.name}</h3>
                  <div className="flex items-center gap-1">
                    <span style={{ color: "hsl(36,80%,58%)", fontWeight: 700, fontSize: "0.875rem" }}>{d.rating}</span>
                    <span style={{ color: "hsl(36,80%,58%)", fontSize: "11px" }}>★</span>
                  </div>
                </div>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.875rem", marginBottom: "0.75rem" }}>{d.specialty}</p>
                <div className="flex items-center justify-between">
                  <StarRating value={d.rating} />
                  <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>
                    {d.experience} лет · {d.reviews} отзывов
                  </div>
                </div>
                <button className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                  style={{ background: "hsl(36, 80%, 58%, 0.1)", color: "hsl(36,80%,65%)", border: "1px solid hsl(36, 80%, 58%, 0.2)" }}>
                  Посмотреть профиль
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-28 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "hsl(36,80%,55%)", marginBottom: "1rem", fontWeight: 500 }}>— О платформе</div>
            <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: "rgba(255,255,255,0.9)", lineHeight: 1.15, marginBottom: "1.5rem" }}>
              Мы соединяем<br /><em className="text-gold">бизнес</em> и творчество
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: "1rem", lineHeight: 1.75, fontSize: "0.9rem" }}>
              FORMA — платформа, где каждый дизайнер прошёл ручной отбор.
              Мы проверяем портфолио, опыт и профессионализм, чтобы вы получили только лучших.
            </p>
            <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: "2rem", lineHeight: 1.75, fontSize: "0.9rem" }}>
              Здесь нет случайных исполнителей — только мастера своего дела,
              которые умеют превращать идеи в визуальные шедевры.
            </p>
            <div className="flex gap-8">
              {[["2019", "Год основания"], ["98%", "Довольных клиентов"]].map(([num, label]) => (
                <div key={label}>
                  <div className="text-gold font-bold" style={{ fontFamily: "'Cormorant', serif", fontSize: "2rem" }}>{num}</div>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "4px" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="blob absolute -inset-8 opacity-20 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle at 50% 50%, hsl(36,80%,58%), transparent 70%)" }} />
            <div className="relative rounded-3xl overflow-hidden" style={{ aspectRatio: "1" }}>
              <img src="https://cdn.poehali.dev/projects/c2a1fd4c-9a55-4aee-83c6-c7f71ec236fe/files/f7dbc85f-c4b3-47cf-a439-1d0b82ac3987.jpg"
                alt="О платформе" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, transparent 50%, rgba(14,10,8,0.6))" }} />
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-28 px-6 md:px-12" style={{ background: "hsl(20,12%,6%)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "hsl(36,80%,55%)", marginBottom: "1rem", fontWeight: 500 }}>— Отзывы</div>
            <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 300, color: "rgba(255,255,255,0.9)", lineHeight: 1.1 }}>
              Что говорят<br /><em className="text-gold">клиенты</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <div key={i} className="card-lift p-7 rounded-2xl"
                style={{ background: "hsl(20,12%,7%)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex gap-0.5 mb-5">
                  {Array(r.rating).fill(0).map((_, j) => (
                    <span key={j} style={{ color: "hsl(36,80%,58%)", fontSize: "14px" }}>★</span>
                  ))}
                </div>
                <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "1.5rem", fontFamily: "'Cormorant', serif", fontSize: "1.05rem", fontStyle: "italic" }}>
                  «{r.text}»
                </p>
                <div>
                  <div className="font-semibold text-white text-sm">{r.name}</div>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", marginTop: "2px" }}>{r.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-28 px-6 md:px-12 max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "hsl(36,80%,55%)", marginBottom: "1rem", fontWeight: 500 }}>— Контакты</div>
          <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 300, color: "rgba(255,255,255,0.9)", lineHeight: 1.1, marginBottom: "1rem" }}>
            Начнём<br /><em className="text-gold">работать</em>?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.875rem" }}>Расскажите о задаче — подберём подходящего дизайнера за 24 часа.</p>
        </div>

        <div className="rounded-3xl p-8 md:p-10" style={{ background: "hsl(20,12%,7%)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label style={{ display: "block", fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", marginBottom: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Ваше имя</label>
              <input
                type="text"
                placeholder="Иван Иванов"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
                style={{ background: "hsl(20,14%,8%)", border: "1px solid rgba(255,255,255,0.08)", color: "white" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", marginBottom: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Email</label>
              <input
                type="email"
                placeholder="hello@company.ru"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
                style={{ background: "hsl(20,14%,8%)", border: "1px solid rgba(255,255,255,0.08)", color: "white" }}
              />
            </div>
          </div>
          <div className="mb-6">
            <label style={{ display: "block", fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", marginBottom: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Расскажите о задаче</label>
            <textarea
              rows={4}
              placeholder="Мне нужен дизайнер для разработки логотипа..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none resize-none transition-all"
              style={{ background: "hsl(20,14%,8%)", border: "1px solid rgba(255,255,255,0.08)", color: "white" }}
            />
          </div>
          {formStatus === "error" && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: "hsl(348,60%,55%,0.12)", border: "1px solid hsl(348,60%,55%,0.3)", color: "hsl(348,60%,70%)" }}>
              {formError}
            </div>
          )}

          {formStatus === "success" ? (
            <div className="py-6 text-center rounded-xl" style={{ background: "hsl(36, 80%, 58%, 0.08)", border: "1px solid hsl(36, 80%, 58%, 0.2)" }}>
              <div style={{ fontSize: "2rem", marginBottom: "8px" }}>✦</div>
              <div style={{ color: "hsl(36,80%,65%)", fontWeight: 600, fontSize: "0.95rem" }}>Заявка отправлена!</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", marginTop: "4px" }}>Мы свяжемся с вами в течение 24 часов</div>
              <button onClick={() => setFormStatus("idle")} style={{ marginTop: "12px", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", textDecoration: "underline" }}>
                Отправить ещё
              </button>
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={formStatus === "loading"}
              className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02]"
              style={{ background: formStatus === "loading" ? "hsl(36,80%,40%)" : "hsl(36,80%,58%)", color: "hsl(20,14%,4%)", boxShadow: "0 8px 32px hsl(36, 80%, 58%, 0.25)", cursor: formStatus === "loading" ? "not-allowed" : "pointer" }}>
              {formStatus === "loading" ? "Отправляем..." : "Отправить заявку"}
            </button>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-10">
          {[
            { icon: "Mail", text: "Hover_naistert@mail.ru" },
            { icon: "Phone", text: "+7 993 232 05 84" },
            { icon: "Instagram", text: "Instagram" },
          ].map((c) => (
            <a key={c.icon} href="#" className="flex items-center gap-2 transition-colors hover:text-amber-400"
              style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.3)" }}>
              <Icon name={c.icon} size={14} />
              {c.text}
            </a>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 md:px-12" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-6xl mx-auto">
          <span style={{ fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: "0.8rem", color: "hsl(36, 80%, 58%, 0.4)" }}>FORMA</span>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem" }}>© 2024 Все права защищены</span>
          <div className="flex gap-6" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.2)" }}>
            <a href="#" className="hover:text-white transition-colors">Конфиденциальность</a>
            <a href="#" className="hover:text-white transition-colors">Оферта</a>
          </div>
        </div>
      </footer>

    </div>
  );
}