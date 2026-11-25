import { STORY } from "../data.js";

export default function Story() {
  return (
    <section className="sec story" id="story">
      <div className="story-l">
        <h2 className="story-title">{STORY.title}</h2>
        <p>{STORY.text}</p>
      </div>
      <div className="story-grid">
        {STORY.steps.map((s, i) => (
          <div className={"story-col" + (i % 2 ? " shift" : "")} key={s.n}>
            <div className="s-card text"><span className="s-n">{s.n}</span><h4>{s.t}</h4><p>{s.d}</p></div>
            <div className="s-card photo"><img src={s.image} alt={s.t} loading="lazy" /></div>
          </div>
        ))}
      </div>
    </section>
  );
}
