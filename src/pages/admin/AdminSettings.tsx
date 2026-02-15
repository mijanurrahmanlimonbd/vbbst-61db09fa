const AdminSettings = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-foreground">Settings</h2>
    <div className="bg-background rounded-xl border border-border p-6 space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground">Site Title</label>
        <input defaultValue="VBB STORE" className="mt-1 w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">Site Description</label>
        <textarea defaultValue="Your trusted source for verified Facebook Business Managers" rows={3} className="mt-1 w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">Contact Email</label>
        <input defaultValue="info@verifiedbmbuy.com" className="mt-1 w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <button className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Save Changes</button>
    </div>
  </div>
);

export default AdminSettings;
