import { Link } from "react-router-dom";
import { ABOUT } from "../data.js";
import { useShop } from "../store.js";
import Nav from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";

export default function About() {
  const { settings } = useShop();
  const map = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`;
  return (
    <>
      <div className="subhead"><Nav /></div>
      <main>
        <section className="sec about-hero">
          <div>
            <span className="eyebrow">✿ About {settings.name}</span>
            <h1 className="serif">{ABOUT.title}</h1>
            <p>{ABOUT.intro}</p>
            <div className="row"><Link className="pill orange" to="/menu">See the menu ↗</Link><a className="pill outline" href={map} target="_blank" rel="noreferrer">Get directions</a></div>
          </div>
          <div className="collage">
            <img className="c1" src={ABOUT.images[0]} alt="Our coffee house" />
            <img className="c2" src={ABOUT.images[1]} alt="A freshly poured coffee" />
            <img className="c3" src={ABOUT.images[2]} alt="Fresh pastries" />
          </div>
        </section>

        <section className="sec about-story">
          <img src={ABOUT.storyImage} alt="Guests enjoying coffee" loading="lazy" />
          <div>
            <h2 className="serif">Our story</h2>
            {ABOUT.story.map((t, i) => <p key={i}>{t}</p>)}
          </div>
        </section>

        <section className="sec">
          <div className="head-c"><span className="eyebrow">✿ What we care about</span><h2 className="serif">Small place, big on detail</h2></div>
          <div className="values">
            {ABOUT.values.map(([i, t, d]) => <div className="value" key={t}><i>{i}</i><h4>{t}</h4><p>{d}</p></div>)}
          </div>
        </section>

        <section className="sec">
          <div className="visit">
            <div><h2 className="serif">Come say hello</h2><p>{settings.address}</p><p>{settings.hours}</p><p>{settings.phoneLabel}</p></div>
            <div className="row">
              <a className="pill orange" href={map} target="_blank" rel="noreferrer">Get directions ↗</a>
              <a className="pill ghost-d" href={`https://wa.me/${settings.phone}`} target="_blank" rel="noreferrer">Message on WhatsApp</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
