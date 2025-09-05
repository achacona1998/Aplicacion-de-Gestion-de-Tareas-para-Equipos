import { useNavigate } from "react-router-dom";
import {
  beneficios,
  caracts,
  caractsVisual,
} from "../components/startPage/const";
import { List } from "lucide-react";
import Button from "../components/UI/Button";
import { isAuthenticated } from "../services/auth";

const StartPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col justify-center items-center gap-2 mb-14">
        <div className="flex items-center gap-2 text-blue-600  ">
          <List className="w-16 h-16 stroke-3 " />
          <h1 className=" font-bold text-[56px]">TaskMate</h1>
        </div>
        <h2 className="text-4xl font-semibold">
          Gestión de proyectos simplificada para equipos remotos
        </h2>
        <p className="text-center text-lg">
          Optimiza la colaboracion y aumenta la productividad con nuestra
          plataforma integral de gestión de tareas
        </p>
      </div>
      <div className="grid grid-cols-4  gap-12  grid-rows-[auto_auto_auto]">
        <div className="col-span-4 grid grid-cols-3 gap-4 ">
          {caractsVisual.map((item, index) => (
            <div
              className="   flex flex-col text-black justify-center items-center border border-gray-400 rounded-xl gap-3 p-5"
              key={index}>
              <span className="p-3 bg-blue-300 flex justify-center items-center rounded-full">
                <item.icon className="text-blue-600 w-10 h-10 " />
              </span>
              <h3 className="text-xl font-bold">{item.titulo}</h3>
              <p className="text-gray-500 text-center">{item.descripcion}</p>
              <img
                src={item.foto}
                alt={`foto de ${item.titulo}`}
                className="h-72 w-full bg-green-400 bg-cover rounded-b-xl"
              />
            </div>
          ))}
        </div>
        <div className="col-span-4  row-start-2  grid grid-cols-4 ">
          <div className="col-span-2 bg-blue-200 rounded-lg p-6 ">
            <h3 className="text-3xl font-bold text-blue-600 pb-3">
              Beneficios para Equipos Remotos
            </h3>
            {beneficios.map((item, index) => (
              <div className="text-blue-600 pt-6" key={index}>
                <h3 className="text-xl font-bold">{item.titulo}</h3>
                <p className="text-lg">{item.descripcion}</p>
              </div>
            ))}
          </div>
          <img
            src="/assets/img/4.avif"
            alt="foto de equipo"
            className="  rounded-b-xl col-span-2"
          />
        </div>
        <div className="col-span-4  row-start-3 bg-blue-500 p-10  text-white rounded-xl grid grid-cols-3 items-center">
          <div className="space-y-8 col-span-2 pr-6 ">
            <h3 className="text-4xl font-bold">
              Listo para optimizar la gestión de tus proyectos?
            </h3>
            <p className="text-2xl">
              Únete a miles de equipos que ya han mejorado su productividad con
              TaskMate.
              <br /> Comienza hoy mismo y transforma la manera en que tu equipo
              colabora.
            </p>
            <div className="flex gap-3 justify-start items-center">
              <Button
                variant="secondary1"
                className="text-xl"
                onClick={() => navigate("/dashboard")}>
                {" "}
                Explorar TaskMate
              </Button>
              <Button
                variant="secondary2"
                className="text-xl"
                onClick={() =>
                  navigate(isAuthenticated ? "/dashboard" : "/auth")
                }>
                {" "}
                Iniciar Sesión
              </Button>
            </div>
          </div>
          <img
            src="/assets/img/5.avif"
            alt="foto de equipo"
            className="min-w-64 w-full h-full bg-cover rounded-b-xl"
          />
        </div>
        {caracts.map((item, index) => (
          <div
            className="row-start-4 flex flex-col text-black justify-center items-center border border-gray-400 rounded-xl gap-3 p-5"
            key={index}>
            <span className="p-3 bg-blue-300 flex justify-center items-center rounded-full">
              <item.icon className="text-blue-600 w-7 h-7 " />
            </span>
            <h3 className="text-xl font-bold">{item.titulo}</h3>
            <p className="text-center">{item.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default StartPage;
