import React, { createContext, useState, ReactNode } from 'react';

interface LocationContextType {
  pickupLocationLocal: string;
  setPickupLocationLocal: (value: string) => void;
  stopsLocal: string[];
  setStopsLocal: (value: string[]) => void;
  destinationLocal: string;
  setDestinationLocal: (value: string) => void;
  categoryOptionID?: any;
  setCategoryOptionID: (value: string) => void;
}

const LocationContext = createContext<LocationContextType | any>(undefined);

const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pickupLocationLocal, setPickupLocationLocal] = useState<string>('');
  const [stopsLocal, setStopsLocal] = useState<string[]>([]);
  const [destinationLocal, setDestinationLocal] = useState<string>('');
  const [categoryOptionID, setCategoryOptionID] = useState<string | any>();

  return (
    <LocationContext.Provider
      value={{
        pickupLocationLocal,
        setPickupLocationLocal,
        stopsLocal,
        setStopsLocal,
        destinationLocal,
        setDestinationLocal,
        categoryOptionID,
        setCategoryOptionID
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export { LocationProvider, LocationContext };
