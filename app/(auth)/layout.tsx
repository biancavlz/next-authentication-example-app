import "../globals.css";

export const metadata = {
  title: "Next Auth",
  description: "Next.js Authentication",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function AuthRootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <header id="auth-header">
          <p>Welcome back!</p>
        </header>
        {children}
      </body>
    </html>
  );
}
