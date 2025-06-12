import Footer from '../components/Footer';
import HomeSection from '../components/Home';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* aca va a ir Contenido principal */}
      <main className="flex-grow">
        <section id="home" className="px-4 py-20">
       <HomeSection/>
        </section>
      </main>

      {/* Footer fijo al final */}
      <Footer />
    </div>
  );
}
