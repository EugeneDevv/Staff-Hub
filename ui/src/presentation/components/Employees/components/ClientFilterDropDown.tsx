import { useEffect, useState } from "react";
import { Client } from "../../../../domain/models/project.model";
import CustomDropdown from "../../AppInputs/CustomDropdown"
import { useLazyGetClientsQuery } from "../../../../application/services/authApi";
import { useDispatch } from "react-redux";
import { clearClientFilter, setClientFilter } from "../../../../application/slices/authSlice";

interface Props{
  setSearchCount: () => void;
}

const ClientFilterDropDown: React.FC<Props> = ({setSearchCount}) => {
  const clientId = localStorage.getItem("clientFilter");
  let loadedClient: number | undefined = undefined;
  if (clientId != null && (clientId?.length ?? 0) > 0) {
    loadedClient = +clientId;
  }
  
  const [fetchClients, data] = useLazyGetClientsQuery();
  
  const [loadedClients, setLoadedClients] = useState<Client[]>([]);
  
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchClientsData = async () => {
      await fetchClients({});
    };
    
    fetchClientsData();
  }, [fetchClients]);
  
  useEffect(() => {
    if (data) {
      const projects = data?.data?.data ?? [];
      setLoadedClients(projects);
    }
  }, [data]);
  
  const selectedClient = loadedClients.find(c => c.clientId === loadedClient);

  const handClientDropDownChange = async (value: string | null) => {

    if (value === 'All') {
      dispatch(clearClientFilter())
    } else{
    const client = loadedClients.find(client => client.clientName === value);

    if (client?.clientId) {
      dispatch(setClientFilter(client?.clientId))
      }
    }
    setSearchCount()

  };

  return (
    <div>
      <CustomDropdown options={['All'].concat(loadedClients.map((client) => client.clientName))} onSelect={handClientDropDownChange} errorMessage='' hint={loadedClient != 0 ? loadedClients.find(client => client.clientId === loadedClient)?.clientName : 'All'} initialSelection={selectedClient != undefined ? selectedClient.clientName : null} />
    </div>
  )
}

export default ClientFilterDropDown
