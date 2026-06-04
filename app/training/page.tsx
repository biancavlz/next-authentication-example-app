import { getTrainings } from "@/lib/training";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { signOutAction } from "@/actions/auth-actions";
import { redirect } from "next/navigation";

export default async function TrainingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const trainingSessions = getTrainings();

  return (
    <main>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Find your favorite activity</h1>
        <div style={{ textAlign: "right" }}>
          <p>Welcome, {session.user.email}</p>
          <form action={signOutAction}>
            <button type="submit">Logout</button>
          </form>
        </div>
      </div>
      <ul id="training-sessions">
        {trainingSessions.map((training) => (
          <li key={training.id}>
            <img src={`/trainings/${training.image}`} alt={training.title} />
            <div>
              <h2>{training.title}</h2>
              <p>{training.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
