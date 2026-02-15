const AdminPages = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-foreground">Pages</h2>
      <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">New Page</button>
    </div>
    <div className="bg-background rounded-xl border border-border p-6">
      <div className="space-y-3">
        {["Home", "Shop", "Blog", "Contact Us", "About Us"].map((page, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <span className="font-medium text-foreground text-sm">{page}</span>
            <button className="text-primary text-xs font-medium hover:underline">Edit</button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AdminPages;
