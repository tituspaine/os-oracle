import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { AuthorizedUseBanner } from "@/components/authorized-use-banner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="mono text-6xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">That path isn't in this reference.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            Back to distros
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">This page failed to render.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Try again
          </button>
          <a href="/" className="rounded-md border border-border bg-background px-4 py-2 text-sm">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "distro/ref — Linux distro & Kali tool command reference" },
      {
        name: "description",
        content:
          "Offline-first reference of every major Linux distribution, plus the full Kali Linux toolset — with commands, use cases, and error fixes.",
      },
      { property: "og:title", content: "distro/ref — Linux & Kali command reference" },
      {
        property: "og:description",
        content: "Purpose, best use cases, complete command list, and error solutions for every major Linux distro and Kali tool.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
  component: RootComponent,
});

function RootComponent() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground">
        <AuthorizedUseBanner />
        <SiteHeader />
        <main className="container mx-auto px-4 py-6">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
      <HeadContent />
      <Scripts />
    </QueryClientProvider>
  );
}
