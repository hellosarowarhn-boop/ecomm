import { Metadata } from 'next';
import HomeClient from './components/HomeClient';
import { getProducts, getSettings } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings?.site_name || "E-Commerce Store",
    description: settings?.hero_description || "Premium quality products.",
    icons: {
      icon: settings?.favicon || '/favicon.ico',
    }
  };
}

export default async function Home() {
  const products = await getProducts();
  const settings = await getSettings();

  return (
    <main>
      <HomeClient products={products} settings={settings} />
    </main>
  );
}
