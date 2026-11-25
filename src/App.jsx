import Hero from "./components/Hero.jsx";
import Categories from "./components/Categories.jsx";
import Story from "./components/Story.jsx";
import Products from "./components/Products.jsx";
import Ribbons from "./components/Ribbons.jsx";
import Instagram from "./components/Instagram.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <>
      <Hero />
      <main>
        <Categories />
        <Story />
        <Products />
        <Ribbons />
        <Instagram />
      </main>
      <Footer />
    </>
  );
}
