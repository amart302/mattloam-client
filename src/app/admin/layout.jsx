import styles from "./layout.module.scss";
import AdminSidebar from "@/components/adminSidebar/adminSidebar";

export const metadata = {
  title: "Панель управления",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
    yandex: {
      index: false, 
      follow: false,
    }
  }
};

export default function AdminLayout({ children }){

  return (
    <div className={ styles.layout }>
        <AdminSidebar />
        <main className={ styles.main }>
          { children }
        </main>
    </div>
  );
}