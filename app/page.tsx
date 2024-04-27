import Image from "next/image";
import Wordle from "./components/wordle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center m-0 p-4">
      <Wordle />
    </main>
  );
}
