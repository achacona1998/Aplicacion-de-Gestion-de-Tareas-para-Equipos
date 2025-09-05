import { useState } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { BASE_TRANSITION } from "./const";
import { login, register } from "../../services/auth";
import { List } from "lucide-react";
import Input from "../UI/Input";
import FormSelect from "./FormSelect";

const Form = ({ selected, setSelected }) => {
  const navigate = useNavigate();
  const [formDataLogin, setFormDataLogin] = useState({
    email: "",
    password: "",
  });
  const [formDataRegister, setFormDataRegister] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const handleChangeLogin = (e) => {
    const { name, value } = e.target;
    setFormDataLogin((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleChangeRegister = (e) => {
    const { name, value } = e.target;
    setFormDataRegister((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(formDataLogin);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    }
  };
  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formDataRegister.password !== formDataRegister.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const userData = {
        username: formDataRegister.username,
        email: formDataRegister.email,
        password: formDataRegister.password,
        full_name: formDataRegister.name,
      };

      await register(userData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar usuario");
    }
  };
  const handleLoginOrRegister = (e) => {
    return selected === "login"
      ? handleSubmitLogin(e)
      : handleSubmitRegister(e);
  };

  return (
    <motion.div
      className="p-8 w-full text-black transition-colors duration-[750ms]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={BASE_TRANSITION}>
      <div className="flex justify-center flex-col">
        <div className="flex flex-col justify-center items-center gap2">
          <div className="flex items-center gap-2 text-blue-600">
            <List className="w-10 h-10 stroke-3" />
            <h1 className="font-bold text-[40px]">TaskMate</h1>
          </div>
          <h2 className="text-2xl font-bold">Bienvenido a TaskMate</h2>
          {selected === "login" ? (
            <p className="text-center text-lg text-gray-600">
              Inicia sesión para continuar con tu productividad
            </p>
          ) : (
            <p className="text-center text-lg text-gray-600">
              Crear una cuenta para continuar con tu productividad
            </p>
          )}
        </div>

        <form
          className="mt-8 w-full"
          onSubmit={(e) => handleLoginOrRegister(e)}>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {selected === "login" ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={BASE_TRANSITION}
                style={{ overflow: "hidden" }}>
                <Input
                  label="Correo Electrónico"
                  value={formDataLogin.email}
                  onChange={handleChangeLogin}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Ingrese su correo"
                  className="px-3 py-2 mb-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <Input
                  label=" Contraseña"
                  value={formDataLogin.password}
                  onChange={handleChangeLogin}
                  id="password"
                  name="password"
                  type="password"
                  placeholder=" Contraseña"
                  className="px-3 py-2 mb-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </motion.div>
            ) : (
              <motion.div
                key="register-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={BASE_TRANSITION}
                style={{ overflow: "hidden" }}>
                <Input
                  label="Nombre"
                  value={formDataRegister.name}
                  onChange={handleChangeRegister}
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Nombre completo"
                  className="px-3 py-2 mb-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <Input
                  label="Usuario"
                  value={formDataRegister.username}
                  onChange={handleChangeRegister}
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Usuario"
                  className="px-3 py-2 mb-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <Input
                  label="Email"
                  value={formDataRegister.email}
                  onChange={handleChangeRegister}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Ingrese su correo"
                  className="px-3 py-2 mb-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <Input
                  label="Contraseña"
                  value={formDataRegister.password}
                  onChange={handleChangeRegister}
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Contraseña"
                  className="px-3 py-2 mb-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <Input
                  label="Confirmar Contraseña"
                  value={formDataRegister.confirmPassword}
                  onChange={handleChangeRegister}
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Nombre completo"
                  className="px-3 py-2 mb-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      <div className="mb-6 flex justify-center items-center">
        <FormSelect selected={selected} setSelected={setSelected} />
      </div>

      <motion.button
        onClick={(e) => handleLoginOrRegister(e)}
        whileHover={{
          scale: 1.01,
        }}
        whileTap={{
          scale: 0.99,
        }}
        className="bg-blue-700 text-white transition-colors duration-[750ms] text-lg text-center rounded-lg w-full py-3 font-semibold">
        Submit
      </motion.button>
    </motion.div>
  );
};

export default Form;
