import Button from "./Button";

export const DashboardCard = ({ title, text, buton, onClick, icon }) => {
  return (
    <div className="flex flex-col justify-between p-6 w-full bg-white rounded-lg shadow">
      <>
        <div className="flex justify-between items-center">
          <h3 className="mb-3 text-xl font-semibold">{title}</h3>
          {icon}
        </div>
        <p className="mb-4 text-justify text-gray-600">{text}</p>
      </>
      <Button onClick={onClick}>{buton}</Button>
    </div>
  );
};
export const DashboardCard2 = ({
  title,
  icon,
  buton,
  children,
  text,
  onClick,
}) => {
  return (
    <div className="flex flex-col p-6 w-full bg-white rounded-lg shadow">
      <div className="flex justify-between items-center w-full">
        <h3 className="mb-3 text-xl font-semibold">{title}</h3>
        {icon}
      </div>
      <div className="w-full h-full">{children}</div>

      <div className="flex justify-between mt-4 w-full">
        {text && <div className="w-[100%] ">{text}</div>}{" "}
        {/* Ensure text is rendered correctly */}
        {buton && (
          <Button variant="secondary" onClick={onClick}>
            {buton}
          </Button>
        )}
      </div>
    </div>
  );
};

export const AlertCard = ({ title, alert, time, estado = "alto" }) => {
  const estadoClass = {
    alto: "p-2 border-2 border-red-500 bg-red-100 text-red-700",
    medio: "p-2 border-2 border-yellow-500 bg-yellow-100 text-yellow-700",
    bajo: "p-2 border-2 border-blue-500 bg-blue-100 text-blue-700",
  };
  return (
    <div className={`rounded-lg ${estadoClass[estado]}`}>
      <p className="font-semibold">{title}</p>
      <p className="text-sm">{alert}</p>
      <p className="pt-2 text-xs">{time}</p>
    </div>
  );
};
