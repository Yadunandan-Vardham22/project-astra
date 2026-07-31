function Nebula() {
  return (
    <div
      className={
        `absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5
        blur-[300px] pointer-events-none
        w-[120vmax] h-[120vmax]
        sm:w-[90vmax] sm:h-[90vmax]
        md:w-[60vmax] md:h-[60vmax]
        lg:w-[1200px] lg:h-[1200px]`
      }
    />
  );
}

export default Nebula;