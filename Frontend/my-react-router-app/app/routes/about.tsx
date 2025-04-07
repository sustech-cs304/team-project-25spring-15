import { Link } from "react-router";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Link to="/" className="text-blue-500 hover:underline flex items-center mb-6">
        ← Go to demo
      </Link>
      <h1 className="text-4xl font-bold text-gray-900 mb-6">About React Router Contacts</h1>

      <div className="prose prose-lg">
        <p>
          This is a demo application showing off some of the
          powerful features of React Router, including
          dynamic routing, nested routes, loaders, actions,
          and more.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Features</h2>
        <p>
          Explore the demo to see how React Router handles:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Data loading and mutations with loaders and actions</li>
          <li>Nested routing with parent/child relationships</li>
          <li>URL-based routing with dynamic segments</li>
          <li>Pending and optimistic UI</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Learn More</h2>
        <p>
          Check out the official documentation at{" "}
          <a href="https://reactrouter.com" className="text-blue-500 hover:underline">
            reactrouter.com
          </a>{" "}
          to learn more about building great web applications with React Router.
        </p>
      </div>
    </div>
  );
}
