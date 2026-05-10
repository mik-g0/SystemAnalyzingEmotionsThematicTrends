import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <main style={{ padding: "0px" }}>
        {children}
      </main>
    </div>
  );
}