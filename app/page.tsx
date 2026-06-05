import AuthForm from "@/components/auth-form";

interface HomeProps {
  searchParams: Promise<{ mode?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const formMode = params.mode || "login";

  return <AuthForm mode={formMode} />;
}
