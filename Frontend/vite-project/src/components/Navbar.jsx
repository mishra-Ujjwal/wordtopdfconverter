function Navbar() {
  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-40 shadow-lg h-16 fixed">
      <div className="flex justify-between items-center h-full">
        <h1 className="text-xl font-bold">
            Word  <span className="text-3xl text-green-500"> To </span>    PDF
            </h1>
        <h1 className="mt-1 cursor-pointer text-2xl font-bold  hover:scale-125 duration-300">Home</h1>
      </div>
    </div>
  );
}

export default Navbar;
