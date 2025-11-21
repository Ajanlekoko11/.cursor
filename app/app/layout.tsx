import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Navbar from '@/components/custom/Navbar';
import Footer from '@/components/custom/Footer';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  // Only redirect if there's NO session cookie at all
  // If cookie exists, render the page and let client-side handle auth verification
  // This prevents immediate logout for newly created sessions that haven't been
  // loaded into Zero Connector's in-memory cache yet
  if (!sessionToken) {
    redirect('/login');
  }

  // If session cookie exists, always render the page
  // Client-side components (Navbar, Dashboard, etc.) will verify the session via /api/auth/me
  // This prevents race conditions where session verification happens before
  // the session is loaded into Zero Connector's in-memory cache
  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-1">{children}</main>
      <Footer />
    </div>
  );
}

