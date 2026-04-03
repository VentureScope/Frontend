export default function Header() {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-xl font-semibold">
        Career Intelligence Center
      </h1>

      <input
        type="text"
        placeholder="Search..."
        className="border rounded-lg px-3 py-1"
      />
    </div>
  );
}