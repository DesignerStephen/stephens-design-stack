import Image from "next/image";

export default function Logo() {
  return (
    <div
      className="flex items-center justify-center rounded-xl border-4 border-white bg-primary"
      style={{
        width: 88,
        height: 88,
        boxShadow: "4px 4px 0px -2px rgba(0, 0, 0, 0.25)",
      }}
    >
      <Image src="/Figma.svg" alt="Figma logo" width={48} height={48} />
    </div>
  );
}
