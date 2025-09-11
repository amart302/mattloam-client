import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";

export default function HomeLayout({ children }) {
  return (
    <>
      <Header />
      <main className="main">
        { children }
      </main>
      <Footer />
    </>
  );
}