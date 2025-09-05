// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { BASE_TRANSITION } from "./const";

const FormSelect = ({ selected, setSelected }) => {
  return (
    <div className="border-[1px] rounded-lg border-gray-300 overflow-hidden font-medium w-fit shadow-md">
      <button
        className={`${
          selected === "login"
            ? "bg-blue-600 text-white"
            : "bg-white text-blue-600"
        } text-sm px-4 py-2 transition-colors duration-[750ms] relative`}
        onClick={() => setSelected("login")}>
        <span className="relative z-10">Inicia sesión aquí</span>
        {selected === "login" && (
          <motion.div
            transition={BASE_TRANSITION}
            layoutId="form-tab"
            className="absolute inset-0 bg-blue-600 z-0"
          />
        )}
      </button>
      <button
        className={`${
          selected === "register"
            ? "bg-blue-600 text-white"
            : "bg-white text-blue-600"
        } text-sm px-4 py-2 transition-colors duration-[750ms] relative`}
        onClick={() => setSelected("register")}>
        <span className="relative z-10">Regístrate aquí</span>
        {selected === "register" && (
          <motion.div
            transition={BASE_TRANSITION}
            layoutId="form-tab"
            className="absolute inset-0 bg-blue-600 z-0"
          />
        )}
      </button>
    </div>
  );
};

export default FormSelect;
