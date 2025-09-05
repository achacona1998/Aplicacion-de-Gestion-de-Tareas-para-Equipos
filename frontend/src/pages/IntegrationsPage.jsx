import { useParams } from "react-router-dom";
import IntegrationsConfig from "../components/integrations/IntegrationsConfig";

const IntegrationsPage = () => {
  const { teamId } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Integraciones del Equipo</h1>
      <IntegrationsConfig teamId={teamId} />
    </div>
  );
};

export default IntegrationsPage;
