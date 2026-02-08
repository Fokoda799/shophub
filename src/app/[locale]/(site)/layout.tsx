import Header from "@/components/site/layout/Header";
import Footer from "@/components/site/layout/Footer";
import { CartProvider } from "@/context/CartContext";

type SiteLayoutProps = {
  children: React.ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <CartProvider>
      <Header />
        {children}
      <Footer />
    </CartProvider>
  );
}
