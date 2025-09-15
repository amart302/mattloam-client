import AdminChecker from "@/components/adminChecker/adminChecker";

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
  return <AdminChecker>{ children }</AdminChecker>;
}