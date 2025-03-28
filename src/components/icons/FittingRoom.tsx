
import { SVGProps } from "react";

const FittingRoom = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      <path d="M13.87 20.5a9 9 0 0 1-2.37-3 9 9 0 0 1-3-2.37" />
      <path d="m12 12 3-3 3 3-3 3Z" />
      <path d="m18 12 3-3 3 3-3 3Z" />
      <path d="m6 6 3-3 3 3-3 3Z" />
    </svg>
  );
};

export default FittingRoom;
