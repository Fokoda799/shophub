import { listProducts } from "../../lib/products";
import AdminCreateProductForm from "../../components/AdminCreateProductForm";
import AdminProductRow from "../../components/AdminProductRow";

export default async function AdminPage() {
  const products = await listProducts();

  return (
    <main className="min-h-screen bg-white">
      <header className="mx-auto max-w-6xl px-4 py-8 flex items-center justify-between">
        <div>
          <div className="text-sm text-black/60">Admin</div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <a
          href="/shop"
          className="px-4 py-2 rounded-xl border border-black/10 hover:bg-black/5"
        >
          View Shop
        </a>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-14 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Create */}
        <div className="rounded-3xl border border-black/10 bg-white shadow-sm p-6">
          <h2 className="text-lg font-semibold">Add product</h2>
          <p className="text-sm text-black/60 mt-1">
            Create a new product and upload its images.
          </p>
          <div className="mt-6">
            <AdminCreateProductForm />
          </div>
        </div>

        {/* List */}
        <div className="rounded-3xl border border-black/10 bg-white shadow-sm p-6">
          <h2 className="text-lg font-semibold">Manage products</h2>
          <p className="text-sm text-black/60 mt-1">
            Edit, update images, or delete products.
          </p>

          <div className="mt-6 space-y-3">
            {products.length === 0 ? (
              <div className="text-sm text-black/60">No products yet.</div>
            ) : (
              products
                .slice()
                .reverse()
                .map((p) => <AdminProductRow key={p.$id} product={p} />)
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
