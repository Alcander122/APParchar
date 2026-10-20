/**
 * Store global ligero de la aplicación.
 * Puede ser expandido con Zustand o React Context según se requiera.
 */
export interface AppUIState {
  isSidebarOpen: boolean;
  activeFilter: string;
}

export const initialUIState: AppUIState = {
  isSidebarOpen: false,
  activeFilter: "all",
};
