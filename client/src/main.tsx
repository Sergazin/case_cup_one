import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { RouterProvider, createHashHistory, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { AuthCubit } from "./sections/auth/auth_cubit";
import { RepoCubit } from "./repo";

// Create a new router instance
const router = createRouter({ routeTree, history: createHashHistory() });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}

// CUBITS INITIALIZATION
AuthCubit.on_auth(async () => {
  await RepoCubit.init();
});

AuthCubit.init();
