// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { BASE_TRANSITION } from "./const";

export const Images = ({ selected }) => {
  return (
    <div className="bg-white relative overflow-hidden w-full min-h-[100px]">
      <motion.div
        initial={false}
        animate={{
          x: selected === "login" ? "0%" : "100%",
        }}
        transition={BASE_TRANSITION}
        className="absolute inset-0 bg-slate-200 bg-[url(/assets/img/login.avif)] bg-cover bg-center"
      />
      <motion.div
        initial={false}
        animate={{
          x: selected === "register" ? "0%" : "-100%",
        }}
        transition={BASE_TRANSITION}
        className="absolute inset-0 bg-slate-200 bg-[url(/assets/img/register.avif)] bg-cover bg-center"
      />
    </div>
  );
};
